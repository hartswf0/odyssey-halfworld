/* ensemble.odysseuss-fleet-crews — Odysseus's armed ship's companies ashore.
   ENSEMBLE asset. A repeatable band of armed sailors built from ONE separable
   member template (a warrior figure + a weapon/stance rig) instanced N times
   across depth bands, with FORMATION (raid | feast | defend), density,
   ATTENTION (heads turned to the threat vs. down at the cups), and a
   reaction-wave ("surge" pulse — a forward thrust in the raid, a recoil in the
   defence) that sweeps the line. Drawn in SOLID grays + hard contour into the
   offscreen ctx; the engine dotify POST pass supplies the halftone. Do NOT bake
   named characters in.
   Atlas OD-B09-S02 — victorious raiders sacking Ismarus, becoming undisciplined
   feasters on the shore, then desperate defenders when the Cicones counter. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* ---- the member's four weapon/stance rigs ---- */
const TASKS = ["raid-spear","raid-sword","feast-cup","defend-shield"];
const STANCE = { "raid-spear":"stride", "raid-sword":"stride", "feast-cup":"sit", "defend-shield":"crouch" };

/* ---- FORMATIONS: the same armed member arranged three ways.
   Each roster entry = { task, band(0 back..2 front), x(0..1), flip(+1 R/-1 L) }. */
const FORMATIONS = {
  // victorious raiders advancing up the beach, weapons raised
  raid: [
    { task:"raid-spear", band:0, x:0.30, flip: 1 },
    { task:"raid-sword", band:0, x:0.66, flip: 1 },
    { task:"raid-spear", band:1, x:0.20, flip: 1 },
    { task:"raid-sword", band:1, x:0.55, flip: 1 },
    { task:"raid-spear", band:1, x:0.86, flip: 1 },
    { task:"raid-sword", band:2, x:0.30, flip: 1 },
    { task:"raid-spear", band:2, x:0.72, flip: 1 },
  ],
  // careless feasters sprawled around the fire, cups raised, arms grounded
  feast: [
    { task:"feast-cup",  band:0, x:0.32, flip: 1 },
    { task:"feast-cup",  band:0, x:0.68, flip:-1 },
    { task:"feast-cup",  band:1, x:0.18, flip: 1 },
    { task:"feast-cup",  band:1, x:0.80, flip:-1 },
    { task:"feast-cup",  band:2, x:0.26, flip: 1 },
    { task:"feast-cup",  band:2, x:0.55, flip:-1 },
    { task:"feast-cup",  band:2, x:0.82, flip:-1 },
  ],
  // desperate defenders crouched in a shield line, spears couched at the threat
  defend: [
    { task:"defend-shield", band:0, x:0.34, flip: 1 },
    { task:"defend-shield", band:0, x:0.66, flip:-1 },
    { task:"defend-shield", band:1, x:0.22, flip: 1 },
    { task:"defend-shield", band:1, x:0.50, flip: 1 },
    { task:"defend-shield", band:1, x:0.78, flip:-1 },
    { task:"defend-shield", band:2, x:0.30, flip: 1 },
    { task:"defend-shield", band:2, x:0.72, flip:-1 },
  ],
};

const params = {
  formation:"raid",
  bands:3,
  count: FORMATIONS.raid.length,
  shoreLevel:0.46,          // horizon (sea/land line) fraction of H
  attention:0.85,           // 0 heads-down at the cups .. 1 turned to the threat
  spread:1.0,               // formation width multiplier about centre
  density:1.0,              // 0 sparse (front band only) .. 1 full company
  surge:0.0,                // reaction-wave position 0..1 across the width
};

const BAND_Y   = [0.60, 0.75, 0.94];    // footline per band
const BAND_S   = [150, 196, 268];       // member height px per band
const BAND_LVL = [3, 3, 4];             // tunic ink level per band

/* ============================================================
   MEMBER TEMPLATE — one armed sailor, drawn deterministically.
   cx/footY/s in px. task selects the weapon/stance rig; lvl tunic tone.
   opt carries {headDX, surge, focusX}.
   ============================================================ */
function warrior(pen, g, cx, footY, s, task, lvl, m, opt){
  const cloth = toneSolid(inkLevel(lvl));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const metal = toneSolid(inkLevel(7));
  const bronze= toneSolid(inkLevel(5));
  const cw = Math.max(3, s*0.018);
  const F  = m.flip;
  const stance = STANCE[task];
  const sit = stance==="sit", crouch = stance==="crouch";

  const torsoH = s*(crouch?0.40 : sit?0.44 : 0.52);
  const hemY   = sit ? footY - s*0.10 : footY - s*0.20;   // legs draw below the hem
  const shoulderY = hemY - torsoH;
  const shoulderW = s*0.30;
  const hemW      = s*(crouch?0.48 : sit?0.46 : 0.40);
  const headR     = s*0.135;
  // posture lean: raiders drive forward, defenders recoil, feasters loll back
  const surge = opt.surge||0;
  let lean = 0;
  if (stance==="stride") lean =  F*s*(0.10 + 0.06*surge);
  else if (crouch)       lean = -F*s*(0.06 + 0.05*surge);
  else if (sit)          lean = -F*s*0.05;
  const hx = cx + lean + (opt.headDX||0);
  const hy = shoulderY - headR*(crouch?0.85:1.05);

  // ground shadow
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY+s*0.015, hemW*0.66, s*0.045, 0,0,7); g.fill();

  // --- seat block for feasters (a low rock / driftwood they sprawl on) ---
  if (sit) pen.paint(()=>{ g.rect(cx-s*0.24, hemY+s*0.02, s*0.48, s*0.10); }, toneSolid(inkLevel(3)), cw);

  // --- BACK ARM (behind torso) — task-posed ---
  drawBackArm(pen,g,{x:cx-F*shoulderW*0.5+lean, y:shoulderY+s*0.05}, task, s, F, cloth, skin, cw);

  // --- LEGS (bare) below the hem, before the torso ---
  drawLegs(pen,g,cx,hemY,footY,s,F,stance,cw,surge,skin,cloth,metal);

  // --- slung SHIELD on the back for raiders (behind torso) ---
  if (task==="raid-spear" || task==="raid-sword"){
    const sx=cx - F*shoulderW*0.30 + lean, sy=shoulderY + torsoH*0.34;
    pen.paint(()=>{ g.arc(sx, sy, s*0.15, 0,7); }, bronze, cw);
    pen.paint(()=>{ g.arc(sx, sy, s*0.042, 0,7); }, metal, cw*0.7);
    pen.seam(()=>{ g.arc(sx, sy, s*0.10, 0,7); }, cw*0.6);
  }

  // --- TORSO tunic (blocky trapezoid, sheared by the lean) ---
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hemW/2, hemY);
    g.lineTo(cx-hemW/2, hemY);
    g.closePath();
  }, cloth, cw);
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.5+lean*0.6,shoulderY+torsoH*0.46); g.lineTo(cx+shoulderW*0.5+lean*0.6,shoulderY+torsoH*0.46); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx+lean*0.5, shoulderY+torsoH*0.5); g.lineTo(cx, hemY); }, cw*0.6);

  // --- NECK + HEAD ---
  pen.limb(()=>{ g.moveTo(cx+lean,shoulderY+s*0.01); g.lineTo(hx,hy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0,7); }, skin, cw);
  pen.paint(()=>{ g.arc(hx, hy-headR*0.06, headR*1.02, Math.PI*1.02, Math.PI*1.98); }, hair, cw*0.8);

  // --- FRONT ARM + WEAPON / PROP (the visible action) ---
  drawTask(pen,g,{cx,shoulderY,shoulderW,torsoH,hemY,footY,s,F,lean,metal,bronze,skin,cloth,hair,cw,opt,task,hx,hy,headR,lvl});
}

/* back arm — a two-segment limb reaching to a task target */
function drawBackArm(pen,g,sh,task,s,F,cloth,skin,cw){
  let d={x:-F*0.15,y:0.98};
  if (task==="raid-spear") d={x:-F*0.35,y:-0.8};        // trailing the shield strap up
  else if (task==="raid-sword") d={x:-F*0.30,y:0.5};    // braced back
  else if (task==="feast-cup") d={x:-F*0.5,y:0.7};      // sprawled hand on the ground
  else if (task==="defend-shield") d={x:-F*0.2,y:0.95}; // gripping the shield behind the boss
  const n=Math.hypot(d.x,d.y)||1; d={x:d.x/n,y:d.y/n};
  const L=s*0.26;
  const wr={x:sh.x+d.x*L, y:sh.y+d.y*L};
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(wr.x,wr.y); }, cloth, s*0.05);
  pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skin, cw*0.7);
}

/* bare legs below the hem, posture by stance */
function drawLegs(pen,g,cx,hemY,footY,s,F,stance,cw,surge,skin,cloth,metal){
  const lw = s*0.055;
  const sandal = (fx)=>{ pen.paint(()=>{ g.ellipse(fx+F*s*0.02, footY, s*0.075, s*0.03, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7); };
  const limb = (a,b,c)=>{ pen.limb(()=>{ g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); }, skin, lw*1.05);
                          pen.limb(()=>{ g.moveTo(b.x,b.y); g.lineTo(c.x,c.y); }, skin, lw*0.9); };
  if (stance==="sit"){
    // seated: thighs run forward off the seat, shins drop to the sand
    const hipL={x:cx-s*0.11,y:hemY+s*0.04}, hipR={x:cx+s*0.11,y:hemY+s*0.04};
    const kneeF={x:cx+F*s*0.24,y:hemY+s*0.10}, footF={x:cx+F*s*0.20,y:footY};
    const kneeN={x:cx+F*s*0.10,y:hemY+s*0.16}, footN={x:cx-F*s*0.04,y:footY};
    limb(hipR,kneeF,footF); limb(hipL,kneeN,footN);
    sandal(footF.x); sandal(footN.x);
    return;
  }
  if (stance==="crouch"){
    // wide braced stance, knees bent outward, weight low
    const hipL={x:cx-s*0.12,y:hemY}, hipR={x:cx+s*0.12,y:hemY};
    const kneeL={x:cx-s*0.24,y:hemY+s*0.09}, footL={x:cx-s*0.24,y:footY};
    const kneeR={x:cx+s*0.24,y:hemY+s*0.09}, footR={x:cx+s*0.24,y:footY};
    limb(hipL,kneeL,footL); limb(hipR,kneeR,footR);
    sandal(footL.x); sandal(footR.x);
    return;
  }
  // stride: front leg planted forward, back leg trailing (advance)
  const drive = s*(0.04 + 0.05*surge);
  const hipL={x:cx-s*0.09,y:hemY}, hipR={x:cx+s*0.09,y:hemY};
  const kneeFr={x:cx+F*(s*0.14+drive),y:hemY+s*0.11}, footFr={x:cx+F*(s*0.18+drive),y:footY};
  const kneeBk={x:cx-F*s*0.08,y:hemY+s*0.10}, footBk={x:cx-F*(s*0.12+drive*0.5),y:footY};
  // back leg first (depth)
  limb(hipL,kneeBk,footBk); sandal(footBk.x);
  limb(hipR,kneeFr,footFr); sandal(footFr.x);
}

/* a spear: shaft + bronze leaf head at the tip end */
function drawSpear(pen,g,x1,y1,x2,y2,s,metal,cw){
  pen.limb(()=>{ g.moveTo(x1,y1); g.lineTo(x2,y2); }, toneSolid(inkLevel(6)), s*0.026);
  const ang=Math.atan2(y2-y1,x2-x1), hl=s*0.10, hw=s*0.035;
  const tx=x2+Math.cos(ang)*hl, ty=y2+Math.sin(ang)*hl;
  const px=-Math.sin(ang), py=Math.cos(ang);
  pen.paint(()=>{ g.moveTo(x2+px*hw,y2+py*hw); g.lineTo(tx,ty); g.lineTo(x2-px*hw,y2-py*hw); g.closePath(); }, metal, cw*0.8);
}

function drawTask(pen,g,C){
  const { cx,shoulderY,shoulderW,torsoH,hemY,footY,s,F,lean,metal,bronze,skin,cloth,cw,opt,task,hx,hy,headR } = C;
  const sh={x:cx+F*shoulderW*0.42+lean, y:shoulderY+s*0.05};

  if (task==="raid-spear"){
    // spear thrust overhead-forward in the victory drive
    const surge = opt.surge||0;
    const grip={x:cx+F*s*0.20+lean, y:shoulderY-s*0.16};
    const butt={x:cx-F*s*0.14+lean, y:shoulderY+s*0.10};
    const tip ={x:cx+F*(s*0.58+s*0.10*surge)+lean, y:shoulderY-s*(0.42+0.06*surge)};
    drawSpear(pen,g, butt.x,butt.y, tip.x,tip.y, s, metal, cw);
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.16+lean,shoulderY-s*0.02); g.lineTo(grip.x,grip.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.032,0,7); }, skin, cw*0.7);
  }

  else if (task==="raid-sword"){
    // short sword raised overhead, a triumphant hack
    const surge = opt.surge||0;
    const grip={x:cx+F*s*0.16+lean, y:shoulderY-s*(0.28+0.05*surge)};
    const blTip={x:cx+F*s*0.30+lean, y:shoulderY-s*(0.62+0.08*surge)};
    // blade
    pen.limb(()=>{ g.moveTo(grip.x,grip.y); g.lineTo(blTip.x,blTip.y); }, metal, s*0.03);
    pen.paint(()=>{ g.moveTo(blTip.x,blTip.y); g.lineTo(blTip.x-F*s*0.02,blTip.y+s*0.02); g.lineTo(grip.x-F*s*0.01,grip.y); g.closePath(); }, metal, cw*0.6);
    // crossguard + grip
    pen.ink(()=>{ g.moveTo(grip.x-F*s*0.05,grip.y+s*0.01); g.lineTo(grip.x+F*s*0.05,grip.y-s*0.01); }, cw*1.1);
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.14+lean,shoulderY-s*0.06); g.lineTo(grip.x,grip.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.03,0,7); }, skin, cw*0.7);
  }

  else if (task==="feast-cup"){
    // a wine cup lifted; a discarded spear lies on the sand at the feet
    const wr={x:cx+F*s*0.22, y:hy+headR*0.2};
    // grounded spear (careless — laid aside)
    drawSpear(pen,g, cx-F*s*0.30, footY-s*0.01, cx+F*s*0.34, footY-s*0.05, s, metal, cw);
    // front arm up, cup at the lips
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx+F*s*0.14,shoulderY-s*0.02); g.lineTo(wr.x,wr.y); }, cloth, s*0.052);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.028,0,7); }, skin, cw*0.7);
    // kylix — shallow bowl on a stem, tipped
    pen.paint(()=>{
      g.moveTo(wr.x-F*s*0.02, wr.y-s*0.01);
      g.lineTo(wr.x+F*s*0.13, wr.y-s*0.03);
      g.lineTo(wr.x+F*s*0.10, wr.y+s*0.04);
      g.lineTo(wr.x+F*s*0.01, wr.y+s*0.035);
      g.closePath();
    }, toneSolid(inkLevel(4)), cw*0.8);
  }

  else if (task==="defend-shield"){
    // big round shield raised across the front; a spear couched over its rim
    const surge = opt.surge||0;
    const shx=cx+F*s*0.10, shy=shoulderY+torsoH*0.28;
    const shR=s*0.26;
    // couched spear butted low, tip out toward the threat (over the shield)
    const tip={x:cx+F*(s*0.60+s*0.06*surge), y:shoulderY-s*(0.02+0.06*surge)};
    drawSpear(pen,g, cx-F*s*0.16, shoulderY+torsoH*0.6, tip.x, tip.y, s, metal, cw);
    // the shield disc (front, covering the torso)
    pen.paint(()=>{ g.arc(shx, shy, shR, 0,7); }, bronze, cw);
    pen.paint(()=>{ g.arc(shx, shy, s*0.055, 0,7); }, metal, cw*0.7);   // boss
    pen.seam(()=>{ g.arc(shx, shy, shR*0.72, 0,7); }, cw*0.7);
    pen.seam(()=>{ g.arc(shx, shy, shR*0.42, 0,7); }, cw*0.6);
    // front hand gripping the spear over the rim
    const grip={x:cx+F*s*0.22, y:shoulderY-s*0.02};
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.03,0,7); }, skin, cw*0.7);
  }
}

/* ============================================================
   STAGE — the Ismarus shore: sea + a low sacked-town ridge behind,
   context props by formation, then N armed members across depth bands.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const shore = (st.shoreLevel ?? params.shoreLevel) * H;
  const attention = st.attention ?? params.attention;
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const surge     = st.surge ?? params.surge;
  const formation = st.formation || params.formation;
  const roster0   = FORMATIONS[formation] || FORMATIONS.raid;

  // ---- SKY (lightest) ----
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,shore);

  // ---- distant SEA band just under the sky (mid-light) ----
  const seaTop = shore - H*0.055;
  pen.paint(()=>{ g.rect(0, seaTop, W, shore-seaTop); }, toneSolid(inkLevel(2)), 3);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
  for(let j=1;j<=2;j++){ const y=seaTop+(shore-seaTop)*(j/3);
    g.beginPath(); for(let x=0;x<=W;x+=W*0.04){ const yy=y+Math.sin(x*0.05+j)*2; if(x===0)g.moveTo(x,yy); else g.lineTo(x,yy);} g.stroke(); }
  g.globalAlpha=1;

  // ---- the sacked TOWN of Ismarus: a low ridge of blocky walls on the horizon ----
  const ridgeY = seaTop;
  pen.paint(()=>{ g.rect(0, ridgeY-H*0.10, W, H*0.10); }, toneSolid(inkLevel(4)), 4);
  // battlement / roof-block silhouette
  g.fillStyle=inkLevel(5);
  for(let i=0;i<10;i++){ const bx=W*(0.03+i*0.098), bw=W*0.055, bh=H*(0.03+0.02*((i*7)%3));
    g.fillRect(bx, ridgeY-H*0.10-bh, bw, bh); }
  // a couple of taller towers
  g.fillStyle=inkLevel(6);
  g.fillRect(W*0.24, ridgeY-H*0.10-H*0.075, W*0.04, H*0.075);
  g.fillRect(W*0.70, ridgeY-H*0.10-H*0.06,  W*0.04, H*0.06);

  // ---- formation-specific CONTEXT over the town ----
  if (formation==="raid"){
    // smoke billowing from the burning town — stacked soft puffs
    for(const px of [0.25,0.50,0.74]){
      let x=W*px, y=ridgeY-H*0.10, r=W*0.028;
      for(let k=0;k<5;k++){
        pen.paint(()=>{ g.arc(x, y, r, 0,7); }, toneSolid(inkLevel(2)), 3);
        y-=H*0.045; x+=Math.sin(k*1.4+px*10)*W*0.02; r*=0.86;
      }
    }
  } else if (formation==="defend"){
    // a hedge of enemy spears cresting the ridge — the Cicones counter-attack
    g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.004); g.globalAlpha=0.7;
    for(let i=0;i<16;i++){ const bx=W*(0.04+i*0.06); g.beginPath();
      g.moveTo(bx, ridgeY-H*0.02); g.lineTo(bx-W*0.012, ridgeY-H*0.12); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- BEACH (foreground, lightest so it reads as sand) ----
  g.fillStyle=inkLevel(1); g.fillRect(0,shore,W,H-shore);
  pen.ink(()=>{ g.moveTo(0,shore); g.quadraticCurveTo(W*0.5,shore+H*0.012,W,shore); }, 3);
  // scattered ground marks
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.20;
  for(let j=1;j<=3;j++){ const y=shore+(H-shore)*(j/4); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // ---- central FIRE for the feast (careless bonfire on the sand) ----
  if (formation==="feast"){
    const fx=W*0.5, fy=shore+H*0.14;
    pen.paint(()=>{ g.ellipse(fx, fy+H*0.02, W*0.06, H*0.014, 0,0,7); }, toneSolid(inkLevel(3)), 4); // embers
    // crossed logs
    pen.limb(()=>{ g.moveTo(fx-W*0.05,fy+H*0.02); g.lineTo(fx+W*0.05,fy-H*0.005); }, toneSolid(inkLevel(6)), W*0.012);
    pen.limb(()=>{ g.moveTo(fx+W*0.05,fy+H*0.02); g.lineTo(fx-W*0.05,fy-H*0.005); }, toneSolid(inkLevel(6)), W*0.012);
    // flame stack
    pen.paint(()=>{ g.moveTo(fx-W*0.045,fy); g.quadraticCurveTo(fx-W*0.01,fy-H*0.09,fx,fy-H*0.12);
      g.quadraticCurveTo(fx+W*0.02,fy-H*0.07,fx+W*0.045,fy); g.closePath(); }, toneSolid(inkLevel(5)), 4);
    pen.paint(()=>{ g.moveTo(fx-W*0.02,fy); g.quadraticCurveTo(fx,fy-H*0.055,fx+W*0.012,fy-H*0.075);
      g.quadraticCurveTo(fx+W*0.018,fy-H*0.03,fx+W*0.022,fy); g.closePath(); }, toneSolid(inkLevel(2)), 3);
  }

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
    // attention focus: raiders look up the beach ahead, defenders at the ridge,
    // feasters barely look up at all
    let focusX;
    if (formation==="raid")   focusX = clamp(cx + m.flip*W*0.4, 0, W);
    else if (formation==="defend") focusX = W*0.5;
    else                      focusX = cx + m.flip*s*0.2;
    const headDX = clamp((focusX-cx)*0.14*attention, -s*0.10, s*0.10);
    // reaction-wave: a "surge" pulse sweeping across the line by x
    const local = clamp01(1 - Math.abs(surge - m.x)*4);
    warrior(pen, g, cx, footY, s, m.task, lvl, m, { headDX, surge: local, focusX });
  });
}

export const asset = {
  id:"ensemble.odysseuss-fleet-crews",
  type:"ENSEMBLE",
  name:"Odysseus's fleet crews",
  statusWord:"VICTORIOUS",
  scene:"OD-B09-S02",

  params,
  // ONE armed member template + weapon/stance rig, instanced across depth bands
  member:{ template:"warrior", tasks:TASKS, stances:STANCE, formations:Object.keys(FORMATIONS), armed:true },
  // back -> front draw order
  layers:["sky","sea","town","context","beach","fire","band-back","band-mid","band-front"],
  // normalized placement / camera / terrain anchors (NOT baked characters)
  anchors:{
    "town:gate":{x:.50,y:.36},
    "town:tower":{x:.24,y:.30},
    "sea:landing":{x:.50,y:.44},
    "fire:hearth":{x:.50,y:.60},
    "line:back":{x:.50,y:.60},
    "line:mid":{x:.50,y:.75},
    "line:front":{x:.50,y:.94},
    "threat:ridge":{x:.50,y:.34},
    "camera:wide":{x:.50,y:.52},
    "entrance:ships":{x:.06,y:.80}, "exit:townward":{x:.50,y:.40},
  },
  // walkable beach region for scene pathing / placement
  zones:{ beach:{ x0:.06,y0:.50,x1:.94,y1:.98 }, hearth:{ x0:.42,y0:.55,x1:.58,y1:.66 } },
  states:{
    initial:"raid",
    nodes:{
      raid:{   preview:{ formation:"raid",   attention:0.85, spread:1.0, density:1.0, surge:0.35 } },
      feast:{  preview:{ formation:"feast",  attention:0.15, spread:1.0, density:1.0, surge:0.0  } },
      defend:{ preview:{ formation:"defend", attention:0.95, spread:1.0, density:1.0, surge:0.5  } },
    },
    edges:[["raid","feast"],["feast","defend"],["raid","defend"]],
  },
  channels:["formation","attention","surge","density","spread"],

  preview:()=>({ formation:"raid", attention:0.85, spread:1.0, density:1.0, surge:0.35, status:"VICTORIOUS", progress:.22 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
