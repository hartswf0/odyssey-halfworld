/* sound_source.underworld-chorus — the massed dead of the underworld, a low
   layered murmur of kinship names that RECEDES the moment one shade steps up
   to speak. SOUND_SOURCE asset: an ADDRESSABLE DIEGETIC EMITTER rendered as a
   legible emitter DIAGRAM, not an illustration. A scattered CONSTELLATION of
   faint whisper-emitters (each a small position marker ringed by soft outward
   whisper-rings), a movable FOCUS on the one shade currently taking the floor
   (dark marker + crosshair + blue mark), and a FOCUS-DAMPENING ZONE — a dashed
   quiet pocket around that shade inside which every other voice falls off. A
   bottom RHYTHM strip carries the naming cadence (accented ticks = kinship
   names spoken aloud). Drawn in SOLID grays + hard contour into the offscreen
   ctx; the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B11-S05): layered whispers and kinship names that recede
   whenever one shade takes focus. Driven by { intensity, focus, focusIndex,
   stopped, beats } so the runtime can raise/lower the murmur, pick which shade
   dominates, deepen the hush around it, or fall silent.
   States: chorus / focusing / named / silent.
   Atlas: addressable emitter — position, intensity, rhythm, start/stop. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;

/* the massed shades: a scattered constellation of whisper-emitters in asset
   space. depth (0 far/small .. 1 near/large) sets marker + ring scale so the
   crowd reads as receding into the dark. Deterministic — no randomness. */
const EMITTERS = [
  { x:0.20, y:0.28, depth:0.40 },
  { x:0.39, y:0.19, depth:0.72 },
  { x:0.61, y:0.23, depth:0.60 },
  { x:0.81, y:0.31, depth:0.36 },
  { x:0.26, y:0.50, depth:0.86 },
  { x:0.74, y:0.52, depth:0.80 },
  { x:0.15, y:0.68, depth:0.50 },
  { x:0.50, y:0.63, depth:1.00 },   // the near, central shade — default focus
  { x:0.85, y:0.69, depth:0.56 },
  { x:0.38, y:0.78, depth:0.46 },
  { x:0.66, y:0.80, depth:0.42 },
];

const params = {
  emitters:EMITTERS,
  focusIndex:7,                 // which shade holds the floor
  intensity:0.68,               // baseline murmur loudness 0..1
  focus:0.85,                   // how hard the crowd recedes for the speaker
  ringUnit:0.052,               // whisper-ring radius unit as frac of min(W,H)
  damp:0.86,                    // falloff applied to non-focus voices under focus
  beatCount:24,                 // rhythm ticks (the naming cadence)
  // 1=soft murmur .. 3=a kinship name spoken clear
  beatPattern:[1,1,2,1, 3,1,1,2, 1,3,1,1, 2,1,1,3, 1,1,2,1, 3,1,1,2],
};

function drawDiagram(ctx,W,H,st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const E = params.emitters, N = E.length;
  const unit = Math.min(W,H)*params.ringUnit;
  const stopped = !!st.stopped;
  const intensity = clamp(st.intensity ?? params.intensity, 0, 1);
  const focus = stopped ? 0 : clamp(st.focus ?? params.focus, 0, 1);
  const fIdx = clamp(Math.round(st.focusIndex ?? params.focusIndex), 0, N-1);
  const F = E[fIdx];
  const fx = W*F.x, fy = H*F.y;

  // ---- FIELD: the pale of the dead, a faint bounding disc the murmur fills ----
  pen.paint(()=>{ g.ellipse(W*0.5, H*0.47, W*0.44, H*0.40, 0, 0, TAU); }, toneSolid(inkLevel(1)), 0);

  // ---- per-emitter rendered intensity ----
  const em = E.map((e,i)=>{
    let fi;
    if (stopped) fi = 0;
    else if (i===fIdx) fi = lerp(intensity, 1.0, focus);          // the speaker rises
    else {
      // voices recede with focus; those inside the dampening pocket fall off harder
      const dx = (W*e.x - fx), dy = (H*e.y - fy);
      const dist = Math.hypot(dx,dy);
      const inPocket = clamp(1 - dist/(unit*6.2), 0, 1);          // 1 near speaker .. 0 far
      const recede = focus*(params.damp)*(0.55 + 0.45*inPocket);
      fi = intensity*(1 - recede);
    }
    return { ...e, i, sx:W*e.x, sy:H*e.y, fi, scale:0.55+e.depth*0.85 };
  });

  // ---- FOCUS-DAMPENING ZONE: dashed quiet pocket around the speaking shade ----
  if (!stopped && focus>0.05){
    const zr = unit*(3.2 + focus*2.2);
    // a slightly quieter fill so the pocket reads as a hush
    pen.paint(()=>{ g.ellipse(fx,fy,zr,zr*0.9,0,0,TAU); }, toneSolid(inkLevel(1)), 0);
    g.save();
    g.strokeStyle=INK; g.lineWidth=2.5; g.globalAlpha=0.35+0.4*focus;
    g.setLineDash([9,8]);
    g.beginPath(); g.ellipse(fx,fy,zr,zr*0.9,0,0,TAU); g.stroke();
    // inward-pointing recede ticks on the zone boundary
    g.setLineDash([]); g.lineWidth=2; g.globalAlpha=0.5*focus;
    for(let k=0;k<10;k++){
      const a=k/10*TAU;
      const ox=fx+Math.cos(a)*zr, oy=fy+Math.sin(a)*zr*0.9;
      g.beginPath(); g.moveTo(ox,oy); g.lineTo(ox-Math.cos(a)*unit*0.5, oy-Math.sin(a)*unit*0.5*0.9); g.stroke();
    }
    g.restore();
  }

  // ---- WHISPER-EMITTERS: dim voices first, so the speaker sits on top ----
  const order=[...em].sort((p,q)=>p.fi-q.fi);
  for(const s of order){
    if (s.i===fIdx) continue;                                    // speaker drawn last
    const ringU = unit*s.scale;
    // soft concentric whisper-rings radiating all around (faint by nature)
    const rings = stopped ? 0 : Math.round(s.fi*3);
    for(let k=0;k<rings;k++){
      const r = ringU*(0.55 + k*0.5);
      g.save();
      g.strokeStyle=INK; g.lineWidth=clamp(3.2-k*0.9, 1.4, 3.2);
      g.globalAlpha = clamp((0.14 + 0.42*s.fi) * (1-k*0.22), 0.05, 0.75);
      g.beginPath(); g.ellipse(s.sx,s.sy,r,r*0.92,0,0,TAU); g.stroke();
      g.restore();
    }
    // seat disc + level dot (a shade's position marker)
    const seat = ringU*0.40;
    pen.paint(()=>{ g.arc(s.sx,s.sy,seat,0,TAU); }, toneSolid(inkLevel(1)), 2.5);
    const lvl = stopped ? 2 : Math.round(2 + s.fi*4);
    pen.paint(()=>{ g.arc(s.sx,s.sy,seat*0.56,0,TAU); }, toneSolid(inkLevel(lvl)), 2.5);
  }

  // ---- THE SPEAKING SHADE: strong rings + crosshair + blue mark ----
  {
    const s = em[fIdx];
    const ringU = unit*s.scale;
    const rings = stopped ? 0 : (2 + Math.round(s.fi*2));
    for(let k=0;k<rings;k++){
      const r = ringU*(0.6 + k*0.55);
      g.save();
      g.strokeStyle=INK; g.lineWidth=clamp(5-k*1.1, 2, 5);
      g.globalAlpha = clamp(0.9 - k*0.16, 0.3, 1) * (0.5+0.5*s.fi);
      g.beginPath(); g.ellipse(s.sx,s.sy,r,r*0.92,0,0,TAU); g.stroke();
      g.restore();
    }
    if (!stopped){
      // crosshair
      g.strokeStyle=INK; g.lineWidth=3;
      g.beginPath(); g.moveTo(s.sx-ringU*0.85,s.sy); g.lineTo(s.sx+ringU*0.85,s.sy); g.stroke();
      g.beginPath(); g.moveTo(s.sx,s.sy-ringU*0.85); g.lineTo(s.sx,s.sy+ringU*0.85); g.stroke();
    }
    // dark seat + blue focus mark
    const seat = ringU*0.44;
    pen.paint(()=>{ g.arc(s.sx,s.sy,seat,0,TAU); }, toneSolid(inkLevel(1)), 3);
    pen.paint(()=>{ g.arc(s.sx,s.sy,seat*0.6,0,TAU); }, toneSolid(inkLevel(stopped?2:7)), 3);
    if (!stopped){ g.fillStyle=ACCENT; g.beginPath(); g.arc(s.sx,s.sy,seat*0.30,0,TAU); g.fill(); }
  }

  // ---- RHYTHM STRIP: the naming cadence (kinship names = accented ticks) ----
  const bx0=W*0.14, bx1=W*0.86, baseY=H*0.90;
  const n=params.beatCount, span=bx1-bx0, gapW=span/(n-1);
  pen.ink(()=>{ g.moveTo(bx0-14,baseY); g.lineTo(bx1+14,baseY); }, 3);
  for(let i=0;i<n;i++){
    const bx=bx0+i*gapW;
    const acc=params.beatPattern[i%params.beatPattern.length]; // 1..3
    // under focus the murmur (soft ticks) recedes; named cries (acc=3) still ring out
    let on, lvl, h, w;
    if (stopped){ on=false; }
    else if (acc>=3){ on=true; }                               // kinship names survive the hush
    else { on = focus < 0.5; }                                 // murmur only when no one dominates
    const soft = !on;
    h=(10+acc*15) * (soft?0.45:1);
    lvl = soft ? 1 : (acc>=3?6:acc>=2?5:4);
    w = acc>=3?9:6;
    g.fillStyle=inkLevel(lvl); g.fillRect(bx-w/2, baseY-h, w, h);
    if(on){ g.strokeStyle=INK; g.lineWidth=2; g.strokeRect(bx-w/2, baseY-h, w, h); }
  }
}

/* precomputed normalized emitter anchors */
const SHADE_ANCHORS = (()=>{
  const o={};
  EMITTERS.forEach((e,i)=>{ o[`shade:${i}`]={ x:e.x, y:e.y }; });
  return o;
})();

export const asset = {
  id:"sound_source.underworld-chorus",
  type:"SOUND_SOURCE",
  name:"Underworld chorus",
  statusWord:"MURMURING",
  scene:"OD-B11-S05",

  params,
  // back -> front draw order the diagram honors
  layers:["field","damp-zone","whispers","markers","focus","rhythm"],
  // normalized 0..1 emitter positions + focus centre + camera
  anchors:{
    ...SHADE_ANCHORS,
    "focus:center":{ x:EMITTERS[params.focusIndex].x, y:EMITTERS[params.focusIndex].y },
    "camera:diagram":{ x:0.50, y:0.50 },
  },
  // relation to visible action: whispers fill the field; naming cadence runs the base
  zones:{ field:{ x0:.08,y0:.09,x1:.92,y1:.86 }, rhythm:{ x0:.14,y0:.84,x1:.86,y1:.92 } },
  states:{
    initial:"chorus",
    nodes:{
      chorus:{    preview:{ intensity:0.72, focus:0.06, focusIndex:7, stopped:false, status:"MURMURING", progress:0.72 } },
      focusing:{  preview:{ intensity:0.60, focus:0.70, focusIndex:7, stopped:false, status:"RECEDING",  progress:0.50 } },
      named:{     preview:{ intensity:0.50, focus:0.95, focusIndex:4, stopped:false, status:"NAMED",     progress:0.95 } },
      silent:{    preview:{ intensity:0.00, focus:0.00, focusIndex:7, stopped:true,  status:"SILENT",    progress:0.02 } },
    },
    edges:[
      ["chorus","focusing"],["focusing","chorus"],
      ["focusing","named"],["named","focusing"],
      ["named","chorus"],
      ["chorus","silent"],["silent","chorus"],
    ],
  },
  channels:["intensity","focus","focusIndex","rhythm"],

  preview:()=>({ intensity:0.72, focus:0.06, focusIndex:7, stopped:false, status:"MURMURING", progress:0.72 }),
  draw(ctx,W,H,state){ drawDiagram(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
