/* ensemble.suitor-ambush-crew — the suitors' picked men lying in wait.
   ENSEMBLE asset. A repeatable ARMED crew built from ONE separable member
   template (a warrior figure + a work/watch rig + weapon) instanced N times
   across depth bands, with FORMATION (boarding-line | rowing-bank | watch),
   density, ATTENTION (heads turned down the narrow channel), and a
   reaction-wave ("ready" pulse) that sweeps the line. Drawn in SOLID grays +
   hard contour into the offscreen ctx; the engine dotify POST pass supplies
   the halftone. Do NOT bake named characters in.
   Atlas OD-B04-S07 — armed selected men provisioning, boarding, rowing, and
   watching a narrow channel where they mean to ambush Telemachus. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* ---- the labours / postures the ambush requires ---- */
const TASKS = ["provision-arms","board-ship","row-oar","watch-channel"];

/* ---- FORMATIONS: the same member template arranged four ways.
   Each roster entry = { task, band(0 back..2 front), x(0..1), flip(+1 R/-1 L) }. */
const FORMATIONS = {
  // the general ambush: every labour + the watch at once (reusable hero view)
  ambush: [
    { task:"watch-channel",  band:0, x:0.30, flip: 1 },
    { task:"watch-channel",  band:0, x:0.70, flip:-1 },
    { task:"provision-arms", band:1, x:0.19, flip: 1 },
    { task:"board-ship",     band:1, x:0.80, flip:-1 },
    { task:"row-oar",        band:2, x:0.26, flip: 1 },
    { task:"row-oar",        band:2, x:0.55, flip: 1 },
    { task:"row-oar",        band:2, x:0.84, flip: 1 },
  ],
  // stores + arms brought aboard up a gangplank in a diagonal line
  "boarding-line": [
    { task:"provision-arms", band:0, x:0.30, flip: 1 },
    { task:"provision-arms", band:0, x:0.52, flip: 1 },
    { task:"board-ship",     band:1, x:0.44, flip: 1 },
    { task:"board-ship",     band:1, x:0.68, flip: 1 },
    { task:"board-ship",     band:2, x:0.60, flip: 1 },
    { task:"provision-arms", band:2, x:0.86, flip: 1 },
    { task:"watch-channel",  band:2, x:0.18, flip:-1 },
  ],
  // the oarsmen ranged along the thwarts, ready to pull into the strait
  "rowing-bank": [
    { task:"row-oar", band:1, x:0.18, flip:1 },
    { task:"row-oar", band:1, x:0.41, flip:1 },
    { task:"row-oar", band:1, x:0.64, flip:1 },
    { task:"row-oar", band:1, x:0.87, flip:1 },
    { task:"row-oar", band:2, x:0.16, flip:1 },
    { task:"row-oar", band:2, x:0.39, flip:1 },
    { task:"row-oar", band:2, x:0.62, flip:1 },
    { task:"row-oar", band:2, x:0.85, flip:1 },
  ],
  // a line of sentries watching the narrow channel for the sail
  watch: [
    { task:"watch-channel",  band:0, x:0.24, flip: 1 },
    { task:"watch-channel",  band:0, x:0.50, flip: 1 },
    { task:"watch-channel",  band:0, x:0.76, flip:-1 },
    { task:"watch-channel",  band:1, x:0.36, flip: 1 },
    { task:"watch-channel",  band:1, x:0.64, flip:-1 },
    { task:"provision-arms", band:2, x:0.22, flip: 1 },
    { task:"board-ship",     band:2, x:0.80, flip:-1 },
  ],
};

const params = {
  formation:"ambush",
  bands:3,
  count: FORMATIONS.ambush.length,
  seaLevel:0.50,            // horizon (channel water line) fraction of H
  channel:{ x:0.5, gapTop:0.045, gapBot:0.14 }, // narrowing strait between headlands
  attention:0.7,            // 0 heads-down at labour .. 1 turned down the channel
  spread:1.0,               // formation width multiplier about centre
  density:1.0,              // 0 sparse (front band only) .. 1 full company
  ready:0.0,               // reaction-wave position 0..1 across the width
};

const BAND_Y   = [0.58, 0.745, 0.925];   // footline / thwart line per band
const BAND_S   = [150, 196, 264];        // member height px per band
const BAND_LVL = [3, 3, 4];              // tunic ink level per band

/* ============================================================
   MEMBER TEMPLATE — one armed warrior, drawn deterministically.
   cx/footY/s in px. task selects the rig + weapon; lvl tunic tone.
   opt carries {headDX, ready, channelX, channelY}.
   ============================================================ */
function warrior(pen, g, cx, footY, s, task, lvl, m, opt){
  const cloth = toneSolid(inkLevel(lvl));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const metal = toneSolid(inkLevel(7));
  const bronze= toneSolid(inkLevel(5));
  const jarT  = toneSolid(inkLevel(Math.min(6, lvl+2)));
  const cw = Math.max(3, s*0.018);
  const F  = m.flip;

  const seated = task==="row-oar";
  const hemY = seated ? footY - s*0.18 : footY;   // rowers sit on the thwart
  const torsoH = s*0.52;
  // rowers lean into the pull; the ready pulse deepens it slightly
  const leanDir = seated ? F : 0;
  const lean = leanDir * s*(0.08 + 0.05*(opt.ready||0));
  const shoulderY = hemY - torsoH;
  const shoulderW = s*0.30;
  const hemW      = seated ? s*0.40 : s*0.42;
  const headR     = s*0.135;
  const headCy    = shoulderY - headR*1.05;
  const hx = cx + lean + (opt.headDX||0);
  const hy = headCy;

  // ground shadow (standing men on the deck)
  if (!seated){
    g.fillStyle = "rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(cx, hemY+s*0.02, hemW*0.62, s*0.045, 0,0,7); g.fill();
  }

  // --- SHIELD slung on the back (behind torso) for watchers & provisioners ---
  if (task==="watch-channel" || task==="board-ship"){
    const sx = cx - F*shoulderW*0.34 + lean, sy = shoulderY + torsoH*0.30;
    pen.paint(()=>{ g.arc(sx, sy, s*0.155, 0,7); }, bronze, cw);
    pen.paint(()=>{ g.arc(sx, sy, s*0.045, 0,7); }, metal, cw*0.7);   // boss
    pen.seam(()=>{ g.arc(sx, sy, s*0.105, 0,7); }, cw*0.6);
  }

  // --- BACK ARM (behind torso) — task-posed ---
  drawBackArm(pen,g,{x:cx-F*shoulderW*0.5+lean, y:shoulderY+s*0.05}, task, s, F, cloth, skin, cw);

  // --- TORSO tunic (blocky trapezoid, sheared by lean at the shoulders) ---
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hemW/2, hemY);
    g.lineTo(cx-hemW/2, hemY);
    g.closePath();
  }, cloth, cw);
  // belt + a vertical fold seam
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.5+lean*0.6,shoulderY+torsoH*0.46); g.lineTo(cx+shoulderW*0.5+lean*0.6,shoulderY+torsoH*0.46); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx+lean*0.5, shoulderY+torsoH*0.5); g.lineTo(cx, hemY); }, cw*0.6);

  // --- NECK + HEAD ---
  pen.limb(()=>{ g.moveTo(cx+lean,shoulderY+s*0.01); g.lineTo(hx,hy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0,7); }, skin, cw);
  // hair cap over the crown
  pen.paint(()=>{ g.arc(hx, hy-headR*0.06, headR*1.02, Math.PI*1.02, Math.PI*1.98); }, hair, cw*0.8);

  // --- FRONT ARM + WEAPON / PROP (the visible labour) ---
  drawTask(pen,g,{cx,shoulderY,shoulderW,hemY,footY,s,F,lean,lvl,metal,bronze,jarT,skin,cloth,hair,cw,opt,task,hx,hy,headR});
}

/* back arm as a two-segment limb reaching to a task target */
function drawBackArm(pen,g,sh,task,s,F,cloth,skin,cw){
  let d={x:0,y:1};
  if (task==="watch-channel") d={x:-F*0.12,y:0.98};      // steadying a planted spear
  else if (task==="row-oar") d={x:F*0.55,y:0.55};        // out to the loom
  else if (task==="provision-arms") d={x:-F*0.2,y:0.95}; // at side
  else if (task==="board-ship") d={x:-F*0.3,y:0.9};      // hand on the gunwale
  const n=Math.hypot(d.x,d.y)||1; d={x:d.x/n,y:d.y/n};
  const L=s*0.28;
  const wr={x:sh.x+d.x*L, y:sh.y+d.y*L};
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(wr.x,wr.y); }, cloth, s*0.052);
  pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skin, cw*0.7);
}

/* a spear: shaft (mid) + bronze leaf head at the tip end */
function drawSpear(pen,g,x1,y1,x2,y2,s,metal,cw){
  pen.limb(()=>{ g.moveTo(x1,y1); g.lineTo(x2,y2); }, toneSolid(inkLevel(6)), s*0.028);
  const ang=Math.atan2(y2-y1,x2-x1);
  const hl=s*0.10, hw=s*0.035;
  const tx=x2+Math.cos(ang)*hl, ty=y2+Math.sin(ang)*hl;
  const px=-Math.sin(ang), py=Math.cos(ang);
  pen.paint(()=>{
    g.moveTo(x2+px*hw, y2+py*hw);
    g.lineTo(tx, ty);
    g.lineTo(x2-px*hw, y2-py*hw);
    g.closePath();
  }, metal, cw*0.8);
}

function drawTask(pen,g,C){
  const { cx,shoulderY,shoulderW,hemY,footY,s,F,lean,metal,bronze,jarT,skin,cloth,hair,cw,opt,task,hx,hy,headR } = C;
  const sh={x:cx+F*shoulderW*0.42+lean, y:shoulderY+s*0.05};

  if (task==="watch-channel"){
    // a sentry: spear planted vertical, gripped in the front fist; the other
    // hand shades the brow, looking down the narrow channel for the sail
    const grip={x:cx+F*s*0.22, y:shoulderY+s*0.02};
    // planted spear from the deck up past the head
    drawSpear(pen,g, grip.x, footY, grip.x, hy-headR*1.55, s, metal, cw);
    // front arm out to the spear grip
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(grip.x,grip.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.03,0,7); }, skin, cw*0.7);
    // shading hand raised to the brow (the "watching" read)
    const bw={x:hx-F*s*0.02, y:hy-headR*1.05};
    pen.limb(()=>{ g.moveTo(cx-F*shoulderW*0.3+lean, shoulderY+s*0.04); g.lineTo(hx-F*s*0.10, hy-headR*0.4); g.lineTo(bw.x,bw.y); }, cloth, s*0.05);
    pen.paint(()=>{ g.arc(bw.x,bw.y,s*0.03,0,7); }, skin, cw*0.7);
  }

  else if (task==="provision-arms"){
    // stores brought up: an amphora shouldered, near arm braced under it;
    // a spear carried upright against the same shoulder
    const jx=cx+F*s*0.15, jy=shoulderY-s*0.02;
    const wr={x:jx, y:jy+s*0.06};
    // spear slung upright behind the arm
    drawSpear(pen,g, cx+F*s*0.05, footY-s*0.02, cx+F*s*0.05, shoulderY-s*0.30, s, metal, cw);
    // arm up under the jar
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.14,shoulderY+s*0.04); g.lineTo(wr.x,wr.y); }, cloth, s*0.055);
    // amphora body + neck + mouth + handle
    pen.paint(()=>{ g.ellipse(jx, jy-s*0.06, s*0.10, s*0.15, 0,0,7); }, jarT, cw);
    pen.paint(()=>{ g.rect(jx-s*0.03, jy-s*0.28, s*0.06, s*0.12); }, bronze, cw);
    pen.paint(()=>{ g.ellipse(jx, jy-s*0.30, s*0.055, s*0.03, 0,0,7); }, jarT, cw);
    pen.seam(()=>{ g.moveTo(jx-s*0.09,jy-s*0.16); g.quadraticCurveTo(jx-s*0.14,jy-s*0.24,jx-s*0.04,jy-s*0.26); }, cw*0.7);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.03,0,7); }, skin, cw*0.7);
  }

  else if (task==="row-oar"){
    // seated at the thwart; both hands on the oar loom, the shaft angling
    // out over the gunwale and down to the channel water. A spear stands by.
    const grip={x:cx+F*s*0.14, y:shoulderY+s*0.22};
    const bladeInboard = { x:cx-F*s*0.08, y:shoulderY+s*0.10 };
    const bladeOutboard= { x:cx+F*s*0.72, y:footY-s*0.02 };
    // thwart / bench block under the rower
    pen.paint(()=>{ g.rect(cx-s*0.26, hemY-s*0.01, s*0.52, s*0.08); }, toneSolid(inkLevel(2)), cw);
    // stacked spear leaning against the thwart behind him
    drawSpear(pen,g, cx-F*s*0.22, footY, cx-F*s*0.30, shoulderY-s*0.24, s, metal, cw);
    // the oar shaft (loom -> blade), drawn behind the arms
    pen.ink(()=>{ g.moveTo(bladeInboard.x,bladeInboard.y); g.lineTo(bladeOutboard.x,bladeOutboard.y); }, cw*1.4);
    pen.paint(()=>{
      g.ellipse(bladeOutboard.x+F*s*0.06, bladeOutboard.y+s*0.04, s*0.055, s*0.11, F*0.5, 0,7);
    }, jarT, cw*0.8);
    // front arm out to the loom
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(grip.x,grip.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.03,0,7); }, skin, cw*0.7);
  }

  else if (task==="board-ship"){
    // stepping aboard: one hand grips a couched spear thrust forward/up,
    // the near foot climbing the gangplank cleat drawn at the hem
    const tip={x:cx+F*s*0.46, y:shoulderY-s*0.10};
    const grip={x:cx+F*s*0.16, y:shoulderY+s*0.06};
    // gangplank cleat / step under the lead foot
    pen.paint(()=>{ g.rect(cx+F*s*0.06, hemY-s*0.02, F*s*0.34, s*0.06); }, toneSolid(inkLevel(2)), cw);
    // couched spear from a butt near the hip up to the tip ahead
    drawSpear(pen,g, cx-F*s*0.10, shoulderY+s*0.30, tip.x, tip.y, s, metal, cw);
    // front arm along the spear to the grip
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(grip.x,grip.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.03,0,7); }, skin, cw*0.7);
  }
}

/* ============================================================
   STAGE — the narrow channel between two headlands, the ship's deck,
   then N armed members across depth bands.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const sea = (st.seaLevel ?? params.seaLevel) * H;
  const attention = st.attention ?? params.attention;
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const ready     = st.ready ?? params.ready;
  const formation = st.formation || params.formation;
  const roster0   = FORMATIONS[formation] || FORMATIONS.ambush;

  const chX = params.channel.x*W;
  const gapTop = params.channel.gapTop*W;   // half-width of the strait at the distance
  const gapBot = params.channel.gapBot*W;   // half-width at the near horizon

  // ---- SKY (lightest) ----
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,sea);

  // ---- distant SEA in the narrowing channel gap (mid tone) ----
  pen.paint(()=>{
    g.moveTo(chX-gapTop, 0);
    g.lineTo(chX+gapTop, 0);
    g.lineTo(chX+gapBot, sea);
    g.lineTo(chX-gapBot, sea);
    g.closePath();
  }, toneSolid(inkLevel(2)), 4);
  // wave rules receding up the strait (denser near, so the channel reads as water)
  g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.45;
  for(let j=1;j<=7;j++){
    const t=j/8, y=sea*(1-t*t);
    const hw=lerp(gapBot,gapTop,1-y/sea)*0.9;
    g.beginPath();
    for(let x=-hw;x<=hw;x+=W*0.02){ const yy=y+Math.sin(x*0.06+j)*2.4; if(x<=-hw) g.moveTo(chX+x,yy); else g.lineTo(chX+x,yy); }
    g.stroke();
  }
  g.globalAlpha=1;

  // ---- two HEADLANDS flanking the channel (mid tone so the watch reads
  //      against them; converging inward to pinch the strait) ----
  const cliff = toneSolid(inkLevel(4));
  const cap   = toneSolid(inkLevel(2));
  // left headland
  pen.paint(()=>{
    g.moveTo(0,0); g.lineTo(chX-gapTop, 0);
    g.lineTo(chX-gapBot, sea); g.lineTo(0, sea); g.closePath();
  }, cliff, 5);
  // right headland
  pen.paint(()=>{
    g.moveTo(chX+gapTop, 0); g.lineTo(W, 0);
    g.lineTo(W, sea); g.lineTo(chX+gapBot, sea); g.closePath();
  }, cliff, 5);
  // lit rock caps along the top edges (a lighter band = terrain read)
  pen.paint(()=>{ g.moveTo(0,0); g.lineTo(chX-gapTop,0); g.lineTo(chX-gapTop-W*0.02, H*0.10); g.lineTo(0,H*0.14); g.closePath(); }, cap, 4);
  pen.paint(()=>{ g.moveTo(chX+gapTop,0); g.lineTo(W,0); g.lineTo(W,H*0.14); g.lineTo(chX+gapTop+W*0.02,H*0.10); g.closePath(); }, cap, 4);
  // a couple of crag steps for texture on each headland inner face
  g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.5;
  for(let k=1;k<=3;k++){
    const yy=sea*(k/4);
    const lInner=lerp(chX-gapTop, chX-gapBot, yy/sea);
    const rInner=lerp(chX+gapTop, chX+gapBot, yy/sea);
    g.beginPath(); g.moveTo(lInner-W*0.10, yy); g.lineTo(lInner, yy+H*0.01); g.stroke();
    g.beginPath(); g.moveTo(rInner+W*0.10, yy); g.lineTo(rInner, yy+H*0.01); g.stroke();
  }
  g.globalAlpha=1;

  // ---- the ambush ship's DECK across the foreground (below the water line) ----
  g.fillStyle=inkLevel(2); g.fillRect(0,sea,W,H-sea);
  // hull sheer / gunwale line
  pen.ink(()=>{ g.moveTo(W*0.02, sea); g.quadraticCurveTo(W*0.5, sea+H*0.02, W*0.98, sea); }, 4);
  // a few deck plank seams
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
  for(let j=1;j<=4;j++){ const y=sea+(H-sea)*(j/5); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // ---- members, drawn back band -> front band (painter's order) ----
  const roster = roster0
    .map((m,i)=>({ m, i }))
    .filter(({m})=> density>=1 ? true : m.band >= Math.round((1-density)*(params.bands-1)))
    .sort((a,b)=> a.m.band - b.m.band);

  roster.forEach(({m})=>{
    const footY = BAND_Y[m.band]*H;
    const s     = BAND_S[m.band];
    const lvl   = BAND_LVL[m.band];
    const nx = 0.5 + (m.x-0.5)*spread;
    const cx = clamp(nx,0.06,0.94)*W;
    // attention: turn head toward the channel mouth (bounded)
    const headDX = clamp((chX-cx)*0.12*attention, -s*0.10, s*0.10);
    // reaction-wave: a "ready" pulse sweeping across the line by x
    const local = clamp01(1 - Math.abs(ready - m.x)*4);
    warrior(pen, g, cx, footY, s, m.task, lvl, m, { headDX, ready: local, channelX:chX, channelY:sea });
  });
}

export const asset = {
  id:"ensemble.suitor-ambush-crew",
  type:"ENSEMBLE",
  name:"Suitor ambush crew",
  statusWord:"LYING IN WAIT",
  scene:"OD-B04-S07",

  params,
  // ONE armed member template + rig, instanced across depth bands
  member:{ template:"warrior", tasks:TASKS, formations:Object.keys(FORMATIONS), armed:true },
  // back -> front draw order
  layers:["sky","channel","headlands","deck","band-back","band-mid","band-front"],
  // normalized placement / camera / terrain anchors (NOT baked characters)
  anchors:{
    "channel:mouth":{x:.50,y:.02},
    "channel:near":{x:.50,y:.50},
    "headland:left":{x:.20,y:.30},
    "headland:right":{x:.80,y:.30},
    "station:watch":{x:.50,y:.58},
    "station:provision":{x:.20,y:.745},
    "station:gangplank":{x:.80,y:.745},
    "station:thwarts":{x:.50,y:.925},
    "camera:wide":{x:.50,y:.50},
    "entrance:strand":{x:.06,y:.60}, "exit:seaward":{x:.50,y:.06},
  },
  // walkable deck / thwart region for scene pathing/placement
  zones:{ deck:{ x0:.06,y0:.54,x1:.94,y1:.80 }, thwarts:{ x0:.08,y0:.82,x1:.92,y1:.98 } },
  states:{
    initial:"ambush",
    nodes:{
      ambush:{        preview:{ formation:"ambush",       attention:0.7,  spread:1.0, density:1.0, ready:0.0 } },
      "boarding-line":{preview:{ formation:"boarding-line",attention:0.5, spread:1.0, density:1.0, ready:0.35 } },
      "rowing-bank":{ preview:{ formation:"rowing-bank",  attention:0.4,  spread:1.0, density:1.0, ready:0.5 } },
      watch:{         preview:{ formation:"watch",        attention:0.95, spread:1.0, density:1.0, ready:0.0 } },
    },
    edges:[["boarding-line","rowing-bank"],["rowing-bank","watch"],["ambush","watch"],["ambush","boarding-line"]],
  },
  channels:["formation","attention","ready","density","spread"],

  preview:()=>({ formation:"ambush", attention:0.7, spread:1.0, density:1.0, ready:0.0, status:"LYING IN WAIT", progress:.24 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
