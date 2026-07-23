/* ensemble.tityus-tantalus-and-sisyphus — the three great sufferers of Hades.
   ENSEMBLE asset. Scene function (OD-B11-S08): THREE distinct punishment
   tableaux shown together, each a body locked in an endless, looping constraint
   Odysseus witnesses in the underworld —
     · TITYUS   pinned supine across the ground while two vultures tear forever
                at his liver (it grows back as fast as they eat).
     · TANTALUS standing to the chin in a pool under a fruit-laden bough — the
                water drains away when he stoops to drink, the fruit swings up
                out of reach when he lifts a hand.
     · SISYPHUS heaving a boulder up a slope; near the crest it overpowers him
                and rolls back down, and he must begin again.

   Built as ONE separable member template (drawSufferer) DISPATCHED by `kind`
   into three deterministic slots. Each member carries its own constraint-LOOP
   phase (0..1) driven off the global clock t, so all three punishments cycle
   independently in a single frame: vultures peck, the water/fruit recede, the
   boulder climbs-and-slips. Formation controls: `focus` brings one tableau
   forward (larger, centered) or -1 keeps the triptych even; `spacing` widens
   the three stations. Drawn in SOLID grays + hard contour — the engine dotify
   POST pass supplies the halftone. Do NOT bake named heroes in; each sufferer
   is an addressable template member selected by kind. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const TAU = Math.PI*2;
const tri = x => { const f = x - Math.floor(x); return f<0.5 ? f*2 : 2-f*2; };   // 0..1..0
const saw = x => { const f = x - Math.floor(x); return f<0.82 ? f/0.82 : 1-(f-0.82)/0.18; }; // slow climb, fast slip

const params = {
  count:3,               // ENSEMBLE of exactly three sufferers
  focus:-1,              // -1 even triptych .. 0/1/2 bring that tableau forward
  spacing:1.0,           // station spread multiplier
  t:0,                   // global loop clock (drives every constraint loop)
  groundLevel:0.90,      // the floor of the underworld as fraction of H
  showPanels:true,       // faint seams dividing the three stations
};

/* the three stations, as ONE member template selected by kind, staged in depth:
   TANTALUS stands mid-ground left, SISYPHUS mid-ground right, TITYUS reclines
   large across the FOREGROUND (drawn last, on top). cx/baseY are 0..1 of W/H;
   sMul scales the member; each carries a loop-phase offset so the three
   constraints do not beat in unison. */
const ROSTER = [
  { kind:"tantalus", cx:0.265, baseY:0.575, sMul:1.00, phase:0.37 },
  { kind:"sisyphus", cx:0.745, baseY:0.600, sMul:1.00, phase:0.68 },
  { kind:"tityus",   cx:0.500, baseY:0.965, sMul:1.52, phase:0.00 },
];

/* ---- shared tiny helpers ------------------------------------------------- */
function drawHead(pen,g,x,y,r,skin,hair,cw,{beard=true, down=0}={}){
  // skull
  pen.paint(()=>{ g.ellipse(x,y,r*0.9,r,0,0,7); }, skin, cw);
  // hair cap
  pen.paint(()=>{
    g.moveTo(x-r*0.92, y+down*r*0.2);
    g.quadraticCurveTo(x, y-r*1.5, x+r*0.92, y+down*r*0.2);
    g.quadraticCurveTo(x+r*0.55, y-r*0.5, x, y-r*0.42);
    g.quadraticCurveTo(x-r*0.55, y-r*0.5, x-r*0.92, y+down*r*0.2);
  }, hair, cw*0.7);
  if (beard){
    pen.paint(()=>{
      g.moveTo(x-r*0.55, y+r*0.2);
      g.quadraticCurveTo(x, y+r*1.35, x+r*0.55, y+r*0.2);
      g.quadraticCurveTo(x, y+r*0.55, x-r*0.55, y+r*0.2);
    }, hair, cw*0.6);
  }
  // strained eyes + open, gasping mouth (all three suffer)
  const eyeY = y - r*0.10 + down*r*0.2;
  g.fillStyle=INK;
  g.beginPath(); g.ellipse(x-r*0.34, eyeY, r*0.12, r*0.10, 0,0,7); g.fill();
  g.beginPath(); g.ellipse(x+r*0.34, eyeY, r*0.12, r*0.10, 0,0,7); g.fill();
  g.strokeStyle=INK; g.lineWidth=Math.max(2, r*0.11); g.lineCap="round";
  g.beginPath(); g.moveTo(x-r*0.5, eyeY-r*0.40); g.lineTo(x-r*0.14, eyeY-r*0.24); g.stroke();
  g.beginPath(); g.moveTo(x+r*0.14, eyeY-r*0.24); g.lineTo(x+r*0.5, eyeY-r*0.40); g.stroke();
  g.fillStyle=INK; g.beginPath(); g.ellipse(x, y+r*0.5, r*0.18, r*0.15, 0,0,7); g.fill();
}

function drawManacle(pen,g,x,y,r,cw){
  pen.paint(()=>{ g.arc(x,y,r,0,7); }, toneSolid(inkLevel(6)), cw);
  g.fillStyle=inkLevel(1); g.beginPath(); g.arc(x,y,r*0.45,0,7); g.fill();
}
function drawChain(pen,g,x0,y0,x1,y1,links,r){
  for(let i=0;i<links;i++){
    const t=(i+0.5)/links, cx=lerp(x0,x1,t), cy=lerp(y0,y1,t);
    pen.paint(()=>{ g.ellipse(cx,cy,r,r*0.6, Math.atan2(y1-y0,x1-x0),0,7); }, toneSolid(inkLevel(6)), Math.max(2,r*0.35));
    g.fillStyle=inkLevel(1); g.beginPath(); g.ellipse(cx,cy,r*0.5,r*0.28, Math.atan2(y1-y0,x1-x0),0,7); g.fill();
  }
}

/* ============================================================
   TITYUS — pinned SUPINE (laid out horizontally), arms wrenched up to stakes,
   legs splayed, two vultures standing on the belly tearing the liver on the
   loop. Body long axis runs left(head)->right(feet) so it reads as lying down.
   ============================================================ */
function drawTityus(pen,g,cx,groundY,s0,phase){
  const s = s0*0.72;                         // keep the recumbent giant in his lane
  const skin=toneSolid(inkLevel(2)), hair=toneSolid(inkLevel(5));
  const slab=toneSolid(inkLevel(3)), dark=toneSolid(inkLevel(6));
  const cw=Math.max(3,s*0.024);
  const peck = tri(phase*2);                 // 0 heads up .. 1 heads down at the wound

  const midY = groundY - s*0.58;             // the body lies here, on a low slab
  const headC={ x:cx - s*0.86, y:midY };
  const sho  ={ x:cx - s*0.46, y:midY };
  const hip  ={ x:cx + s*0.16, y:midY };
  const headR=s*0.17;

  // ---- low stone slab under the whole body (light bed) ----
  pen.paint(()=>{ g.ellipse(cx-s*0.05, midY+s*0.10, s*1.12, s*0.62, 0,0,7); }, slab, cw);
  g.strokeStyle=INK; g.globalAlpha=0.3; g.lineWidth=Math.max(2,s*0.012);
  g.beginPath(); g.moveTo(cx-s*0.8, midY+s*0.3); g.lineTo(cx+s*0.5, midY+s*0.38); g.stroke();
  g.globalAlpha=1;

  // ---- legs splayed (V toward feet) ----
  const legW=s*0.15;
  for(const side of [-1,1]){
    const kx=hip.x+s*0.40, ky=hip.y+side*s*0.20;
    const fx=hip.x+s*0.74, fy=hip.y+side*s*0.34;
    pen.limb(()=>{ g.moveTo(hip.x,hip.y+side*s*0.06); g.lineTo(kx,ky); }, skin, legW);
    pen.limb(()=>{ g.moveTo(kx,ky); g.lineTo(fx,fy); }, skin, legW*0.82);
    pen.paint(()=>{ g.ellipse(fx+s*0.03,fy,s*0.08,s*0.05,side*0.3,0,7); }, dark, cw*0.6);
  }

  // ---- torso: a big belly mass from shoulders to hips ----
  pen.paint(()=>{ g.ellipse((sho.x+hip.x)/2, midY, (hip.x-sho.x)/2+s*0.14, s*0.30, 0,0,7); }, skin, cw);
  // chest / rib seams (across the body)
  g.strokeStyle=INK; g.globalAlpha=0.5; g.lineWidth=Math.max(2,s*0.012);
  for(let k=0;k<3;k++){ const x=lerp(sho.x,hip.x,0.25+k*0.22);
    g.beginPath(); g.moveTo(x, midY-s*0.20); g.quadraticCurveTo(x+s*0.03, midY, x, midY+s*0.20); g.stroke(); }
  g.globalAlpha=1;

  // ---- arms wrenched UP to two stakes (spread-eagled) ----
  const armW=s*0.11;
  for(const side of [-1,1]){
    const ex=sho.x+side*s*0.10, ey=midY - s*0.34;
    const wx=sho.x+side*s*0.30, wy=midY - s*0.60;
    pen.limb(()=>{ g.moveTo(sho.x,midY-s*0.04); g.lineTo(ex,ey); }, skin, armW);
    pen.limb(()=>{ g.moveTo(ex,ey); g.lineTo(wx,wy); }, skin, armW*0.82);
    drawChain(pen,g, wx,wy, wx+side*s*0.02, wy-s*0.14, 2, s*0.04);
    drawManacle(pen,g,wx,wy,s*0.055,cw*0.6);
  }

  // ---- HEAD (thrown back on the slab) ----
  pen.limb(()=>{ g.moveTo(sho.x,midY); g.lineTo(headC.x+headR*0.6,headC.y); }, skin, s*0.10);
  drawHead(pen,g,headC.x,headC.y,headR,skin,hair,cw,{beard:true, down:-0.4});

  // ---- the LIVER WOUND torn open on the belly ----
  const liverX=lerp(sho.x,hip.x,0.55), liverY=midY+s*0.02;
  pen.paint(()=>{ g.ellipse(liverX,liverY,s*0.13,s*0.10,0,0,7); }, dark, cw*0.7);
  g.strokeStyle=inkLevel(1); g.lineWidth=Math.max(2,s*0.022);
  for(let k=-1;k<=1;k++){ g.beginPath(); g.moveTo(liverX+k*s*0.05,liverY-s*0.06); g.lineTo(liverX+k*s*0.05,liverY+s*0.06); g.stroke(); }

  // ---- two VULTURES standing on the belly, tearing the liver (loop) ----
  for(const side of [-1,1]){
    const vx=liverX+side*s*0.26, vBodyY=midY - s*0.34;
    const beakY=lerp(vBodyY+s*0.06, liverY-s*0.05, peck);
    // body (folded dark teardrop, tail out and back)
    pen.paint(()=>{ g.ellipse(vx,vBodyY,s*0.10,s*0.15, side*0.2,0,7); }, toneSolid(inkLevel(5)), cw*0.7);
    pen.seam(()=>{ g.moveTo(vx,vBodyY-s*0.08); g.quadraticCurveTo(vx+side*s*0.08,vBodyY,vx,vBodyY+s*0.10); }, cw*0.5);
    pen.paint(()=>{ g.moveTo(vx-side*s*0.05,vBodyY+s*0.06); g.lineTo(vx-side*s*0.20,vBodyY-s*0.02); g.lineTo(vx-side*s*0.05,vBodyY+s*0.13); g.closePath(); }, toneSolid(inkLevel(6)), cw*0.5);
    // long bent neck diving to the wound
    pen.limb(()=>{ g.moveTo(vx+side*s*0.04,vBodyY-s*0.02);
      g.quadraticCurveTo(vx+side*s*0.16,vBodyY+s*0.06, vx+side*s*0.02, beakY); }, toneSolid(inkLevel(4)), s*0.04);
    pen.paint(()=>{ g.arc(vx+side*s*0.02,beakY,s*0.035,0,7); }, toneSolid(inkLevel(5)), cw*0.5);
    g.fillStyle=INK; g.beginPath();
    g.moveTo(vx+side*s*0.02, beakY);
    g.lineTo(vx+side*s*0.10, beakY+s*0.02);
    g.lineTo(vx+side*s*0.02, beakY+s*0.04); g.closePath(); g.fill();
    // gripping feet
    pen.seam(()=>{ g.moveTo(vx,vBodyY+s*0.13); g.lineTo(vx-side*s*0.03,vBodyY+s*0.18); g.moveTo(vx,vBodyY+s*0.13); g.lineTo(vx+side*s*0.03,vBodyY+s*0.18); }, cw*0.5);
  }
  return { head:{x:headC.x,y:headC.y} };
}

/* ============================================================
   TANTALUS — to the chin in a pool under a fruited bough. Water and fruit both
   recede on the loop (they escape whenever he tries).
   ============================================================ */
function drawTantalus(pen,g,cx,groundY,s,phase){
  const skin=toneSolid(inkLevel(2)), hair=toneSolid(inkLevel(5));
  const water=toneSolid(inkLevel(2)), wood=toneSolid(inkLevel(5));
  const cw=Math.max(3,s*0.022);
  const rec = tri(phase*2);                   // 0 near .. 1 fled out of reach

  const headR=s*0.15;
  const headCy=groundY - s*1.28;
  const shoY=headCy+headR+s*0.12;
  const hipY=shoY+s*0.50;
  const poolTop = lerp(shoY+s*0.14, hipY+s*0.10, rec);  // water sinks away as he stoops
  const poolBot = groundY;

  // ---- the fruited BOUGH overhead (draw first, behind the arms) ----
  const boughY = lerp(headCy - s*0.52, headCy - s*0.86, rec);  // fruit swings up out of reach
  pen.limb(()=>{ g.moveTo(cx-s*0.62, boughY-s*0.02); g.quadraticCurveTo(cx, boughY-s*0.14, cx+s*0.62, boughY+s*0.02); }, wood, s*0.045);
  const fruitX=[-0.42,-0.14,0.16,0.44];
  for(const fx of fruitX){
    const bx=cx+fx*s, by=boughY+s*0.12 + Math.abs(fx)*s*0.02;
    pen.limb(()=>{ g.moveTo(bx,boughY-s*0.01); g.lineTo(bx,by-s*0.05); }, wood, Math.max(2,s*0.015)); // stem
    pen.paint(()=>{ g.arc(bx,by,s*0.058,0,7); }, toneSolid(inkLevel(3)), cw*0.6);                     // fruit
    pen.seam(()=>{ g.moveTo(bx-s*0.02,by-s*0.05); g.quadraticCurveTo(bx,by,bx-s*0.02,by+s*0.04); }, cw*0.4);
  }

  // ---- reaching arms up toward the fruit (kept apart, hands open below it) ----
  for(const side of [-1,1]){
    const sx=cx+side*s*0.22, ex=cx+side*s*0.30, ey=lerp(shoY,boughY,0.55);
    const wx=cx+side*s*0.22, wy=boughY+s*0.20;
    pen.limb(()=>{ g.moveTo(sx,shoY+s*0.02); g.lineTo(ex,ey); }, skin, s*0.09);
    pen.limb(()=>{ g.moveTo(ex,ey); g.lineTo(wx,wy); }, skin, s*0.078);
    // grasping hand
    pen.paint(()=>{ g.arc(wx,wy,s*0.04,0,7); }, skin, cw*0.6);
    g.strokeStyle=INK; g.lineWidth=Math.max(2,s*0.013); g.lineCap="round";
    for(let f=-1;f<=1;f++){ g.beginPath(); g.moveTo(wx+f*s*0.018,wy-s*0.01); g.lineTo(wx+f*s*0.028,wy-s*0.07); g.stroke(); }
  }

  // ---- torso + head (upper body above the water) ----
  pen.paint(()=>{
    g.moveTo(cx-s*0.20, shoY); g.lineTo(cx+s*0.20, shoY);
    g.lineTo(cx+s*0.17, hipY); g.lineTo(cx-s*0.17, hipY); g.closePath();
  }, skin, cw);
  g.strokeStyle=INK; g.globalAlpha=0.45; g.lineWidth=Math.max(2,s*0.011);
  g.beginPath(); g.moveTo(cx, shoY+s*0.08); g.lineTo(cx, poolTop-s*0.02); g.stroke(); g.globalAlpha=1;
  pen.limb(()=>{ g.moveTo(cx,shoY); g.lineTo(cx,headCy+headR*0.7); }, skin, s*0.09);
  drawHead(pen,g,cx,headCy,headR,skin,hair,cw,{beard:true});

  // ---- the POOL he stands in (rounded basin, LIGHT — drawn over the legs) ----
  const pw=s*0.56, pflat=poolBot - Math.min((poolBot-poolTop)*0.6, s*0.16);
  pen.paint(()=>{
    g.moveTo(cx-pw, poolTop);
    g.lineTo(cx+pw, poolTop);
    g.lineTo(cx+pw, pflat);
    g.quadraticCurveTo(cx+pw, poolBot, cx, poolBot);
    g.quadraticCurveTo(cx-pw, poolBot, cx-pw, pflat);
    g.closePath();
  }, water, cw*0.7);
  // wavy surface line
  g.strokeStyle=INK; g.lineWidth=Math.max(2,s*0.016); g.lineCap="round";
  g.beginPath(); g.moveTo(cx-pw,poolTop);
  for(let k=0;k<=6;k++){ const x=cx-pw+k*(2*pw/6); g.lineTo(x, poolTop+(k%2?-1:1)*s*0.02); } g.stroke();
  // faint ripple lines
  g.globalAlpha=0.4;
  for(let r=1;r<=2;r++){ const ry=poolTop+r*s*0.11;
    g.beginPath(); g.moveTo(cx-pw*0.62, ry); g.quadraticCurveTo(cx, ry+s*0.03, cx+pw*0.62, ry); g.stroke(); }
  g.globalAlpha=1;
  return { head:{x:cx,y:headCy} };
}

/* ============================================================
   SISYPHUS — heaving the boulder up a slope; on the loop it climbs then slips.
   ============================================================ */
function drawSisyphus(pen,g,cx,groundY,s,phase){
  const skin=toneSolid(inkLevel(2)), hair=toneSolid(inkLevel(5));
  const boulderT=toneSolid(inkLevel(3)), slopeT=toneSolid(inkLevel(2)), dark=toneSolid(inkLevel(6));
  const cw=Math.max(3,s*0.022);
  const climb = saw(phase);                    // slow up .. quick slip back

  // ---- the SLOPE rising left->right (LIGHT wedge) ----
  const x0=cx-s*0.92, y0=groundY, x1=cx+s*0.92, y1=groundY - s*1.05;
  pen.paint(()=>{ g.moveTo(x0,y0); g.lineTo(x1,y1); g.lineTo(x1, groundY); g.closePath(); }, slopeT, cw);
  pen.ink(()=>{ g.moveTo(x0,y0); g.lineTo(x1,y1); }, Math.max(3,s*0.02));
  // slope striations
  g.strokeStyle=INK; g.globalAlpha=0.3; g.lineWidth=Math.max(2,s*0.01);
  for(let k=1;k<=4;k++){ const t=k/5; const sx=lerp(x0,x1,t), sy=lerp(y0,y1,t);
    g.beginPath(); g.moveTo(sx,sy); g.lineTo(sx-s*0.04,sy+s*0.10); g.stroke(); }
  g.globalAlpha=1;

  // ---- BOULDER position along the slope (loops up then slips) ----
  const u=lerp(0.34,0.74,climb);
  const bx=lerp(x0,x1,u), bslopeY=lerp(y0,y1,u), bR=s*0.34;
  const by=bslopeY - bR*0.82;

  // bent man at the boulder's lower-LEFT face, driving it up; head kept clear
  // of the rock (to its left) so it reads. contact = where his hands press.
  const conX=bx - bR*0.72, conY=by + bR*0.34;
  const shoX=conX - s*0.14, shoY=conY + s*0.02;
  const hipX=shoX - s*0.26, hipY=shoY + s*0.40;
  const headR=s*0.15, headX=shoX - s*0.10, headY=shoY - s*0.12;

  // planted legs driving up the slope
  const f1x=hipX - s*0.24, f1y=lerp(y0,y1,u-0.44);
  const f2x=hipX + s*0.04, f2y=lerp(y0,y1,u-0.30);
  pen.limb(()=>{ g.moveTo(hipX,hipY); g.lineTo(f1x,f1y); }, skin, s*0.12);
  pen.limb(()=>{ g.moveTo(hipX,hipY); g.lineTo(f2x,f2y); }, skin, s*0.11);
  pen.paint(()=>{ g.ellipse(f1x-s*0.02,f1y+s*0.03,s*0.085,s*0.045,-0.5,0,7); }, dark, cw*0.6);
  pen.paint(()=>{ g.ellipse(f2x+s*0.02,f2y+s*0.02,s*0.085,s*0.045,-0.5,0,7); }, dark, cw*0.6);

  // torso pitched into the rock
  pen.paint(()=>{
    g.moveTo(hipX-s*0.13, hipY); g.lineTo(hipX+s*0.13, hipY);
    g.lineTo(shoX+s*0.14, shoY); g.lineTo(shoX-s*0.12, shoY); g.closePath();
  }, skin, cw);
  g.strokeStyle=INK; g.globalAlpha=0.45; g.lineWidth=Math.max(2,s*0.011);
  g.beginPath(); g.moveTo(hipX,hipY-s*0.03); g.lineTo(shoX,shoY+s*0.03); g.stroke(); g.globalAlpha=1;

  // neck + head straining up at the rock (clear to the left of the boulder)
  pen.limb(()=>{ g.moveTo(shoX,shoY); g.lineTo(headX,headY+headR*0.7); }, skin, s*0.09);
  drawHead(pen,g,headX,headY,headR,skin,hair,cw,{beard:true, down:0.4});

  // both arms reaching up to press the boulder face
  for(const k of [0,1]){
    const px=conX + k*s*0.03, py=conY - s*0.10 + k*s*0.18;
    const mx=lerp(shoX,px,0.5)+s*0.03, my=lerp(shoY,py,0.5)-s*0.02;
    pen.limb(()=>{ g.moveTo(shoX+s*0.04,shoY-s*0.02); g.lineTo(mx,my); }, skin, s*0.082);
    pen.limb(()=>{ g.moveTo(mx,my); g.lineTo(px,py); }, skin, s*0.068);
    pen.paint(()=>{ g.ellipse(px,py,s*0.045,s*0.036,0,0,7); }, skin, cw*0.5);
  }

  // ---- the BOULDER (over the arms' contact so hands press its face) ----
  pen.paint(()=>{ g.arc(bx,by,bR,0,7); }, boulderT, cw);
  // rock facets
  g.strokeStyle=INK; g.globalAlpha=0.45; g.lineWidth=Math.max(2,s*0.013);
  for(let k=0;k<5;k++){ const a=k/5*TAU + 0.4;
    g.beginPath(); g.moveTo(bx+Math.cos(a)*bR*0.3, by+Math.sin(a)*bR*0.3);
    g.lineTo(bx+Math.cos(a)*bR*0.82, by+Math.sin(a)*bR*0.82); g.stroke(); }
  g.beginPath(); g.arc(bx,by,bR*0.55, 0.5, 2.2); g.stroke();
  g.globalAlpha=1;

  // ---- strain / slip accents ----
  g.strokeStyle=INK; g.lineWidth=Math.max(2,s*0.012); g.globalAlpha=0.6; g.lineCap="round";
  for(let k=0;k<3;k++){ const a=-1.2 - k*0.3; g.beginPath();
    g.moveTo(shoX-s*0.16, shoY-s*0.05-k*s*0.04);
    g.lineTo(shoX-s*0.16+Math.cos(a)*s*0.10, shoY-s*0.05-k*s*0.04+Math.sin(a)*s*0.10); g.stroke(); }
  g.globalAlpha=1;
  // downhill slip arrow near the crest (the endless defeat) when high on the slope
  if (climb>0.7){
    g.fillStyle=ACCENT; g.globalAlpha=clamp01((climb-0.7)/0.25);
    const ax=bx+bR*0.4, ay=by-bR*0.7;
    g.beginPath(); g.moveTo(ax,ay); g.lineTo(ax+s*0.14,ay-s*0.05); g.lineTo(ax+s*0.05,ay-s*0.14); g.closePath(); g.fill();
    g.globalAlpha=1;
  }
  return { head:{x:headX,y:headY} };
}

/* dispatch the member template by kind */
function drawSufferer(pen,g,m){
  if (m.kind==="tityus")   return drawTityus(pen,g,m.cx,m.groundY,m.s,m.phase);
  if (m.kind==="tantalus") return drawTantalus(pen,g,m.cx,m.groundY,m.s,m.phase);
  return drawSisyphus(pen,g,m.cx,m.groundY,m.s,m.phase);
}

/* ============================================================
   build the three stations deterministically. focus brings one forward
   (larger, pulled toward centre); each member's loop phase = its roster
   offset + the global clock t so the three constraints cycle out of step.
   ============================================================ */
function buildMembers(W,H,st){
  const p={ ...params, ...st };
  const spacing=p.spacing ?? 1.0;
  const focus = p.focus ?? -1;
  const t = p.t ?? 0;

  return ROSTER.map((r,i)=>{
    const baseX = 0.5 + (r.cx-0.5)*spacing;
    const isFocus = focus===i;
    const dim = (focus>=0 && !isFocus);
    const s = H*0.235 * r.sMul * (isFocus?1.18 : dim?0.86 : 1.0);
    const cx = (focus>=0)
      ? clamp(baseX + (isFocus? (0.5-baseX)*0.35 : (baseX-0.5)*0.20), 0.10, 0.90)*W
      : clamp(baseX,0.08,0.92)*W;
    const groundY = r.baseY*H;
    const phase = (st && st.phases && typeof st.phases[i]==="number")
      ? st.phases[i]
      : (r.phase + t*0.15) % 1;
    return { kind:r.kind, cx, groundY, s, phase, idx:i, dim, order:(r.kind==="tityus"?2:0) };
  });
}

function drawEnsemble(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const groundY=(st.groundLevel ?? params.groundLevel)*H;

  // ---- underworld field: pale murk above, darker floor below ----
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,H);
  g.fillStyle=inkLevel(2); g.fillRect(0,groundY,W,H-groundY);
  pen.ink(()=>{ g.moveTo(0,groundY); g.lineTo(W,groundY); }, Math.max(2,W*0.004));

  const members=buildMembers(W,H,st);
  // mid-ground sufferers first, the foreground recliner (Tityus) on top
  members.sort((a,b)=> a.order-b.order);
  members.forEach(m=> drawSufferer(pen,g,m));
}

export const asset = {
  id:"ensemble.tityus-tantalus-and-sisyphus",
  type:"ENSEMBLE",
  name:"Tityus, Tantalus, and Sisyphus",
  statusWord:"DAMNED",
  scene:"OD-B11-S08",

  params,
  // ONE member template dispatched by kind into three deterministic slots
  member:{ template:"sufferer", count:3, kinds:["tityus","tantalus","sisyphus"] },
  // back -> front draw order the triptych honors
  layers:["murk","floor","seams","tityus","tantalus","sisyphus"],
  // normalized 0..1 station / camera / attachment anchors (NOT baked heroes)
  anchors:{
    "station:tityus":{x:0.18,y:0.66}, "station:tantalus":{x:0.50,y:0.60}, "station:sisyphus":{x:0.82,y:0.62},
    "wound:liver":{x:0.18,y:0.55}, "pool:tantalus":{x:0.50,y:0.78}, "boulder:sisyphus":{x:0.86,y:0.50},
    "camera:wide":{x:0.50,y:0.50}, "camera:tityus":{x:0.18,y:0.55},
    "camera:tantalus":{x:0.50,y:0.55}, "camera:sisyphus":{x:0.82,y:0.50},
  },
  // the underworld floor the three stations stand on
  zones:{ floor:{ x0:0.03,y0:0.86,x1:0.97,y1:0.98 },
          tityus:{ x0:0.02,y0:0.40,x1:0.35,y1:0.92 },
          tantalus:{ x0:0.34,y0:0.34,x1:0.66,y1:0.92 },
          sisyphus:{ x0:0.65,y0:0.30,x1:0.98,y1:0.92 } },
  states:{
    initial:"triptych",
    nodes:{
      // all three constraints turning together, even triptych
      triptych:{ preview:{ focus:-1, spacing:1.0, t:0.2, status:"DAMNED" } },
      // pull TITYUS forward: the vultures at the liver
      tityus:{   preview:{ focus:0, spacing:1.0, t:0.5, status:"DEVOURED" } },
      // pull TANTALUS forward: the water and fruit fleeing
      tantalus:{ preview:{ focus:1, spacing:1.0, t:0.5, status:"PARCHED" } },
      // pull SISYPHUS forward: the boulder near the crest
      sisyphus:{ preview:{ focus:2, spacing:1.0, t:0.7, status:"STRAINING" } },
    },
    edges:[["triptych","tityus"],["triptych","tantalus"],["triptych","sisyphus"],
           ["tityus","triptych"],["tantalus","triptych"],["sisyphus","triptych"]],
  },
  channels:["t","focus","spacing","phases"],

  // neutral preview = the whole triptych mid-loop, each punishment turning
  preview:()=>({ focus:-1, spacing:1.0, t:0.2, showPanels:true, status:"DAMNED", progress:0.5 }),

  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
