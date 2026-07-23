/* vehicle.destroyed-fleet — eleven black galleys trapped and smashed in the basin.
   VEHICLE asset. The Laestrygonian harbor catastrophe (OD-B10-S02): a bay ringed
   by precipitous cliffs with a narrow channel mouth, its water crowded with the
   broken remains of eleven black ships. Reuses the black-ship look of
   vehicle.black-ithacan-ship / vehicle.twelve-ship-fleet — dark crescent hull,
   curling sternpost, single amidships mast — but BROKEN: split hulls, snapped
   masts, torn sails, sprung oars, and floating plank debris. Drawn EMPTY: no crew
   baked in (the empty decks ARE the crew-loss).

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Motion states cycle the disaster: impact (hulls crushed, first cracks) ->
   splinter (hulls breaking, masts snapping) -> sinking (going under) ->
   crew-loss (empty drifting wrecks) -> wreckage (settled debris field).
   Atlas: reusable boarded object; board/ride/dock anchors, motion states,
   capacity, collision — here the collision is the jammed wreck field. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, clamp01, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  ships:11,             // the eleven galleys destroyed in the harbor
  hullInk:6,            // dark hull tone (the "black ship")
  mastInk:5,
  sailInk:2,            // pale (torn) cloth
  waterInk:1,           // near-paper trapped water
  cliffInk:4,           // the ringing precipitous rock (mid tone, a frame not a wall)
  rockInk:6,            // the crushing boulders at the water's edge
  crestY:0.180,         // cliff skyline as fraction of H (light sky above)
  waterY:0.440,         // water surface as fraction of H
};

/* per-state pose for the whole basin.
   phase   = how far the destruction has progressed (0 crush .. 1 debris)
   submerge= how far hulls have settled under the surface
   churn   = agitation of the water / spray */
const POSE = {
  impact:   { phase:0.20, submerge:0.02, churn:1.00, status:"IMPACT",    progress:0.22 },
  splinter: { phase:0.52, submerge:0.12, churn:0.85, status:"SPLINTER",  progress:0.48 },
  sinking:  { phase:0.74, submerge:0.55, churn:0.55, status:"SINKING",   progress:0.72 },
  crewloss: { phase:0.82, submerge:0.42, churn:0.35, status:"CREW LOST", progress:0.86 },
  wreckage: { phase:0.95, submerge:0.34, churn:0.20, status:"WRECKAGE",  progress:1.00 },
};

/* deterministic tiny jitter so nothing lines up like a ruler */
function jit(i){ const s=Math.sin(i*12.9898)*43758.5453; return s-Math.floor(s); }

/* a short ragged edge helper: append a jagged line of `n` notches to the path */
function jagged(g, x0,y0, x1,y1, n, amp, seed){
  for (let k=0;k<=n;k++){
    const t=k/n, x=lerp(x0,x1,t), y=lerp(y0,y1,t);
    const off=(jit(seed+k)-0.5)*amp*(k===0||k===n?0.2:1);
    // perpendicular offset
    const dx=x1-x0, dy=y1-y0, dl=Math.hypot(dx,dy)||1;
    g.lineTo(x - dy/dl*off, y + dx/dl*off);
  }
}

/* ---- ONE WRECK, bow to the right, base at (0,0) after caller's transform ----
   opt: { ink, w, dmg(0..1), heel(rad), seed, t } ---------------------------- */
function drawWreck(pen, g, w, opt){
  const ink   = opt.ink ?? params.hullInk;
  const dmg   = clamp01(opt.dmg ?? 0.5);
  const seed  = opt.seed ?? 1;
  const T     = opt.t || 0;
  const h     = w*0.30;

  // key hull points (origin at waterline midship, local space)
  const sTopX=-w*0.46, sTopY=-h*0.92;      // sternpost top (left)
  const bStemX= w*0.44, bStemY=-h*0.86;    // bow stem (right)
  const ramX  = w*0.52, ramY=  h*0.10;     // ram (right, low)
  const sBotX =-w*0.48, sBotY= h*0.02;     // stern underside (left)
  const midSheer=-h*0.55, keelMid= h*0.55;

  /* sternpost curl (aphlaston) behind the hull — snapped short at high damage */
  const curlEnd = 1 - dmg*0.55;
  pen.limb(()=>{
    g.moveTo(sTopX, sTopY);
    g.quadraticCurveTo(-w*0.56, lerp(sTopY,-h*1.4,curlEnd), -w*0.44, lerp(sTopY,-h*1.75,curlEnd));
  }, toneSolid(inkLevel(ink)), Math.max(3, w*0.020));

  /* HULL — dark crescent (whole silhouette first) */
  const hull = ()=>{
    g.moveTo(sTopX, sTopY);
    g.quadraticCurveTo(0, midSheer, bStemX, bStemY);          // sheer stern -> bow
    g.quadraticCurveTo(w*0.50, -h*0.28, ramX, ramY);          // bow stem -> ram
    g.quadraticCurveTo(0, keelMid, sBotX, sBotY);             // keel underside
    g.quadraticCurveTo(-w*0.55, -h*0.30, sTopX, sTopY);       // sternpost
    g.closePath();
  };
  pen.paint(hull, toneSolid(inkLevel(ink)), Math.max(3, w*0.010));

  /* topstrake highlight just under the sheer so the gunwale reads (dark hulls) */
  if (ink>=4){
    g.save();
    g.strokeStyle=inkLevel(ink-4); g.lineWidth=Math.max(2, h*0.14); g.lineCap="round";
    g.beginPath();
    g.moveTo(sTopX+w*0.02, sTopY+h*0.14);
    g.quadraticCurveTo(0, midSheer+h*0.14, bStemX-w*0.02, bStemY+h*0.14);
    g.stroke();
    g.restore();
  }
  // a couple of sprung plank seams
  g.strokeStyle=inkLevel(Math.max(2,ink-2)); g.lineWidth=1.6;
  for (let s=1;s<=2;s++){ const off=h*0.22*s;
    g.beginPath();
    g.moveTo(sTopX+w*0.05, sTopY+h*0.32+off*0.6);
    g.quadraticCurveTo(0, midSheer+h*0.30+off, bStemX-w*0.05, bStemY+h*0.32+off*0.6);
    g.stroke();
  }

  /* ---- THE BREAK: a gap smashed through the hull amidships ---- */
  const breakX = (jit(seed)-0.5)*w*0.20;
  const gapHalf = Math.max(w*0.008, dmg*w*0.075);
  // fill the gap with water/paper tone so it reads as broken clean through
  g.fillStyle = inkLevel(params.waterInk);
  g.beginPath();
  g.moveTo(breakX-gapHalf, midSheer-h*0.06);
  jagged(g, breakX-gapHalf, midSheer-h*0.06, breakX-gapHalf*0.4, keelMid*0.9, 3, gapHalf*0.9, seed+3);
  g.lineTo(breakX+gapHalf*0.4, keelMid*0.9);
  jagged(g, breakX+gapHalf*0.4, keelMid*0.9, breakX+gapHalf, midSheer-h*0.06, 3, gapHalf*0.9, seed+7);
  g.closePath(); g.fill();
  // black splinter spikes along both edges of the break
  g.fillStyle=INK;
  for (let k=0;k<4;k++){
    const yy=lerp(midSheer, keelMid*0.9, (k+0.5)/4);
    const sp=gapHalf*(0.5+jit(seed+k)*0.9);
    g.beginPath(); g.moveTo(breakX-gapHalf, yy-3); g.lineTo(breakX-gapHalf+sp, yy); g.lineTo(breakX-gapHalf, yy+3); g.fill();
    g.beginPath(); g.moveTo(breakX+gapHalf, yy-3); g.lineTo(breakX+gapHalf-sp, yy); g.lineTo(breakX+gapHalf, yy+3); g.fill();
  }
  // hard contour around the break lips
  g.strokeStyle=INK; g.lineWidth=Math.max(2,w*0.008);
  g.beginPath(); g.moveTo(breakX-gapHalf, midSheer-h*0.06);
  jagged(g, breakX-gapHalf, midSheer-h*0.06, breakX-gapHalf*0.4, keelMid*0.9, 3, gapHalf*0.9, seed+3); g.stroke();
  g.beginPath(); g.moveTo(breakX+gapHalf, midSheer-h*0.06);
  jagged(g, breakX+gapHalf, midSheer-h*0.06, breakX+gapHalf*0.4, keelMid*0.9, 3, gapHalf*0.9, seed+7); g.stroke();

  /* ---- MAST + SAIL: leaning (early) or snapped (later) ---- */
  const baseX=breakX*0.3, baseY=midSheer;
  const mastLen = h*0.55 + w*0.85;
  if (dmg < 0.42){
    // whole mast, canted hard, torn sail luffing
    const lean = 0.16 + (jit(seed*2)-0.5)*0.5 + dmg*0.4;
    const tx = baseX + Math.sin(lean)*mastLen, ty = baseY - Math.cos(lean)*mastLen;
    pen.limb(()=>{ g.moveTo(baseX,baseY); g.lineTo(tx,ty); }, toneSolid(inkLevel(params.mastInk)), Math.max(3,w*0.020));
    // yard slung across near the top
    const yx=(tx-baseX)*0.14, yy=(ty-baseY)*0.14;
    const yA={x:tx-w*0.30+yx, y:ty+h*0.10}, yB={x:tx+w*0.22+yx, y:ty+h*0.02};
    pen.limb(()=>{ g.moveTo(yA.x,yA.y); g.lineTo(yB.x,yB.y); }, toneSolid(inkLevel(params.mastInk)), Math.max(2,w*0.013));
    // torn sail hanging from the yard (ragged lower edge)
    pen.paint(()=>{
      g.moveTo(yA.x, yA.y);
      g.lineTo(yB.x, yB.y);
      g.lineTo(yB.x-w*0.02, yB.y+h*1.0);
      jagged(g, yB.x-w*0.02, yB.y+h*1.0, yA.x+w*0.04, yA.y+h*0.9, 5, h*0.18, seed+11);
      g.closePath();
    }, toneSolid(inkLevel(params.sailInk)), Math.max(2,w*0.006));
  } else {
    // SNAPPED: a jagged stub + the fallen mast lying across the wreck / water
    const stub = mastLen*0.22;
    pen.paint(()=>{
      g.moveTo(baseX-w*0.016, baseY);
      g.lineTo(baseX-w*0.016, baseY-stub);
      g.lineTo(baseX+w*0.004, baseY-stub-h*0.10);   // jagged splinter tip
      g.lineTo(baseX+w*0.016, baseY-stub*0.8);
      g.lineTo(baseX+w*0.016, baseY);
      g.closePath();
    }, toneSolid(inkLevel(params.mastInk)), Math.max(2,w*0.010));
    // the fallen spar, pitched into the water on one side
    const fs = (jit(seed*3)<0.5)? -1 : 1;
    const fx0=baseX, fy0=baseY-stub*0.5;
    const fx1=baseX+fs*mastLen*0.72, fy1=baseY+h*0.55;
    pen.limb(()=>{ g.moveTo(fx0,fy0); g.lineTo(fx1,fy1); }, toneSolid(inkLevel(params.mastInk)), Math.max(2,w*0.016));
    // limp torn sail draped off the fallen spar
    pen.paint(()=>{
      g.moveTo(lerp(fx0,fx1,0.35), lerp(fy0,fy1,0.35));
      g.lineTo(lerp(fx0,fx1,0.85), lerp(fy0,fy1,0.85));
      g.lineTo(lerp(fx0,fx1,0.85)+fs*w*0.02, lerp(fy0,fy1,0.85)+h*0.5);
      jagged(g, lerp(fx0,fx1,0.85)+fs*w*0.02, lerp(fy0,fy1,0.85)+h*0.5,
                lerp(fx0,fx1,0.35)+fs*w*0.02, lerp(fy0,fy1,0.35)+h*0.42, 4, h*0.14, seed+13);
      g.closePath();
    }, toneSolid(inkLevel(params.sailInk+1)), Math.max(2,w*0.006));
  }

  /* ---- SPRUNG / BROKEN OARS jutting from the hull side ---- */
  const nOar = 3 + Math.round(jit(seed+5)*2);
  for (let i=0;i<nOar;i++){
    const px = lerp(sTopX+w*0.10, bStemX-w*0.10, (i+0.5)/nOar);
    const py = midSheer + h*0.10;
    const ang = -0.2 + (jit(seed+i*2)-0.5)*1.4;          // splayed at wild angles
    const olen = h*(0.7+jit(seed+i)*0.7)*(dmg>0.6?0.6:1); // snapped short late
    pen.limb(()=>{ g.moveTo(px,py); g.lineTo(px+Math.cos(ang)*olen, py+Math.sin(ang)*olen); },
             toneSolid(inkLevel(Math.max(3,ink-2))), Math.max(1.6,w*0.009));
  }
}

/* a floating debris plank on the water at (x,y), world space */
function drawPlank(pen,g,x,y,len,ang,ink){
  g.save(); g.translate(x,y); g.rotate(ang);
  pen.paint(()=>{ g.rect(-len/2,-len*0.10, len, len*0.20); }, toneSolid(inkLevel(ink)), 2);
  g.restore();
}

function drawBasin(ctx, W, H, st){
  const pen  = makePen(ctx, { outline:true });
  const soft = makePen(ctx, { outline:false });
  const g = ctx;
  const mode = st.mode || "splinter";
  const P = POSE[mode] || POSE.splinter;
  const T = st.t || 0;
  const waterY = H*params.waterY, crestY = H*params.crestY;

  /* ============ SKY above the ring of cliffs (light — keeps the label legible) */
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,waterY+2);

  /* ============ ENCLOSING CLIFFS (a mid-tone rock frame, crest to water) ==== */
  // the narrow channel mouth to the open sea — a modest notch, not a bright bar
  const chX=W*0.505, chW=W*0.050;
  const crest = x =>                                     // jagged skyline height at x
    crestY + (jit(x*0.31)-0.5)*H*0.11 + (Math.abs(x-chX)<chW ? H*0.14 : 0);
  // rock face fill (mid tone) from the jagged crest down to the waterline
  g.fillStyle=inkLevel(params.cliffInk);
  g.beginPath(); g.moveTo(0, waterY);
  for (let x=0;x<=W;x+=W*0.02){
    if (Math.abs(x-chX) < chW*0.55){ g.lineTo(x, waterY - H*0.02); continue; }  // the mouth dips low
    g.lineTo(x, crest(x));
  }
  g.lineTo(W, waterY); g.closePath(); g.fill();
  // pale water showing through the channel mouth
  g.fillStyle=inkLevel(2); g.fillRect(chX-chW*0.5, waterY-H*0.14, chW, H*0.14);
  // darker jagged crest cap so the skyline reads as rock
  g.fillStyle=inkLevel(params.cliffInk+2);
  g.beginPath(); g.moveTo(0,waterY);
  for (let x=0;x<=W;x+=W*0.02){
    if (Math.abs(x-chX) < chW*0.55){ g.lineTo(x, waterY-H*0.02); continue; }
    g.lineTo(x, crest(x));
  }
  for (let x=W;x>=0;x-=W*0.02){
    if (Math.abs(x-chX) < chW*0.55){ g.lineTo(x, waterY-H*0.02); continue; }
    g.lineTo(x, crest(x)+H*0.03);
  }
  g.closePath(); g.fill();
  // hard contour along the skyline
  pen.ink(()=>{
    g.moveTo(0, crest(0));
    for (let x=0;x<=W;x+=W*0.02){
      if (Math.abs(x-chX) < chW*0.55){ g.lineTo(x, waterY-H*0.02); continue; }
      g.lineTo(x, crest(x));
    }
  }, 2.5);
  // vertical striations down the cliff faces (texture)
  g.strokeStyle=inkLevel(params.cliffInk+2); g.lineWidth=1.4;
  for (let x=W*0.03; x<W; x+=W*0.05){
    if (Math.abs(x-chX) < chW*1.1) continue;
    g.beginPath(); g.moveTo(x, crest(x)+H*0.02); g.lineTo(x+(jit(x*2)-0.5)*W*0.01, waterY-4); g.stroke();
  }
  // hard jagged shoreline where rock meets water
  pen.ink(()=>{
    g.moveTo(0,waterY);
    for (let x=0;x<=W;x+=W*0.025){
      if (Math.abs(x-chX) < chW*0.55){ g.lineTo(x, waterY-H*0.02); continue; }
      g.lineTo(x, waterY - (2 + jit(x*0.7)*9));
    }
  }, 2.5);

  /* ============ THE TRAPPED WATER ============ */
  g.fillStyle=inkLevel(params.waterInk); g.fillRect(0, waterY, W, H-waterY);
  pen.ink(()=>{ g.moveTo(0,waterY); g.lineTo(W,waterY); }, 2);
  // churned wave rules — busier at IMPACT, calm by WRECKAGE
  g.strokeStyle=inkLevel(3); g.lineWidth=2; g.lineCap="round";
  for (let k=0;k<5;k++){ const wy=waterY + H*0.03 + k*H*0.055;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.04){ const y=wy+Math.sin(x*0.03+k*1.7+T)*4*P.churn; x===0?g.moveTo(x,y):g.lineTo(x,y); }
    g.stroke();
  }

  /* ============ THE CRUSHING BOULDERS at the water's edge ============ */
  g.fillStyle=inkLevel(params.rockInk);
  const boulder=(cx,cy,r,seed)=>{
    pen.paint(()=>{
      g.moveTo(cx+r, cy);
      for (let a=0;a<=6.3;a+=0.5){ const rr=r*(0.7+jit(seed+a)*0.6); g.lineTo(cx+Math.cos(a)*rr, cy+Math.sin(a)*rr*0.8); }
      g.closePath();
    }, toneSolid(inkLevel(params.rockInk)), 3);
  };
  boulder(W*0.05, waterY+H*0.03, W*0.09, 1.2);
  boulder(W*0.13, waterY+H*0.10, W*0.06, 3.4);
  boulder(W*0.95, waterY+H*0.04, W*0.10, 8.1);
  boulder(W*0.88, waterY+H*0.12, W*0.05, 6.6);

  /* ============ THE ELEVEN WRECKS, packed into the basin ============ */
  const spots=[];
  for (let i=0;i<params.ships;i++){
    const u=i/(params.ships-1);
    const row=i%3;
    const cx=W*(0.13+u*0.74) + (jit(i)-0.5)*W*0.04;
    const depth=0.18 + row*0.30 + jit(i*2)*0.15;          // larger = nearer / lower
    const baseY=waterY + H*0.02 + depth*(H*0.48);
    const w=W*(0.17 + depth*0.18);
    spots.push({i,cx,baseY,w,depth});
  }
  spots.sort((a,b)=>a.depth-b.depth);                     // far/high first, near/low last

  for (const s of spots){
    const dmg = clamp01(P.phase + (jit(s.i*5)-0.5)*0.34);
    const sub = clamp01(P.submerge*(0.5+jit(s.i*7)*1.0));
    const heel= (jit(s.i*3)-0.5)*0.85;                    // wild list angles
    const ink = clamp(Math.round(4 + s.depth*3.2), 4, 7); // solid black-ship hulls
    const usePen = s.depth>0.30 ? pen : soft;             // only the farthest lose their contour

    g.save();
    g.translate(s.cx, s.baseY + sub*s.w*0.24);
    g.rotate(heel);
    drawWreck(usePen, g, s.w, { ink, dmg, seed:s.i*2+1, t:T + s.i });
    g.restore();

    // submersion veil: only for genuinely sinking hulls, and gently
    if (sub>0.28){
      const veilY = waterY + H*0.05 + sub*s.w*0.24 + s.w*0.06;
      g.save();
      g.fillStyle = `rgba(244,244,240,${(sub*0.42).toFixed(3)})`;
      g.fillRect(s.cx - s.w*0.75, veilY, s.w*1.5, H);
      g.restore();
      // ripple rings where it goes under
      g.strokeStyle=inkLevel(3); g.lineWidth=1.6;
      for (let r=1;r<=2;r++){ g.beginPath();
        g.ellipse(s.cx, veilY, s.w*0.30*r, s.w*0.06*r, 0, 0, 7); g.stroke(); }
    }

    // floating plank debris drifting around this wreck (grows with damage)
    const nD = Math.round(1 + dmg*3);
    for (let d=0; d<nD; d++){
      const a=jit(s.i*9+d)*6.28;
      const rad=s.w*(0.5+jit(s.i+d)*0.5);
      const px=s.cx+Math.cos(a)*rad, py=s.baseY+Math.abs(Math.sin(a))*s.w*0.18 - s.w*0.02;
      if (py<waterY) continue;
      drawPlank(usePen, g, px, py, s.w*(0.10+jit(d+s.i)*0.10), (jit(d*3+s.i)-0.5)*1.2, clamp(ink-1,2,6));
    }

    // spray bursts at the moment of IMPACT / SPLINTER
    if (P.churn>0.7 && s.depth>0.3){
      g.strokeStyle=inkLevel(3); g.lineWidth=2; g.lineCap="round";
      const bx=s.cx+s.w*0.30, by=s.baseY-s.w*0.02;
      for (let k=0;k<4;k++){ const aa=-0.6-k*0.3;
        g.beginPath(); g.moveTo(bx,by); g.lineTo(bx+Math.cos(aa)*s.w*0.18, by+Math.sin(aa)*s.w*0.18); g.stroke(); }
      g.fillStyle=inkLevel(2);
      for (let k=0;k<8;k++){ const x=bx+(jit(s.i+k)-0.5)*s.w*0.4, y=by-jit(s.i*2+k)*s.w*0.22;
        g.beginPath(); g.arc(x,y,1.4+jit(k)*1.6,0,7); g.fill(); }
    }
  }
}

export const asset = {
  id:"vehicle.destroyed-fleet",
  type:"VEHICLE",
  name:"Destroyed Fleet",
  statusWord:"WRECKAGE",
  scene:"OD-B10-S02",

  params,
  // back -> front draw order the module honors
  layers:["cliffs","channel-mouth","cliff-shore","water","boulders","wrecks","debris","spray"],

  // normalized 0..1 board / ride / dock anchors (EMPTY wrecks). Ship-scale
  // anchors resolve on the nearest foreground wreck; field markers locate the
  // basin, its crushing rocks and the sole escape channel.
  anchors:{
    "board:foreground-wreck":{x:.640,y:.700},  // step onto the nearest broken hull
    "ride:deck":{x:.640,y:.720},               // what deck remains, empty
    "dock:rocks":{x:.900,y:.560},              // the rocks the ships were dashed on
    "pilot:stern":{x:.560,y:.690},             // the abandoned helm
    "wreck:lead":{x:.640,y:.700},              // nearest / largest wreck
    "wreck:rear":{x:.240,y:.560},              // farthest smashed hull
    "basin:center":{x:.500,y:.640},
    "rocks:left":{x:.080,y:.560},
    "rocks:right":{x:.930,y:.550},
    "channel:mouth":{x:.500,y:.440},           // the only way out (Odysseus' ship alone)
    "waterline":{x:.500,y:.500},
  },
  // collision shape: the jammed wreck field filling the trapped water
  collision:{ kind:"box", x0:.06, y0:.500, x1:.96, y1:.900 },
  // capacity records the LOST complement — eleven crews, empty now
  capacity:{ ships:11, perShip:{ rowers:20, total:24 }, lostTotal:264, survivors:0 },
  ownership:"odysseus",                        // the eleven ships lost at Telepylos

  states:{
    initial:"wreckage",
    nodes:{
      impact:  { preview:{ mode:"impact",   status:"IMPACT",    progress:0.22 } },
      splinter:{ preview:{ mode:"splinter", status:"SPLINTER",  progress:0.48 } },
      sinking: { preview:{ mode:"sinking",  status:"SINKING",   progress:0.72 } },
      crewloss:{ preview:{ mode:"crewloss", status:"CREW LOST", progress:0.86 } },
      wreckage:{ preview:{ mode:"wreckage", status:"WRECKAGE",  progress:1.00 } },
    },
    edges:[
      ["impact","splinter"],["splinter","sinking"],["sinking","crewloss"],
      ["crewloss","wreckage"],["splinter","crewloss"],["sinking","wreckage"],
    ],
  },
  channels:["mode","phase","submerge","t"],

  preview:()=>({ mode:"splinter", status:"SPLINTER", progress:0.48, t:0 }),
  draw(ctx,W,H,state){ drawBasin(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
