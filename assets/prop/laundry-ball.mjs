/* prop.laundry-ball — a hand-sized stitched ball: the ball the princess
   Nausicaa and her maids toss on the riverbank; the miss that sends it into
   the water and the shout that follows is what wakes Odysseus. PROP asset.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.
   Scene function (OD-B06-S02): a small reusable object, centered, with motion
   arc hints and six states —
     THROW  (in flight along a dashed parabolic arc, speed streaks trailing),
     CATCH  (cupped hands close around it from below at the contact anchor),
     MISS   (a reaching hand falls short — a paper gap — arc sails past),
     WATER-IMPACT / SPLASH (ball at the river surface, droplets fly, rings spread),
     RETRIEVE (lifted dripping above the surface, a gripping hand),
     ATTENTION-TRIGGER (the ball rings out attention — concentric alert rings
        + accent ticks — the beat that draws a sleeper's eye).
   The ball is a stitched two-panel leather ball (mid tone) with a curved seam
   girdle and stitch ticks; a light crown highlight and a dark ground-contact
   shade give it volume. Grip / contact / support / centre anchors declared in
   0..1 space. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  cx:0.50,          // ball centre x (fraction of W) — centred
  cy:0.50,          // ball centre y (fraction of H)
  radius:0.150,     // ball radius (fraction of W) — hand-sized
  panels:2,         // stitched panels (two curved seams cross the face)
  waterY:0.700,     // river surface line (fraction of H) for water states
};

const BALL   = 4;   // stitched leather body (mid tone)
const CROWN  = 2;   // light highlight crown (upper-left)
const BELLY  = 5;   // shaded lower belly / ground-contact side
const WATER  = 3;   // river surface tone
const WATER_D= 4;   // water shade / disturbed dip
const HAND   = 4;   // hand / arm tone
const HAND_D = 5;   // hand shade

/* ------------------------------------------------------------------
   THE BALL — a stitched two-panel ball centred at (cx,cy) radius r.
   Returns key world points. Draws body -> crown highlight -> seams -> ticks. */
function drawBall(pen,g,cx,cy,r,t){
  // ---- ground / contact shadow (only meaningful when it sits on something;
  //      drawn faint so it never competes with the object) ----
  g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, cy+r*1.02, r*0.92, r*0.20, 0,0,7); g.fill();

  // ---- BODY: the leather sphere (mid tone) ----
  pen.paint(()=>{ g.arc(cx, cy, r, 0, 7); }, toneSolid(inkLevel(BALL)), 5);

  // ---- BELLY shade: a thin darker crescent hugging the lower-right rim
  //      (terminator = outer circle minus an inner circle nudged up-left) ----
  pen.fillPath(()=>{
    g.arc(cx, cy, r*0.99, Math.PI*0.06, Math.PI*0.86);                 // outer bottom-right
    g.arc(cx-r*0.20, cy-r*0.22, r*0.90, Math.PI*0.86, Math.PI*0.06, true); // inner, reversed
    g.closePath();
  }, inkLevel(BELLY));

  // ---- CROWN highlight: a light upper-left crescent (specular) ----
  pen.fillPath(()=>{ g.ellipse(cx-r*0.36, cy-r*0.36, r*0.42, r*0.30, -0.7, 0,7); }, inkLevel(CROWN));

  // ---- SEAM girdle: two curved seams crossing the face (panel joins) ----
  // an equatorial ellipse (the seam that wraps around) ...
  pen.ink(()=>{ g.ellipse(cx, cy, r*0.98, r*0.40, 0, 0.05, Math.PI-0.05); }, 3.2);
  pen.ink(()=>{ g.ellipse(cx, cy, r*0.98, r*0.40, 0, Math.PI+0.05, -0.05); }, 3.2);
  // ... and a meridional seam (top to bottom, curved to read as a sphere)
  pen.ink(()=>{ g.ellipse(cx, cy, r*0.40, r*0.98, 0, -Math.PI*0.5+0.05, Math.PI*0.5-0.05); }, 3.2);
  pen.ink(()=>{ g.ellipse(cx, cy, r*0.40, r*0.98, 0, Math.PI*0.5+0.05, Math.PI*1.5-0.05); }, 3.2);

  // ---- STITCH ticks: short cross-hatches straddling the equatorial seam ----
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  for(let k=-4;k<=4;k++){
    const a = k/5 * (Math.PI*0.86);
    const ex = cx + Math.cos(a)*r*0.98, ey = cy + Math.sin(a)*r*0.40;
    // tick perpendicular-ish to the seam (mostly vertical)
    g.beginPath(); g.moveTo(ex-r*0.05, ey-r*0.09); g.lineTo(ex+r*0.05, ey+r*0.09); g.stroke();
  }

  return { cx, cy, r, top:{x:cx,y:cy-r}, bottom:{x:cx,y:cy+r} };
}

/* a wavy falling / flying droplet */
function droplet(g, x, y, s){
  g.beginPath();
  g.moveTo(x, y-s*1.6);
  g.quadraticCurveTo(x+s, y-s*0.2, x, y+s);
  g.quadraticCurveTo(x-s, y-s*0.2, x, y-s*1.6);
  g.closePath();
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const thr  = st.throw    ?? 0;   // in flight
  const cat  = st.catch    ?? 0;   // cupped catch
  const mis  = st.miss     ?? 0;   // reach falls short
  const spl  = st.splash   ?? 0;   // water impact
  const ret  = st.retrieve ?? 0;   // lifted dripping
  const att  = st.attention?? 0;   // attention-trigger rings
  const t     = st.t       ?? 0;

  const cx = W*params.cx;
  const cy = H*params.cy;
  const r  = W*params.radius;
  const waterY = H*params.waterY;

  // ================= BACKGROUND FIELD (water states) =================
  if (spl>0.02 || ret>0.02){
    // river surface band across the lower stage
    g.fillStyle=inkLevel(WATER); g.fillRect(0, waterY, W, H-waterY);
    // surface line
    pen.ink(()=>{ g.moveTo(0, waterY); g.lineTo(W, waterY); }, 3);
    // a few resting ripple lines further out
    g.strokeStyle=inkLevel(WATER_D); g.lineWidth=2; g.lineCap="round";
    for(let i=1;i<=3;i++){
      const yy=waterY + (H-waterY)*(i/4);
      g.beginPath(); g.moveTo(W*0.10, yy); g.lineTo(W*0.90, yy); g.stroke();
    }
  }

  // ================= MOTION ARC HINT (throw / miss / catch) =================
  if (thr>0.02 || mis>0.02 || cat>0.02){
    g.save();
    g.strokeStyle=ACCENT; g.globalAlpha=0.55; g.lineWidth=2.5;
    g.setLineDash([9,8]); g.lineCap="round";
    g.beginPath();
    // a parabola sweeping through the ball centre
    const ax0=W*0.08, ay0=H*0.72, apx=cx, apy=cy-r*2.2, ax1=W*0.92, ay1=mis>0.02?H*0.80:H*0.40;
    g.moveTo(ax0, ay0);
    g.quadraticCurveTo(apx, apy, ax1, ay1);
    g.stroke();
    g.setLineDash([]);
    // arrow head hinting travel direction (upper-right)
    g.globalAlpha=0.8;
    g.beginPath();
    g.moveTo(ax1, ay1); g.lineTo(ax1-W*0.045, ay1-H*0.006);
    g.moveTo(ax1, ay1); g.lineTo(ax1-W*0.030, ay1+H*0.030);
    g.stroke();
    g.restore();
  }

  // ================= WATER IMPACT SETUP: ball rides the surface ========
  let bx=cx, by=cy;
  if (spl>0.02){
    by = waterY - r*0.35;                          // half-sunk at the surface
  } else if (ret>0.02){
    by = waterY - r*1.7 - Math.sin(t*2)*r*0.05;    // lifted clear, slight bob
  }

  // ================= THE BALL =================
  const B = drawBall(pen,g,bx,by,r,t);

  // speed streaks trailing a thrown ball (behind travel, to the lower-left)
  if (thr>0.02){
    g.strokeStyle=INK; g.lineWidth=2.5; g.lineCap="round"; g.globalAlpha=0.6;
    for(let i=0;i<3;i++){
      const yy = by - r*0.4 + i*r*0.42;
      g.beginPath(); g.moveTo(bx-r*1.15-i*r*0.10, yy); g.lineTo(bx-r*0.55, yy); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ================= CATCH: cupped hands close from below =================
  if (cat>0.02){
    for(const s of [-1,1]){
      const px = bx + s*r*0.62, py = by + r*0.78;
      // palm cup
      pen.paint(()=>{ g.ellipse(px, py, r*0.42, r*0.30, s*0.5, 0, 7); }, toneSolid(inkLevel(HAND)), 4);
      // fingers curling up around the ball
      for(let f=-1;f<=1;f++){
        const fx = px + f*r*0.22 - s*r*0.10, fy = py - r*0.16;
        pen.limb(()=>{ g.moveTo(fx, fy+r*0.18); g.lineTo(fx - s*r*0.02, fy - r*0.22); }, toneSolid(inkLevel(HAND)), r*0.11);
      }
      // wrist trailing down out of frame
      pen.limb(()=>{ g.moveTo(px, py+r*0.1); g.lineTo(px + s*r*0.35, py + r*0.9); }, toneSolid(inkLevel(HAND_D)), r*0.30);
    }
    // small contact ticks where fingertips meet the ball
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
    for(let f=-2;f<=2;f++){ const a=f*0.5+Math.PI*0.5; g.beginPath();
      g.moveTo(bx+Math.cos(a)*r*0.9, by+Math.sin(a)*r*0.9); g.lineTo(bx+Math.cos(a)*r*1.05, by+Math.sin(a)*r*1.05); g.stroke(); }
  }

  // ================= MISS: a hand reaches but falls short (paper gap) ====
  if (mis>0.02){
    const hx = bx - r*1.65, hy = by + r*0.75;       // hand down-left of the ball
    // open reaching palm, splayed toward the ball
    pen.paint(()=>{ g.ellipse(hx, hy, r*0.40, r*0.30, -0.4, 0,7); }, toneSolid(inkLevel(HAND)), 4);
    for(let f=-2;f<=2;f++){
      const a=-0.9 + f*0.35;
      pen.limb(()=>{ g.moveTo(hx, hy); g.lineTo(hx+Math.cos(a)*r*0.55, hy+Math.sin(a)*r*0.55); }, toneSolid(inkLevel(HAND)), r*0.10);
    }
    pen.limb(()=>{ g.moveTo(hx, hy+r*0.1); g.lineTo(hx-r*0.5, hy+r*0.9); }, toneSolid(inkLevel(HAND_D)), r*0.30);
    // the tell-tale GAP: a small "no-contact" bracket between fingertip and ball
    g.save(); g.strokeStyle=ACCENT; g.lineWidth=2.5; g.setLineDash([4,5]);
    g.beginPath(); g.moveTo(hx+r*0.55, hy-r*0.4); g.lineTo(bx-r*0.85, by+r*0.1); g.stroke();
    g.setLineDash([]); g.restore();
  }

  // ================= WATER IMPACT / SPLASH =================
  if (spl>0.02){
    const surf = waterY;
    // a bright disturbed dip in the surface around the entry point
    pen.paint(()=>{ g.ellipse(bx, surf, r*1.25, r*0.34, 0, 0, Math.PI); g.closePath(); }, toneSolid(inkLevel(WATER_D)), 3);
    // crown splash: droplets flung up and out on both sides
    g.fillStyle=INK;
    const N=7;
    for(let i=0;i<N;i++){
      const a = Math.PI + (i/(N-1))*Math.PI;         // upper arc
      const rise = (0.6+0.4*Math.sin(i*1.7))*r*1.3;
      const dx = bx + Math.cos(a)*r*(1.0+0.3*Math.sin(i));
      const dy = surf - Math.abs(Math.sin(a))*rise - r*0.2;
      droplet(g, dx, dy, r*0.09); g.fill();
    }
    // concentric ripple rings spreading on the surface
    g.strokeStyle=inkLevel(WATER_D); g.lineWidth=2.5; g.lineCap="round";
    for(let i=0;i<3;i++){
      const phase=((t*0.5+i/3)%1);
      const rr = r*0.6 + phase*r*2.2;
      g.globalAlpha=(1-phase)*0.9;
      g.beginPath(); g.ellipse(bx, surf, rr, rr*0.26, 0,0,7); g.stroke();
    }
    g.globalAlpha=1;
    // near lip of the surface redrawn over the ball's base so it reads as half-sunk
    pen.ink(()=>{ g.moveTo(bx-r*1.3, surf); g.lineTo(bx-r*0.55, surf);
                  g.moveTo(bx+r*0.55, surf); g.lineTo(bx+r*1.3, surf); }, 3);
  }

  // ================= RETRIEVE: lifted dripping, a gripping hand ==========
  if (ret>0.02){
    // gripping hand cupping the underside of the raised ball
    const px = bx, py = by + r*0.9;
    pen.paint(()=>{ g.ellipse(px, py, r*0.5, r*0.34, 0, 0, 7); }, toneSolid(inkLevel(HAND)), 4);
    for(let f=-2;f<=2;f++){
      const fx = px + f*r*0.26;
      pen.limb(()=>{ g.moveTo(fx, py); g.lineTo(fx - f*r*0.04, py - r*0.34); }, toneSolid(inkLevel(HAND)), r*0.11);
    }
    // wrist / arm down toward the water
    pen.limb(()=>{ g.moveTo(px, py+r*0.1); g.lineTo(px+r*0.5, waterY+r*0.6); }, toneSolid(inkLevel(HAND_D)), r*0.34);
    // drips falling from the ball back to the surface
    g.fillStyle=INK;
    for(let i=0;i<4;i++){
      const dx = bx + (i-1.5)*r*0.4;
      const span = waterY - (by+r*0.6);
      const dy = (by+r*0.7) + ((t*H*0.30 + i*span*0.31) % span);
      droplet(g, dx, dy, r*0.07); g.fill();
    }
    // small dip in the water where it drained
    pen.ink(()=>{ g.ellipse(bx, waterY, r*0.7, r*0.16, 0, 0, Math.PI); }, 2.5);
  }

  // ================= ATTENTION-TRIGGER: alert rings + accent ticks =======
  if (att>0.02){
    g.save();
    // concentric alert rings blooming out from the ball
    const rings=4;
    for(let i=0;i<rings;i++){
      const phase=((t*0.6+i/rings)%1);
      const rr = r*1.15 + phase*r*1.9;
      g.globalAlpha=(1-phase)*0.85*att;
      g.strokeStyle=ACCENT; g.lineWidth=Math.max(1.5, 3.2*(1-phase));
      g.beginPath(); g.arc(bx, by, rr, 0, 7); g.stroke();
    }
    g.globalAlpha=1;
    // radiating accent ticks (the "look here!" burst) at the compass points
    g.strokeStyle=ACCENT; g.lineWidth=3; g.lineCap="round";
    for(let k=0;k<8;k++){
      const a=k/8*Math.PI*2;
      const r0=r*1.28, r1=r*1.6+(k%2?r*0.12:0);
      g.beginPath();
      g.moveTo(bx+Math.cos(a)*r0, by+Math.sin(a)*r0);
      g.lineTo(bx+Math.cos(a)*r1, by+Math.sin(a)*r1);
      g.stroke();
    }
    g.restore();
  }
}

export const asset = {
  id:"prop.laundry-ball",
  type:"PROP",
  name:"Laundry Ball",
  statusWord:"IN PLAY",
  scene:"OD-B06-S02",

  params,
  // back -> front draw order the prop honors
  layers:["water","arc","ball","streaks","catch","miss","splash","retrieve","attention"],
  // normalized 0..1 anchors: grip / support / contact / centre / motion
  anchors:{
    "centre":{x:.50,y:.50},           // ball centre (attention origin)
    "grip:overhand":{x:.50,y:.36},    // hand grips over the top to throw
    "grip:underhand":{x:.50,y:.64},   // cupped-hand contact underneath
    "contact:left":{x:.36,y:.55},     // left palm contact when caught
    "contact:right":{x:.64,y:.55},    // right palm contact when caught
    "surface:water":{x:.50,y:.70},    // river surface entry point
    "arc:launch":{x:.08,y:.72},       // start of the flight arc
    "arc:land":{x:.92,y:.40},         // end of the flight arc
  },
  // collision shape: the ball's circular footprint as an AABB (0..1)
  zones:{ bounds:{ x0:.35,y0:.35,x1:.65,y1:.65 }, footprint:{ x0:.35,y0:.63,x1:.65,y1:.67 } },
  // ownership: carried/tossed by Nausicaa and her handmaids
  ownership:{ owner:"nausicaa", shared:["handmaids"] },
  states:{
    initial:"throw",
    nodes:{
      throw:      { preview:{ throw:1,                                            status:"IN FLIGHT",  progress:.18 } },
      catch:      { preview:{ catch:1,                                            status:"CAUGHT",     progress:.34 } },
      miss:       { preview:{ miss:1,                                             status:"MISSED",     progress:.50 } },
      "water-impact":{ preview:{ splash:1,                                        status:"SPLASH",     progress:.66 } },
      retrieve:   { preview:{ retrieve:1,                                         status:"RETRIEVING", progress:.82 } },
      "attention-trigger":{ preview:{ attention:1,                               status:"ALERT",      progress:.95 } },
    },
    edges:[["throw","catch"],["catch","throw"],["throw","miss"],
           ["miss","water-impact"],["water-impact","attention-trigger"],
           ["attention-trigger","retrieve"],["retrieve","throw"]],
  },
  channels:["throw","catch","miss","splash","retrieve","attention","t"],

  preview:()=>({ throw:0, catch:0, miss:0, splash:0, retrieve:0, attention:0, t:0, status:"IN PLAY", progress:.2 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
