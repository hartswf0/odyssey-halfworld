/* set_piece.cave-floor-and-blood-state — a stretch of stone cave ground.
   SET_PIECE. A receding slab of rough cavern FLOOR — irregular flagstones with
   scored seams, scattered rubble, framed by dark cave-wall at the back and dark
   depth at the sides. The same ground carries FIVE alternate states of one
   violent event on it: clean bare stone / impact (a radial fracture star where a
   body was dashed down) / blood-spread (a dark pool welling from the impact) /
   remains (the pool gone tacky with scattered dark remnants) / later-cleared
   (swept stone with only a faint ghost stain left in the rock).
   Drawn as a separable environmental component in SOLID grays + hard contour;
   the engine dotify pass supplies the halftone. Declares placement/collision,
   an impact/contact anchor, approach anchors, a depth layer, and the state set.
   Atlas: OD-B09-S07 — stone ground: clean, impact, blood-spread, remains, later-cleared. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

/* ---------- normalized layout (anchors + draw share these fractions of W,H) ---------- */
const L = {
  horizon:  0.360,    // where cave-wall base meets the floor plane
  impactX:  0.500,    // the contact point of the event on the floor
  impactY:  0.640,    // *H
  vanishX:  0.500,    // perspective vanishing column
};

const params = {
  flagRows:   5,      // depth courses of flagstones
  crackArms:  9,      // radial fracture arms in the impact star
  rubble:     11,     // scattered loose stones
  poolR:      0.200,  // *W  blood-pool spread radius
  captions:   true,   // STONE / IMPACT tag
};

/* ---------- helpers ---------- */
function tracked(g, text, x, y, size, track, color){
  g.save(); g.fillStyle=color; g.textBaseline="middle";
  g.font=`800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let cx=x; for(const ch of text){ g.fillText(ch,cx,y); cx+=g.measureText(ch).width+track; }
  g.restore();
}
/* an irregular closed blob around (cx,cy) with per-vertex radius jitter */
function blob(g, cx, cy, rx, ry, rng, jitter, n=18){
  g.beginPath();
  for(let i=0;i<=n;i++){
    const a=(i/n)*Math.PI*2;
    const j=1 - jitter + rng()*jitter*2;
    const x=cx+Math.cos(a)*rx*j, y=cy+Math.sin(a)*ry*j;
    if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
  }
  g.closePath();
}

/* ---------- the set ---------- */
function drawCave(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const phase = st.phase || "clean";           // clean|impact|blood|remains|cleared
  const layers = st.layers || ["walls","floor","flags","rubble","event"];
  const has = l => layers.includes(l);

  const hz = L.horizon*H;
  const ix = L.impactX*W, iy = L.impactY*H;
  const vx = L.vanishX*W;

  /* ---- CAVE WALLS: dark rock enclosing the ground, and dark side gloom ---- */
  if (has("walls")){
    // deep back wall of the cavern (mid-dark, uneven lower edge)
    pen.paint(()=>{
      g.moveTo(0,0); g.lineTo(W,0); g.lineTo(W,hz);
      // ragged rock base of the far wall
      const steps=9;
      for(let i=steps;i>=0;i--){
        const x=(i/steps)*W;
        const y=hz - Math.sin(i*1.7)*H*0.018 - (i%2?H*0.012:0);
        g.lineTo(x,y);
      }
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // a lighter overhang band along the top so the wall reads as textured rock, not a void
    g.save(); g.globalAlpha=0.6;
    pen.fillPath(()=>{ g.rect(0,0,W,hz*0.34); }, inkLevel(2));
    g.restore();
    // a couple of darker rock fissures on the back wall
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.55; g.lineWidth=3;
    for(const fx of [0.20,0.44,0.70,0.86]){
      g.beginPath(); g.moveTo(fx*W, H*0.02);
      g.lineTo(fx*W + W*0.02, hz*0.5); g.lineTo(fx*W - W*0.01, hz*0.92); g.stroke();
    }
    g.restore();
    // dark side gloom wedges — the cave mouth is behind us, walls press in
    pen.paint(()=>{ g.moveTo(0,hz); g.lineTo(W*0.13,hz); g.lineTo(0,H); g.closePath(); }, toneSolid(inkLevel(4)), 4);
    pen.paint(()=>{ g.moveTo(W,hz); g.lineTo(W*0.87,hz); g.lineTo(W,H); g.closePath(); }, toneSolid(inkLevel(4)), 4);
  }

  /* ---- FLOOR: the stone ground plane (light so it reads as ground) ---- */
  if (has("floor")){
    pen.paint(()=>{
      g.moveTo(W*0.02,hz); g.lineTo(W*0.98,hz); g.lineTo(W,H); g.lineTo(0,H); g.closePath();
    }, toneSolid(inkLevel(2)), 4);
  }

  /* ---- FLAGSTONES: irregular paving, courses receding to the back wall ---- */
  if (has("flags")){
    const fr = rnd(4207);
    g.save(); g.strokeStyle=INK; g.lineWidth=2.4; g.globalAlpha=0.55;
    // depth course lines (horizontal-ish, compressing toward horizon)
    for(let r=1;r<=params.flagRows;r++){
      const t=r/params.flagRows;
      const y=hz + (H-hz)*(t*t);       // quadratic compression near the back
      g.beginPath();
      const segs=8;
      for(let s=0;s<=segs;s++){
        const x=(s/segs)*W;
        const yy=y + Math.sin(s*2.1+r)*H*0.006;
        if(s===0) g.moveTo(x,yy); else g.lineTo(x,yy);
      }
      g.stroke();
    }
    // radial seams fanning from the vanishing column -> perspective paving
    for(let i=-5;i<=5;i++){
      const spread=W*0.16 + Math.abs(i)*W*0.02;
      g.beginPath();
      g.moveTo(vx + i*W*0.03, hz);
      g.lineTo(vx + i*spread, H);
      g.stroke();
    }
    g.restore();
    // a few darker sunken flagstones near the front for tonal weight
    for(let i=0;i<4;i++){
      const px=lerp(W*0.10,W*0.90,fr()), py=lerp(hz+(H-hz)*0.45,H*0.94,fr());
      pen.paint(()=>{ blob(g,px,py,W*0.055,H*0.028,fr,0.35,8); }, toneSolid(inkLevel(fr()<0.5?3:2)), 2.5);
    }
  }

  /* ---- RUBBLE: loose scattered stones on the ground ---- */
  if (has("rubble")){
    const rr = rnd(88);
    for(let i=0;i<params.rubble;i++){
      const t=rr();
      const py=lerp(hz+(H-hz)*0.30, H*0.95, t);
      const sc=lerp(0.5,1.25,t);                 // nearer = larger
      const px=lerp(W*0.08,W*0.92,rr());
      // keep rubble off the exact impact spot
      if(Math.abs(px-ix)<W*0.09 && Math.abs(py-iy)<H*0.06) continue;
      pen.paint(()=>{ blob(g,px,py,W*0.026*sc,H*0.016*sc,rr,0.4,7); }, toneSolid(inkLevel(rr()<0.4?5:3)), 3);
    }
  }

  /* ---- EVENT: the state carried on the same ground ---- */
  if (has("event")){
    const poolR=params.poolR*W;

    // IMPACT fracture star (present in impact/blood/remains — the ground was struck)
    if (phase==="impact" || phase==="blood" || phase==="remains"){
      g.save(); g.strokeStyle=INK; g.lineCap="round";
      const cr=rnd(5150);
      for(let i=0;i<params.crackArms;i++){
        const a=(i/params.crackArms)*Math.PI*2 + cr()*0.3;
        const len=poolR*lerp(0.55,1.15,cr());
        g.lineWidth=lerp(4,1.5,i/params.crackArms);
        let x=ix, y=iy;
        g.beginPath(); g.moveTo(x,y);
        const segs=4;
        for(let s=1;s<=segs;s++){
          const st2=s/segs;
          x=ix+Math.cos(a)*len*st2 + (cr()-0.5)*W*0.02;
          y=iy+Math.sin(a)*len*st2*0.6 + (cr()-0.5)*H*0.012;   // squash y for ground plane
          g.lineTo(x,y);
        }
        g.stroke();
      }
      // crushed central crater
      g.restore();
      pen.paint(()=>{ blob(g,ix,iy,poolR*0.20,poolR*0.13,rnd(11),0.4,10); }, toneSolid(inkLevel(6)), 3);
    }

    // BLOOD-SPREAD dark pool welling from the impact
    if (phase==="blood"){
      const br=rnd(777);
      // outer spread (darkest solid -> reads as a heavy pool of dots)
      pen.paint(()=>{ blob(g,ix,iy+H*0.006,poolR,poolR*0.62,br,0.30,22); }, toneSolid(inkLevel(7)), 4);
      // a couple of runnels creeping downhill toward the viewer
      for(const dx of [-0.35,0.15,0.5]){
        pen.paint(()=>{
          g.moveTo(ix+dx*poolR*0.7, iy+poolR*0.35);
          g.quadraticCurveTo(ix+dx*poolR*1.1, iy+poolR*0.7, ix+dx*poolR*0.9, iy+poolR*1.15);
          g.quadraticCurveTo(ix+dx*poolR*0.6, iy+poolR*0.7, ix+dx*poolR*0.4, iy+poolR*0.4);
          g.closePath();
        }, toneSolid(inkLevel(7)), 3);
      }
      // wet highlight core (light -> sparse dots -> reads as sheen)
      pen.paint(()=>{ blob(g,ix-poolR*0.12,iy-poolR*0.08,poolR*0.28,poolR*0.18,br,0.25,12); }, toneSolid(inkLevel(3)), 2);
    }

    // REMAINS: pool gone tacky (mid-dark) with scattered dark remnants
    if (phase==="remains"){
      const mr=rnd(3131);
      // dried/darkened stain, smaller and irregular
      pen.paint(()=>{ blob(g,ix,iy+H*0.004,poolR*0.82,poolR*0.5,mr,0.42,22); }, toneSolid(inkLevel(6)), 4);
      // scattered dark remnants around it
      for(let i=0;i<7;i++){
        const a=mr()*Math.PI*2, rad=lerp(poolR*0.5,poolR*1.3,mr());
        const px=ix+Math.cos(a)*rad, py=iy+Math.sin(a)*rad*0.6;
        pen.paint(()=>{ blob(g,px,py,poolR*lerp(0.05,0.13,mr()),poolR*lerp(0.03,0.08,mr()),mr,0.5,7); }, toneSolid(inkLevel(7)), 3);
      }
      // dried crack-fill (darker seams radiating short)
      g.save(); g.strokeStyle=inkLevel(7); g.lineWidth=3; g.globalAlpha=0.7;
      for(let i=0;i<5;i++){ const a=i/5*Math.PI*2;
        g.beginPath(); g.moveTo(ix,iy); g.lineTo(ix+Math.cos(a)*poolR*0.5, iy+Math.sin(a)*poolR*0.32); g.stroke(); }
      g.restore();
    }

    // LATER-CLEARED: swept stone, only a faint ghost stain left in the rock
    if (phase==="cleared"){
      const gr=rnd(2020);
      // faint residual discoloration (light tone, soft edge)
      g.save(); g.globalAlpha=0.7;
      pen.fillPath(()=>{ blob(g,ix,iy,poolR*0.7,poolR*0.44,gr,0.3,18); }, inkLevel(3));
      g.restore();
      // sweep-marks: faint arced brush strokes across the spot
      g.save(); g.strokeStyle=inkLevel(3); g.lineWidth=2; g.globalAlpha=0.5;
      for(let i=-2;i<=2;i++){
        g.beginPath();
        g.moveTo(ix-poolR*0.9, iy+i*H*0.014);
        g.quadraticCurveTo(ix, iy+i*H*0.014 - H*0.02, ix+poolR*0.9, iy+i*H*0.014);
        g.stroke();
      }
      g.restore();
      // a lingering hairline crack still in the stone (the ground remembers)
      g.save(); g.strokeStyle=INK; g.globalAlpha=0.6; g.lineWidth=2;
      g.beginPath(); g.moveTo(ix-poolR*0.4, iy-poolR*0.2);
      g.lineTo(ix, iy); g.lineTo(ix+poolR*0.5, iy+poolR*0.15); g.stroke();
      g.restore();
    }
  }

  /* ---- CAPTIONS + blue tick ---- */
  if (params.captions && has("floor")){
    tracked(g, "STONE", W*0.055, H*0.965, W*0.026, W*0.006, INK);
    if (phase!=="clean"){
      tracked(g, phase==="cleared"?"CLEARED":"IMPACT", ix+W*0.05, iy-H*0.02, W*0.022, W*0.005, INK);
      g.fillStyle=ACCENT; g.fillRect(ix-W*0.012, iy-H*0.05, W*0.024, H*0.006);
    }
  }
}

export const asset = {
  id:"set_piece.cave-floor-and-blood-state",
  type:"SET_PIECE",
  name:"Cave Floor And Blood State",
  statusWord:"STONE",
  scene:"OD-B09-S07",

  params,
  // back -> front depth layers; scene state can pass a subset
  layers:["walls","floor","flags","rubble","event"],
  // normalized 0..1 placement / contact / camera anchors
  anchors:{
    "impact:contact": { x:L.impactX, y:L.impactY },
    "floor:center":   { x:0.50, y:0.78 },
    "approach:front": { x:0.50, y:0.965 },
    "approach:left":  { x:0.14, y:0.90 },
    "approach:right": { x:0.86, y:0.90 },
    "threshold:back": { x:0.50, y:L.horizon },
    "camera:wide":    { x:0.50, y:0.55 },
    "camera:impact":  { x:L.impactX, y:L.impactY },
  },
  // collision boundaries + walkable ground (normalized boxes)
  zones:{
    walkable:  { x0:0.10, y0:L.horizon, x1:0.90, y1:0.98 },
    impact:    { x0:L.impactX-0.16, y0:L.impactY-0.10, x1:L.impactX+0.16, y1:L.impactY+0.12 },
    wall:      { x0:0.0, y0:0.0, x1:1.0, y1:L.horizon },   // solid back wall
  },
  states:{
    initial:"clean",
    nodes:{
      // bare stone ground before the event
      clean:{ preview:{ phase:"clean",
        layers:["walls","floor","flags","rubble"], status:"CLEAN", progress:.10 } },
      // the ground struck — radial fracture star + crater
      impact:{ preview:{ phase:"impact",
        layers:["walls","floor","flags","rubble","event"], status:"IMPACT", progress:.35 } },
      // dark pool welling and spreading from the impact
      blood:{ preview:{ phase:"blood",
        layers:["walls","floor","flags","rubble","event"], status:"BLOOD", progress:.62 } },
      // pool gone tacky, scattered dark remnants
      remains:{ preview:{ phase:"remains",
        layers:["walls","floor","flags","rubble","event"], status:"REMAINS", progress:.80 } },
      // swept stone, only a ghost stain and a hairline crack left
      cleared:{ preview:{ phase:"cleared",
        layers:["walls","floor","flags","rubble","event"], status:"CLEARED", progress:.96 } },
    },
    edges:[["clean","impact"],["impact","blood"],["blood","remains"],["remains","cleared"]],
  },
  channels:["phase","reveal","stain","light"],

  preview:()=>({
    phase:"blood",
    layers:["walls","floor","flags","rubble","event"],
    status:"BLOOD", progress:.62,
  }),
  draw(ctx,W,H,state){ drawCave(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
