/* prop.golden-winged-sandals — the talaria: a pair of golden sandals with
   small feathered wings at the ankles. PROP asset (Hermes' travel device
   loaned to a traveller). Isolated reusable object drawn in SOLID grays +
   hard contour into the offscreen ctx; the engine dotify pass supplies the
   halftone. Do NOT pre-dither.
   Scene function (OD-B01-S02): a wearable divine travel device with three
   states — DORMANT (grounded, wings folded), GLOWING (charged, radiant),
   FLIGHT (wings spread, lifted, motion streaks).
   Two sandals: a back one (raised, smaller) and a front one, so the pair
   reads as a set. Contact/grip/attach anchors declared in 0..1 space. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  pairGap:0.19,      // horizontal separation of the two sandals (fraction of W)
  soleLen:0.30,      // sandal sole length (fraction of W)
  soleTh:0.08,       // sole thickness (fraction of H)
  wingSpan:0.28,     // base wing length (fraction of H)
  feathers:6,        // feathers per wing
  toeRight:true,     // sandals point toe-right
};

/* rounded-rect path helper (no fill/stroke; caller wraps in pen.paint) */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}

/* one long feather as a filled lens rooted at (x,y) pointing along ang. */
function feather(g,x,y,ang,L,w){
  const tx=x+Math.cos(ang)*L, ty=y+Math.sin(ang)*L;
  const px=Math.cos(ang+Math.PI/2), py=Math.sin(ang+Math.PI/2);
  const mx=(x+tx)/2, my=(y+ty)/2;
  g.moveTo(x,y);
  g.quadraticCurveTo(mx+px*w, my+py*w, tx, ty);
  g.quadraticCurveTo(mx-px*w, my-py*w, x, y);
  g.closePath();
}

/* one feathered wing rooted at (ox,oy): a fan of feathers sweeping UP and
   BACK (toe points +x, so wing rakes toward -x and -y). spread 0..1 opens
   and lengthens the fan. Alternating feather tones read as separate quills. */
function drawWing(pen,g,ox,oy,len,spread,faint){
  const n = params.feathers;
  const open = lerp(0.55, 1.0, spread);
  const a0 = (Math.PI/180)*lerp(198, 190, spread);   // lowest feather (rakes back)
  const a1 = (Math.PI/180)*lerp(236, 264, spread);   // top feather (upright)
  const w  = len*0.115;
  for(let i=0;i<n;i++){
    const f = n>1 ? i/(n-1) : 0;
    const ang = lerp(a0, a1, f);
    const L = len*open*lerp(0.72, 1.12, Math.sin(f*Math.PI)*0.45 + (1-Math.abs(f-0.55))*0.4);
    const lvl = faint ? (i%2?2:1) : (i%2?4:3);
    pen.paint(()=>feather(g,ox,oy,ang,L,w), toneSolid(inkLevel(lvl)), 3.5);
  }
  // wing shoulder knuckle where the quills meet
  pen.paint(()=>{ g.ellipse(ox,oy,w*1.1,w*1.1,0,0,7); }, toneSolid(inkLevel(faint?2:5)), 3);
}

/* one sandal, heel at (hx,hy), toe extending to +x (toeRight). scale 1 = front. */
function drawSandal(pen,g,W,H,hx,hy,scale,st){
  const L = W*params.soleLen*scale;
  const th = H*params.soleTh*scale;
  const dir = params.toeRight?1:-1;
  const toeX = hx + dir*L;

  // ---- ANKLE WINGS (behind the foot / cuff) ----
  const wLen = H*params.wingSpan*scale*lerp(0.95,1.3,st.fly);
  const wRoot = { x: hx - dir*th*0.15, y: hy - th*1.35 };
  if (st.fly>0.5){ // flight: a second, faded wing behind for the flap
    drawWing(pen,g, wRoot.x-th*0.3, wRoot.y+th*0.2, wLen*1.02, 1.0, true);
  }
  drawWing(pen,g, wRoot.x, wRoot.y, wLen, st.spread, false);

  // ---- SOLE (leather platform) ----
  const soleX = Math.min(hx, toeX) - th*0.5;
  pen.paint(()=>{ rr(g, soleX, hy, L+th, th, th*0.5); }, toneSolid(inkLevel(5)), 5);
  // footbed (lighter top layer)
  pen.paint(()=>{ rr(g, soleX+th*0.4, hy-th*0.55, L+th*0.2, th*0.7, th*0.35); }, toneSolid(inkLevel(3)), 4);

  // ---- ANKLE CUFF collar at the heel ----
  const cuffW = th*1.25, cuffH = th*1.5;
  pen.paint(()=>{ rr(g, hx - cuffW*0.5, hy-cuffH, cuffW, cuffH, cuffW*0.45); }, toneSolid(inkLevel(4)), 4);

  // ---- STRAPS: diagonal thongs from footbed up to the cuff + a toe loop ----
  const bedY = hy - th*0.4;
  pen.ink(()=>{ g.moveTo(hx+dir*L*0.12, bedY); g.lineTo(hx, hy-cuffH*0.6); }, 4);
  pen.ink(()=>{ g.moveTo(hx+dir*L*0.42, bedY); g.lineTo(hx+dir*L*0.06, hy-cuffH*0.55); }, 4);
  pen.ink(()=>{ g.moveTo(hx+dir*L*0.42, bedY); g.lineTo(hx+dir*L*0.62, hy-cuffH*0.25); }, 4);
  // toe loop
  pen.ink(()=>{ g.moveTo(toeX-dir*L*0.06, bedY); g.lineTo(toeX-dir*L*0.14, hy-th*0.9); }, 4);

  // ---- GOLD highlight seam along the footbed rim ----
  pen.seam(()=>{ g.moveTo(soleX+th*0.5, hy); g.lineTo(soleX+L+th*0.3, hy); }, 2.5);

  return { toeX, bedY, cuff:{x:hx,y:hy-cuffH*0.5}, wRoot };
}

function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const glow = st.glow ?? 0;      // 0 dormant .. 1 glowing/charged
  const fly  = st.fly ?? 0;       // 0 grounded .. 1 in flight
  const spread = st.spread ?? clamp(0.25 + glow*0.35 + fly*0.5, 0, 1);
  const t = st.t || 0;

  const midX = W*0.47, baseY = H*(fly>0.5 ? 0.55 : 0.60);
  const gap = W*params.pairGap;

  // ---- ground shadow when grounded (dormant/glowing) ----
  if (fly < 0.5){
    g.fillStyle="rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(midX, baseY+H*params.soleTh*0.7+8, W*0.30, H*0.022, 0,0,7); g.fill();
  }

  // ---- GLOW: radiant strokes behind the pair (drawn as light tone rays) ----
  if (glow>0.05){
    const rays = 14; const cx=midX, cy=baseY-H*0.06;
    g.save(); g.strokeStyle = inkLevel(Math.round(lerp(1,3,glow)));
    g.lineWidth = Math.max(2, W*0.006); g.lineCap="round";
    for(let i=0;i<rays;i++){
      const a = (i/rays)*Math.PI*2;
      const r0 = W*0.22, r1 = r0 + W*0.06*lerp(0.5,1.2,glow)*(0.7+0.3*Math.sin(i*1.7+t));
      g.beginPath();
      g.moveTo(cx+Math.cos(a)*r0, cy+Math.sin(a)*r0*0.8);
      g.lineTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1*0.8);
      g.stroke();
    }
    g.restore();
    // charged core halo
    pen.paint(()=>{ g.ellipse(cx,cy,W*0.055,W*0.055,0,0,7); }, toneSolid(inkLevel(Math.round(lerp(2,3,glow)))), 3);
  }

  // ---- FLIGHT: motion streak lines trailing behind the toe ----
  if (fly>0.05){
    g.save(); g.strokeStyle=inkLevel(3); g.lineWidth=Math.max(2,W*0.008); g.lineCap="round";
    for(let i=0;i<5;i++){
      const yy = baseY - H*0.02 + (i-2)*H*0.03;
      const x0 = midX - W*0.34, x1 = x0 - W*0.14*fly*(0.6+0.2*i);
      g.beginPath(); g.moveTo(x0,yy); g.lineTo(x1,yy); g.stroke();
    }
    g.restore();
  }

  // ---- THE PAIR: back sandal (raised, smaller) then front sandal ----
  const backY = baseY - H*(0.085 + fly*0.03);
  drawSandal(pen,g,W,H, midX - gap*0.55, backY, 0.82, {spread:spread*0.92, fly});
  drawSandal(pen,g,W,H, midX + gap*0.45, baseY, 1.0, {spread, fly});
}

export const asset = {
  id:"prop.golden-winged-sandals",
  type:"PROP",
  name:"Golden Winged Sandals",
  statusWord:"DORMANT",
  scene:"OD-B01-S02",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","glow","streaks","back-wing","back-sandal","front-wing","front-sandal","straps","highlight"],
  // normalized 0..1 anchors: attach to a wearer's ankles, contact/support, grip
  anchors:{
    "attach:ankle-left":{x:.40,y:.52},   // cuff of the back sandal
    "attach:ankle-right":{x:.60,y:.56},  // cuff of the front sandal
    "contact:sole-left":{x:.42,y:.63},   // ground contact when dormant
    "contact:sole-right":{x:.62,y:.66},
    "grip:heel":{x:.60,y:.58},           // where a hand would lift the pair
    "fx:glow-core":{x:.50,y:.54},        // radiant source when charged
    "fx:wing-tip":{x:.30,y:.34},         // spread wing tip in flight
  },
  // collision shape (AABB in 0..1) for placement/pathing
  zones:{ bounds:{ x0:.24,y0:.30,x1:.80,y1:.68 } },
  states:{
    initial:"dormant",
    nodes:{
      dormant:{ preview:{ glow:0,   fly:0,   spread:0.22, status:"DORMANT", progress:.12 } },
      glowing:{ preview:{ glow:1,   fly:0,   spread:0.5,  status:"CHARGED", progress:.55 } },
      flight: { preview:{ glow:0.6, fly:1,   spread:1.0,  status:"FLIGHT",  progress:.92 } },
    },
    edges:[["dormant","glowing"],["glowing","flight"],["flight","glowing"],["glowing","dormant"]],
  },
  channels:["glow","fly","spread","t"],

  preview:()=>({ glow:0, fly:0, spread:0.22, t:0, status:"DORMANT", progress:.12 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
