/* prop.hurled-mountain-rocks — the mountain-peak fragments Polyphemus tears off
   and hurls at Odysseus's fleeing ship. PROP asset (OD-B09-S11).

   A single reusable GIANT jagged rock fragment — a torn-off mountain peak — that
   cycles through the whole ballistic arc of the scene:
     rip   — wrenched loose from a peak, a jagged tear-scar and falling debris
     lift  — hoisted aloft over the sea, strain marks + grip-contact ticks
     throw — mid-flight in a parabolic arc over the water, motion streaks
     impact— striking the sea: splash plumes, spray, radiating rings
     wave-generation — concentric swells spreading out from the half-sunk rock
     seabed— settled on the sea floor, a sediment cloud and a sink trail above

   A tiny ship on the horizon sells the GIANT scale in the sea states. Drawn in
   SOLID grays + hard black contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.
   Atlas: isolated reusable object; declared giant scale, contact/grip anchors,
   ownership, collision shape, and every scene-required state. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  bodyLvl:4,      // mid granite body of the fragment
  liteLvl:2,      // sunlit facet (upper-left)
  darkLvl:6,      // shadowed facet (lower-right)
  wetLvl:5,       // wetted body once it hits water
  wetDarkLvl:7,   // wetted shadow facet
  skyLvl:1,       // lightest field
  seaLvl:2,       // water surface tone
  deepLvl:3,      // deeper water column
  floorLvl:5,     // seabed floor
  vseed:11,       // silhouette seed (stable jagged shape)
  nVerts:13,      // jags around the fragment
  elong:1.14,     // vertical elongation (peak-shard)
};

/* per-state pose: fragment center (frac W/H), radius (frac W), spin, sea horizon
   (frac H, null = no open sea), whether the body reads wet, + card status. */
const POSE = {
  rip:               { cx:0.44, cy:0.30, r:0.255, rot:-0.16, horizon:null, wet:false, status:"TORN",      progress:0.16 },
  lift:              { cx:0.50, cy:0.32, r:0.300, rot: 0.10, horizon:0.80, wet:false, status:"HOISTED",   progress:0.34 },
  throw:             { cx:0.55, cy:0.25, r:0.185, rot: 0.55, horizon:0.63, wet:false, status:"IN FLIGHT", progress:0.60 },
  impact:            { cx:0.50, cy:0.53, r:0.220, rot: 1.02, horizon:0.55, wet:true,  status:"IMPACT",    progress:0.86 },
  "wave-generation": { cx:0.50, cy:0.50, r:0.180, rot: 1.25, horizon:0.50, wet:true,  status:"WAVES",     progress:0.94 },
  seabed:            { cx:0.50, cy:0.72, r:0.205, rot: 0.32, horizon:0.16, wet:true,  status:"SEABED",    progress:1.00 },
};

/* deterministic pseudo-random from an integer seed (self-contained) */
function seeded(seed){ let s=(seed>>>0)||1; return ()=>{ s^=s<<13; s^=s>>>17; s^=s<<5; return ((s>>>0)%100000)/100000; }; }

/* stable jagged silhouette: n angular vertices with varied radius */
function rockVerts(seed, n){
  const rnd = seeded(seed), v = [];
  for(let i=0;i<n;i++){ v.push({ a:(i/n)*Math.PI*2, rr:0.60 + rnd()*0.46 }); }
  return v;
}

/* the giant faceted fragment about (cx,cy), radius R, spun by rot */
function drawRock(g, pen, cx, cy, R, rot, wet){
  const verts = rockVerts(params.vseed, params.nVerts);
  const hy = params.elong;
  g.save(); g.translate(cx,cy); g.rotate(rot);
  const path = ()=>{ verts.forEach((v,i)=>{
    const x=Math.cos(v.a)*v.rr*R, y=Math.sin(v.a)*v.rr*R*hy;
    if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
  }); g.closePath(); };

  // solid body + hard contour
  pen.paint(path, toneSolid(inkLevel(wet?params.wetLvl:params.bodyLvl)), 6);

  // facets + fractures, clipped to the silhouette
  g.save(); g.beginPath(); path(); g.clip();
  // bright sunlit facet (upper-left)
  g.fillStyle=inkLevel(wet?params.bodyLvl-1:params.liteLvl);
  g.beginPath(); g.moveTo(-R*0.05,-R*0.10);
  g.lineTo(-R*1.15,-R*0.10); g.lineTo(-R*0.35,-R*1.45); g.lineTo(R*0.28,-R*0.55);
  g.closePath(); g.fill();
  // shadowed facet (lower-right)
  g.fillStyle=inkLevel(wet?params.wetDarkLvl:params.darkLvl);
  g.beginPath(); g.moveTo(R*0.02,R*0.02);
  g.lineTo(R*1.2,R*0.30); g.lineTo(R*0.35,R*1.5); g.lineTo(-R*0.22,R*0.6);
  g.closePath(); g.fill();
  // angular fracture lines radiating from a couple of interior nodes
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
  const rr = seeded(params.vseed+7);
  for(let i=0;i<6;i++){
    let x=(rr()-0.5)*R*0.3, y=(rr()-0.5)*R*0.3, ang=rr()*Math.PI*2;
    g.beginPath(); g.moveTo(x,y);
    for(let s=0;s<3;s++){ const step=R*0.42*(0.55+rr()*0.6); ang+=(rr()-0.5)*0.9;
      x+=Math.cos(ang)*step; y+=Math.sin(ang)*step*hy; g.lineTo(x,y); }
    g.stroke();
  }
  // scattered pits / spall
  g.fillStyle=inkLevel(params.darkLvl);
  for(let i=0;i<20;i++){ const a=rr()*Math.PI*2, d=R*0.9*Math.sqrt(rr());
    g.beginPath(); g.arc(Math.cos(a)*d, Math.sin(a)*d*hy, 1.3+rr()*2.3, 0, 7); g.fill(); }
  g.restore();
  g.restore();
}

/* open sea: sky above + water below a horizon at gy (screen px) */
function drawSea(g, pen, W, H, gy){
  g.fillStyle=inkLevel(params.skyLvl); g.fillRect(0,0,W,gy);
  g.fillStyle=inkLevel(params.seaLvl); g.fillRect(0,gy,W,H-gy);
  pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 3);
  // a few horizontal swell rules for the water surface
  g.strokeStyle=inkLevel(params.deepLvl+1); g.lineWidth=2.2; g.lineCap="round"; g.globalAlpha=0.6;
  for(let k=1;k<=5;k++){ const y=gy+(H-gy)*(k/6); const amp=6+k*2;
    g.beginPath();
    for(let x=0;x<=W;x+=26){ const yy=y+Math.sin((x/W)*Math.PI*4+k)*amp*0.4; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
    g.stroke();
  }
  g.globalAlpha=1;
}

/* a tiny far ship on the horizon — sells the giant scale of the rock */
function drawShip(g, x, y, s){
  g.save(); g.strokeStyle=INK; g.fillStyle=inkLevel(6); g.lineWidth=2.4; g.lineCap="round";
  // hull
  g.beginPath(); g.moveTo(x-s, y); g.quadraticCurveTo(x, y+s*0.7, x+s, y); g.closePath(); g.fill(); g.stroke();
  // mast + sail
  g.beginPath(); g.moveTo(x, y); g.lineTo(x, y-s*1.7); g.stroke();
  g.fillStyle=inkLevel(3);
  g.beginPath(); g.moveTo(x, y-s*1.6); g.lineTo(x+s*0.9, y-s*0.3); g.lineTo(x, y-s*0.3); g.closePath(); g.fill(); g.stroke();
  g.restore();
}

function drawScene(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "lift";
  const P = POSE[mode] || POSE.lift;
  const cx = W*P.cx, cy = H*P.cy, R = W*P.r;

  /* ================= RIP — wrenched from a mountain peak ================= */
  if (mode === "rip"){
    g.fillStyle=inkLevel(params.skyLvl); g.fillRect(0,0,W,H);
    // the mountain mass the peak is torn from (jagged, lower portion of frame)
    pen.paint(()=>{
      g.moveTo(0,H);
      g.lineTo(0,H*0.70); g.lineTo(W*0.16,H*0.60); g.lineTo(W*0.30,H*0.66);
      g.lineTo(W*0.40,H*0.52);            // stump where the peak snapped
      g.lineTo(W*0.52,H*0.60); g.lineTo(W*0.60,H*0.55);
      g.lineTo(W*0.74,H*0.63); g.lineTo(W*0.88,H*0.56); g.lineTo(W,H*0.64);
      g.lineTo(W,H); g.closePath();
    }, toneSolid(inkLevel(params.bodyLvl)), 6);
    // shaded strata on the mountain
    g.strokeStyle=inkLevel(params.darkLvl); g.lineWidth=3; g.lineCap="round"; g.globalAlpha=0.7;
    for(const [x0,y0,x1,y1] of [[0.04,0.78,0.30,0.84],[0.55,0.72,0.90,0.80],[0.18,0.90,0.46,0.95]]){
      g.beginPath(); g.moveTo(W*x0,H*y0); g.quadraticCurveTo(W*(x0+x1)/2,H*((y0+y1)/2-0.02),W*x1,H*y1); g.stroke();
    }
    g.globalAlpha=1;
    // jagged TEAR SCAR across the snapped stump (bright raw rock)
    g.strokeStyle=inkLevel(params.liteLvl); g.lineWidth=6; g.lineCap="round";
    g.beginPath();
    let tx=W*0.28, ty=H*0.55; g.moveTo(tx,ty);
    const tr=seeded(3);
    for(let i=0;i<7;i++){ tx+=W*0.045; ty=H*0.52+(tr()-0.5)*H*0.05; g.lineTo(tx,ty); }
    g.stroke();
    // the torn fragment lifting free above the stump, with a gap
    drawRock(g, pen, cx, cy, R, P.rot, false);
    // strain / motion streaks under the fragment (pulling up)
    g.strokeStyle="rgba(0,0,0,0.32)"; g.lineWidth=4; g.lineCap="round";
    for(let i=-2;i<=2;i++){ const x=cx+i*R*0.34;
      g.beginPath(); g.moveTo(x, cy+R*1.05); g.lineTo(x, cy+R*1.5); g.stroke(); }
    // falling debris chips in the gap
    g.fillStyle=inkLevel(params.darkLvl);
    const dr=seeded(9);
    for(let i=0;i<8;i++){ const x=cx-R*0.5+dr()*R, y=cy+R*1.2+dr()*R*0.6;
      g.beginPath(); g.arc(x,y, 3+dr()*5, 0, 7); g.fill(); }
    return;
  }

  /* ================= SEABED — settled on the sea floor ================= */
  if (mode === "seabed"){
    const wl = H*P.horizon;                       // waterline near the top
    const floor = H*0.82;                         // sea floor
    g.fillStyle=inkLevel(params.skyLvl); g.fillRect(0,0,W,wl);
    g.fillStyle=inkLevel(params.seaLvl); g.fillRect(0,wl,W,H-wl);          // water column
    g.fillStyle=inkLevel(params.deepLvl); g.fillRect(0,H*0.5,W,floor-H*0.5);// deeper, darker below
    // wavy waterline
    g.strokeStyle=INK; g.lineWidth=3; g.beginPath();
    for(let x=0;x<=W;x+=22){ const y=wl+Math.sin(x/W*Math.PI*6)*5; x===0?g.moveTo(x,y):g.lineTo(x,y); } g.stroke();
    // seabed floor
    pen.paint(()=>{
      g.moveTo(0,H); g.lineTo(0,floor);
      const fr=seeded(21);
      for(let x=0;x<=W;x+=W*0.1){ g.lineTo(x, floor+(fr()-0.5)*H*0.03); }
      g.lineTo(W,H); g.closePath();
    }, toneSolid(inkLevel(params.floorLvl)), 4);
    // dashed sink-trail from the waterline down to the rock
    g.strokeStyle="rgba(0,0,0,0.30)"; g.lineWidth=3; g.setLineDash([9,10]);
    g.beginPath(); g.moveTo(cx, wl+8); g.lineTo(cx, cy-R*0.9); g.stroke(); g.setLineDash([]);
    // sediment cloud kicked up around the base
    g.fillStyle="rgba(20,20,20,0.20)";
    const sr=seeded(31);
    for(let i=0;i<14;i++){ const a=sr()*Math.PI*2, d=R*(0.6+sr()*0.9);
      g.beginPath(); g.ellipse(cx+Math.cos(a)*d, cy+R*0.7+Math.sin(a)*d*0.4, R*0.18, R*0.12, 0,0,7); g.fill(); }
    // the sunk fragment, embedded in the floor
    drawRock(g, pen, cx, cy, R, P.rot, true);
    // settling debris chips on the floor
    g.fillStyle=inkLevel(params.darkLvl);
    for(let i=0;i<7;i++){ const x=cx-R*1.2+i*R*0.34, y=floor-4-((i*13)%8);
      g.beginPath(); g.ellipse(x,y, 6+((i*7)%5), 4, 0,0,7); g.fill(); }
    return;
  }

  /* ================= LIFT / THROW / IMPACT / WAVE — over open sea ======= */
  const gy = H*P.horizon;
  drawSea(g, pen, W, H, gy);
  // far ship (scale reference) — off to one side, small
  if (mode==="throw" || mode==="impact" || mode==="wave-generation"){
    drawShip(g, W*0.80, gy+ (H-gy)*0.10, Math.max(7, W*0.018));
  }

  if (mode === "throw"){
    // parabolic trajectory from the launch (upper-left) to a sea landing
    const p0={x:W*0.10,y:H*0.44}, p1={x:W*0.92,y:gy+ (H-gy)*0.16}, ctrl={x:W*0.50,y:-H*0.08};
    g.strokeStyle="rgba(0,0,0,0.34)"; g.lineWidth=3.4; g.setLineDash([13,11]);
    g.beginPath(); g.moveTo(p0.x,p0.y); g.quadraticCurveTo(ctrl.x,ctrl.y,p1.x,p1.y); g.stroke(); g.setLineDash([]);
    g.fillStyle=INK; g.beginPath(); g.arc(p0.x,p0.y,5,0,7); g.fill();
    // splash-down target ring on the water
    g.strokeStyle="rgba(0,0,0,0.28)"; g.lineWidth=2.6;
    g.beginPath(); g.ellipse(p1.x,p1.y, R*0.5, R*0.18, 0,0,7); g.stroke();
    // motion streaks trailing the flying rock
    g.strokeStyle="rgba(0,0,0,0.30)"; g.lineWidth=4; g.lineCap="round";
    for(let i=-2;i<=2;i++){ const oy=i*R*0.32;
      g.beginPath(); g.moveTo(cx-R*1.15, cy+oy+R*0.35); g.lineTo(cx-R*2.1, cy+oy+R*0.65); g.stroke(); }
  }

  if (mode === "impact"){
    // impact happens at the waterline directly under the rock
    const ix=cx, iy=gy;
    // radiating splash RINGS on the surface
    g.strokeStyle=inkLevel(params.deepLvl+2); g.lineWidth=3; g.lineCap="round";
    for(let k=1;k<=3;k++){ g.globalAlpha=0.7-0.16*k;
      g.beginPath(); g.ellipse(ix, iy+6, R*(0.9+k*0.55), R*(0.22+k*0.12), 0,0,7); g.stroke(); }
    g.globalAlpha=1;
    // upward water PLUMES (jagged spikes) around the entry
    g.fillStyle=inkLevel(params.skyLvl+1);
    g.strokeStyle=INK; g.lineWidth=2.4; g.lineJoin="round";
    const pr=seeded(41);
    for(let i=-4;i<=4;i++){ if(i===0) continue;
      const bx=ix+i*R*0.30, w=R*0.14, h=R*(0.7+pr()*0.9)*(1-Math.abs(i)*0.11);
      g.beginPath(); g.moveTo(bx-w, iy+4); g.lineTo(bx, iy-h); g.lineTo(bx+w, iy+4); g.closePath();
      g.fill(); g.stroke();
    }
    // scattered spray droplets
    g.fillStyle=inkLevel(params.deepLvl);
    for(let i=0;i<26;i++){ const a=-Math.PI*(0.15+pr()*0.7), d=R*(0.8+pr()*1.7);
      g.beginPath(); g.arc(ix+Math.cos(a)*d, iy+Math.sin(a)*d-R*0.1, 2+pr()*3.5, 0, 7); g.fill(); }
  }

  if (mode === "wave-generation"){
    // big concentric swells radiating out across the whole sea surface
    const ox=cx, oy=gy+8;
    g.lineCap="round";
    for(let k=1;k<=5;k++){
      g.globalAlpha=clamp(0.75-0.11*k,0.12,0.8);
      g.strokeStyle=inkLevel(params.deepLvl+2); g.lineWidth=Math.max(2,5-k*0.6);
      g.beginPath(); g.ellipse(ox, oy, R*(0.7+k*0.95), R*(0.20+k*0.24), 0, 0, 7); g.stroke();
    }
    g.globalAlpha=1;
    // crest foam ticks on the nearest ring
    g.strokeStyle=INK; g.lineWidth=2.2;
    for(let i=0;i<16;i++){ const a=(i/16)*Math.PI*2; const rx=R*1.65, ry=R*0.44;
      const px=ox+Math.cos(a)*rx, py=oy+Math.sin(a)*ry;
      g.beginPath(); g.moveTo(px,py); g.lineTo(px,py-6); g.stroke(); }
  }

  // wetted waterline occluder: crop the rock at the surface for impact/wave
  const submerge = (mode==="impact") ? gy+R*0.15 : (mode==="wave-generation") ? gy-R*0.05 : null;
  if (submerge!=null){
    g.save();
    g.beginPath(); g.rect(0,0,W,submerge); g.clip();   // draw only the ABOVE-water part
    drawRock(g, pen, cx, cy, R, P.rot, P.wet);
    g.restore();
    // waterline foam collar where it pierces the surface
    g.strokeStyle=inkLevel(params.skyLvl+1); g.lineWidth=6; g.lineCap="round"; g.globalAlpha=0.9;
    g.beginPath(); g.ellipse(cx, submerge, R*0.95, R*0.2, 0, 0, Math.PI, false); g.stroke(); g.globalAlpha=1;
  } else {
    drawRock(g, pen, cx, cy, R, P.rot, P.wet);
  }

  // LIFT: strain marks + grip-contact ticks under the hoisted rock
  if (mode === "lift"){
    g.strokeStyle="rgba(0,0,0,0.30)"; g.lineWidth=4; g.lineCap="round";
    for(let i=-2;i<=2;i++){ const x=cx+i*R*0.3;
      g.beginPath(); g.moveTo(x, cy+R*1.18); g.lineTo(x, cy+R*1.55); g.stroke(); }
    // grip contact ticks hugging the underside (where it is gripped/held)
    g.strokeStyle=INK; g.lineWidth=5;
    for(let i=-2;i<=2;i++){ const a=Math.PI*0.5 + i*0.24;
      const px=cx+Math.cos(a)*R*0.9, py=cy+Math.sin(a)*R*1.05;
      g.beginPath(); g.moveTo(px,py); g.lineTo(px, py+R*0.16); g.stroke(); }
  }
}

export const asset = {
  id:"prop.hurled-mountain-rocks",
  type:"PROP",
  name:"Hurled Mountain Rocks",
  statusWord:"HOISTED",
  scene:"OD-B09-S11",

  params,
  // back -> front draw order the module honors
  layers:["sky","sea","waves","trajectory","ship","splash","rock","facets","foam","grip"],

  // normalized 0..1 contact / grip anchors (measured in the neutral LIFT pose,
  // rock centered ~(.50,.32), R~.30; the runtime re-derives them per state).
  anchors:{
    center:{x:.50,y:.32},          // centre of mass / pivot
    apex:{x:.50,y:.02},            // jagged top of the fragment
    "grip:base":{x:.50,y:.62},     // underside the Cyclops grips / releases from
    "grip:left":{x:.36,y:.58},     // left hand-hold on the underside
    "grip:right":{x:.64,y:.58},    // right hand-hold on the underside
    "tear:scar":{x:.44,y:.60},     // raw face where it snapped off the peak
    "contact:sea":{x:.50,y:.55},   // point of entry / splash origin on the water
    "wave:origin":{x:.50,y:.55},   // centre of the radiating swell
    "rest:seabed":{x:.50,y:.72},   // where it settles on the floor
  },
  // collision shape: the fragment footprint in asset space (neutral lift pose)
  collision:{ kind:"blob", cx:.50, cy:.32, r:.30, note:"jagged; roughly circular hull" },
  scale:{ kind:"giant", note:"a torn-off mountain peak; ship-swamping mass, thrown only by a Cyclops" },
  ownership:"polyphemus / cyclops-shore",

  states:{
    initial:"lift",
    nodes:{
      rip:               { preview:{ mode:"rip",              status:"TORN",      progress:0.16 } },
      lift:              { preview:{ mode:"lift",             status:"HOISTED",   progress:0.34 } },
      throw:             { preview:{ mode:"throw",            status:"IN FLIGHT", progress:0.60 } },
      impact:            { preview:{ mode:"impact",           status:"IMPACT",    progress:0.86 } },
      "wave-generation": { preview:{ mode:"wave-generation",  status:"WAVES",     progress:0.94 } },
      seabed:            { preview:{ mode:"seabed",           status:"SEABED",    progress:1.00 } },
    },
    edges:[
      ["rip","lift"],["lift","throw"],["throw","impact"],
      ["impact","wave-generation"],["wave-generation","seabed"],
      ["seabed","rip"],
    ],
  },
  channels:["mode","rot","t"],

  preview:()=>({ mode:"lift", status:"HOISTED", progress:0.34, t:0 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
