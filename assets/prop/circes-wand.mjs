/* prop.circes-wand — Circe's transformation wand, the sorceress's rod.
   PROP asset. A single reusable object: a slender tapering rod topped with an
   ornate faceted gem finial cradled in two little scroll curls above a collar
   ring, with a cord-wrapped grip and a rounded butt. Drawn in SOLID grays +
   hard contour into the offscreen ctx; the engine dotify pass supplies the
   halftone. Do NOT pre-dither.

   Scene function (OD-B10-S06): the transformation tool cycling through
   idle / point / strike / spell-discharge(sparks) / failed-spell(fizzle) /
   restore. The whole wand is drawn along a local axis and rotated about the
   GRIP pivot per state, so grip and contact anchors stay meaningful as it
   moves. The ornate tip is the FX source: a jagged spark burst on discharge,
   a drooping sputter on the failed spell, and gentle concentric restore-rings
   when the swine are turned back to men.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  length:640,      // wand length in source px (fits 660x880 at any angle)
  shaftTopW:14,    // slim thickness at the top (under the collar)
  shaftBotW:26,    // fatter toward the butt (taper)
  gemR:36,         // ornate faceted finial radius
  collarW:44,      // decorative collar ring width
  scrollR:19,      // the two scroll curls cradling the gem
  metal:6,         // base ink level for the dark witch-metal rod
  gem:1,           // bright faceted crown tone (kept light so it glints)
};

/* along-axis station positions, measured from the GRIP pivot.
   negative = toward the ornate top (up), positive = toward the butt (down). */
function stations(){
  const L = params.length;
  const gemS     = -L*0.58;              // center of the gem finial
  const scrollS  = gemS + params.gemR*1.25; // where the scroll curls sit
  const collarS  = scrollS + 22;         // decorative collar ring
  const shaftTop = collarS + 8;          // rod begins below the collar
  const buttS    =  L*0.40;              // rounded shaft foot
  return { L, gemS, scrollS, collarS, shaftTop, buttS };
}

/* per-state pose: rotation about the grip pivot + scene fx flags */
const POSE = {
  idle:      { angle:-0.10, status:"IDLE",      progress:0.15 },
  point:     { angle: 0.52, status:"POINTING",  progress:0.42, focus:true },
  strike:    { angle: 0.86, status:"STRIKE",    progress:0.66, motion:true, impact:true },
  discharge: { angle:-0.04, status:"DISCHARGE", progress:1.00, sparks:true },
  fizzle:    { angle: 0.18, status:"FIZZLE",    progress:0.30, fizzle:true },
  restore:   { angle: 0.00, status:"RESTORE",   progress:0.80, rings:true },
};

function drawWand(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "idle";
  const P = POSE[mode] || POSE.idle;
  const S = stations();
  const pivot = { x:W*0.52, y:H*0.56 };
  const gx = 0, gy = S.gemS;   // FX origin = the gem tip, in wand-local frame

  g.save();
  g.translate(pivot.x, pivot.y);
  g.rotate(P.angle);

  // ================= BACKGROUND FX (behind the rod) =================

  // ---- SPELL DISCHARGE: a bright radiant burst behind the jagged bolts ----
  if (P.sparks){
    // soft luminous discs (light tone = few dots) so the tip reads hot
    for(let i=3;i>=1;i--){
      const rr = params.gemR*(1.1 + i*1.0);
      g.beginPath(); g.arc(gx,gy,rr,0,7);
      g.fillStyle = inkLevel(i<=1?2:1); g.globalAlpha = 0.9; g.fill();
    }
    g.globalAlpha=1;
    // long radiating rays
    g.strokeStyle="rgba(0,0,0,0.32)"; g.lineWidth=2.6; g.lineCap="round";
    const rays=12, rin=params.gemR*1.3, rout=params.gemR*3.4;
    for(let i=0;i<rays;i++){
      const a=(i/rays)*Math.PI*2 + 0.15;
      g.beginPath();
      g.moveTo(gx+Math.cos(a)*rin, gy+Math.sin(a)*rin);
      g.lineTo(gx+Math.cos(a)*rout, gy+Math.sin(a)*rout);
      g.stroke();
    }
  }

  // ---- RESTORE: gentle concentric rings blooming upward (men reformed) ----
  if (P.rings){
    g.strokeStyle="rgba(0,0,0,0.30)"; g.lineCap="round";
    for(let i=1;i<=4;i++){
      const rr = params.gemR*(0.9 + i*0.75);
      g.lineWidth = clamp(4-i,1.4,4);
      g.beginPath(); g.arc(gx,gy,rr,-Math.PI*0.86,-Math.PI*0.14); g.stroke();
    }
    // a few rising motes
    g.fillStyle=inkLevel(4);
    for(let i=0;i<5;i++){
      const a=-Math.PI*0.5 + (i-2)*0.30, r=params.gemR*(2.0+ (i%2)*0.7);
      g.beginPath(); g.arc(gx+Math.cos(a)*r, gy+Math.sin(a)*r, 3.4-(i%2), 0,7); g.fill();
    }
  }

  // ---- STRIKE: motion streaks trailing the descending arc ----
  if (P.motion){
    g.strokeStyle="rgba(0,0,0,0.20)"; g.lineCap="round";
    for(let i=0;i<3;i++){ g.lineWidth=6-i;
      g.beginPath();
      g.arc(0, 0, S.gemS*-1*(0.72+i*0.06), -0.9 - i*0.05, -0.5 - i*0.05);
      g.stroke();
    }
  }

  // ---- POINT: a tight focus glow + a thin directed beam-line off the tip ----
  if (P.focus){
    for(let i=2;i>=1;i--){
      g.beginPath(); g.arc(gx,gy,params.gemR*(0.9+i*0.6),0,7);
      g.fillStyle=inkLevel(i<=1?2:1); g.globalAlpha=0.85; g.fill();
    }
    g.globalAlpha=1;
    g.strokeStyle="rgba(0,0,0,0.28)"; g.lineWidth=2.2; g.lineCap="round";
    g.setLineDash([6,7]);
    g.beginPath(); g.moveTo(gx, gy-params.gemR*1.2); g.lineTo(gx, gy-params.gemR*4.6); g.stroke();
    g.setLineDash([]);
  }

  // ================= THE WAND BODY =================

  // ---- TAPERED ROD (dark witch-metal, drawn first) ----
  const tw=params.shaftTopW, bw=params.shaftBotW, yTop=S.shaftTop, yBot=S.buttS;
  pen.paint(()=>{
    g.moveTo(-tw/2, yTop); g.lineTo(tw/2, yTop);
    g.lineTo(bw/2, yBot);  g.lineTo(-bw/2, yBot); g.closePath();
  }, toneSolid(inkLevel(params.metal)), 5);
  // round the rod: bright left edge, darker right face
  g.fillStyle=inkLevel(2);
  g.beginPath(); g.moveTo(-tw/2+2,yTop+3); g.lineTo(-tw/2+tw*0.34,yTop+3);
  g.lineTo(-bw/2+bw*0.34,yBot-3); g.lineTo(-bw/2+2,yBot-3); g.closePath(); g.fill();
  g.fillStyle=inkLevel(7);
  g.beginPath(); g.moveTo(tw/2-tw*0.30,yTop+3); g.lineTo(tw/2,yTop+3);
  g.lineTo(bw/2,yBot-3); g.lineTo(bw/2-bw*0.30,yBot-3); g.closePath(); g.fill();

  // ---- rounded BUTT cap ----
  pen.paint(()=>{ g.ellipse(0, S.buttS, bw*0.72, bw*0.6, 0,0,7); }, toneSolid(inkLevel(5)), 4);
  g.fillStyle=inkLevel(2); g.beginPath();
  g.arc(-bw*0.22, S.buttS-bw*0.16, bw*0.2, 0,7); g.fill();

  // ---- CORD-WRAPPED GRIP band at the pivot ----
  const gTop=-40, gBot=70, gW=params.shaftBotW*0.5 + params.shaftTopW*0.5 + 10;
  pen.paint(()=>{ g.rect(-gW/2, gTop, gW, gBot-gTop); }, toneSolid(inkLevel(6)), 5);
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  for(let s=gTop+7; s<gBot-3; s+=9){   // cord cross-wrap
    g.beginPath(); g.moveTo(-gW/2, s); g.lineTo(gW/2, s+6); g.stroke();
  }
  // grip end collars
  pen.paint(()=>{ g.rect(-gW/2-2, gTop-4, gW+4, 7); }, toneSolid(inkLevel(5)),3);
  pen.paint(()=>{ g.rect(-gW/2-2, gBot-3, gW+4, 7); }, toneSolid(inkLevel(5)),3);

  // ---- decorative COLLAR RING under the ornament ----
  const cw=params.collarW;
  pen.paint(()=>{ g.rect(-cw/2, S.collarS-6, cw, 14); }, toneSolid(inkLevel(5)), 4);
  g.strokeStyle=INK; g.lineWidth=1.8;
  for(let k=-1;k<=1;k++){ g.beginPath(); g.moveTo(k*cw*0.24, S.collarS-6); g.lineTo(k*cw*0.24, S.collarS+8); g.stroke(); }
  // small neck between collar and gem
  pen.paint(()=>{ g.rect(-params.shaftTopW*0.7, S.scrollS+4, params.shaftTopW*1.4, S.collarS-S.scrollS); },
            toneSolid(inkLevel(params.metal)), 3);

  // ---- two SCROLL CURLS cradling the gem ----
  const drawScroll = (sign)=>{
    const bx = sign*params.shaftTopW*0.6, by = S.scrollS+6;
    const cx = sign*(params.scrollR+params.shaftTopW*0.6), cy = S.scrollS-params.scrollR*0.4;
    pen.limb(()=>{
      g.moveTo(bx, by);
      g.quadraticCurveTo(sign*params.scrollR*1.7, by, cx, cy);
      g.quadraticCurveTo(sign*params.scrollR*1.0, cy-params.scrollR*1.0, cx-sign*params.scrollR*0.5, cy-params.scrollR*0.6);
    }, toneSolid(inkLevel(params.metal)), 6);
    // curl eye
    pen.paint(()=>{ g.arc(cx-sign*params.scrollR*0.5, cy-params.scrollR*0.6, params.scrollR*0.34, 0,7); },
              toneSolid(inkLevel(3)), 3);
  };
  drawScroll(-1); drawScroll(1);

  // ---- ORNATE FACETED GEM finial (the transformation tip) ----
  const gr=params.gemR, gyc=S.gemS;
  // diamond/faceted body (bright crown so the crystal glints)
  pen.paint(()=>{
    g.moveTo(0, gyc-gr*1.30);          // top point
    g.lineTo(gr*0.80, gyc-gr*0.20);    // right shoulder
    g.lineTo(gr*0.42, gyc+gr*0.98);    // right base
    g.lineTo(-gr*0.42, gyc+gr*0.98);   // left base
    g.lineTo(-gr*0.80, gyc-gr*0.20);   // left shoulder
    g.closePath();
  }, toneSolid(inkLevel(params.gem)), 4);
  // just ONE shaded facet on the right for volume (kept mid so gem stays bright)
  g.fillStyle=inkLevel(3);
  g.beginPath(); g.moveTo(gr*0.30,gyc-gr*0.20); g.lineTo(gr*0.80,gyc-gr*0.20); g.lineTo(gr*0.42,gyc+gr*0.98); g.lineTo(0,gyc+gr*0.98); g.closePath(); g.fill();
  // thin facet lines
  g.strokeStyle=INK; g.lineWidth=1.6; g.lineCap="round"; g.lineJoin="round";
  g.beginPath();
  g.moveTo(-gr*0.80, gyc-gr*0.20); g.lineTo(gr*0.80, gyc-gr*0.20);   // girdle
  g.moveTo(0, gyc-gr*1.30); g.lineTo(-gr*0.30, gyc-gr*0.20);
  g.moveTo(0, gyc-gr*1.30); g.lineTo( gr*0.30, gyc-gr*0.20);
  g.moveTo(-gr*0.30, gyc-gr*0.20); g.lineTo(0, gyc+gr*0.98);
  g.moveTo( gr*0.30, gyc-gr*0.20); g.lineTo(0, gyc+gr*0.98);
  g.stroke();

  // ================= FOREGROUND FX (over the tip) =================

  // ---- DISCHARGE: jagged spark bolts leaping off the gem ----
  if (P.sparks){
    g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round"; g.lineJoin="round";
    const bolts=6;
    for(let b=0;b<bolts;b++){
      const a=(b/bolts)*Math.PI*2 + 0.35;
      let px=gx+Math.cos(a)*gr*1.0, py=gy+Math.sin(a)*gr*1.0;
      g.beginPath(); g.moveTo(px,py);
      const segs=3, reach=gr*2.6;
      for(let s=1;s<=segs;s++){
        const rr=gr*1.0 + reach*(s/segs);
        const ja=a + (s%2? 0.28 : -0.28);
        px=gx+Math.cos(ja)*rr; py=gy+Math.sin(ja)*rr;
        g.lineTo(px,py);
      }
      g.stroke();
    }
    // bright sparkle star on the gem
    g.strokeStyle=INK; g.lineWidth=3;
    g.beginPath();
    g.moveTo(gx, gy-gr*1.7); g.lineTo(gx, gy+gr*1.7);
    g.moveTo(gx-gr*1.7, gy); g.lineTo(gx+gr*1.7, gy);
    g.stroke();
  }

  // ---- FAILED SPELL: a weak drooping sputter of smoke wisps + falling dots ----
  if (P.fizzle){
    g.strokeStyle="rgba(0,0,0,0.42)"; g.lineWidth=2.4; g.lineCap="round";
    for(let i=-1;i<=1;i++){
      const ox=gx+i*gr*0.5;
      g.beginPath();
      g.moveTo(ox, gy-gr*0.6);
      g.quadraticCurveTo(ox+gr*0.5, gy-gr*1.3, ox-gr*0.2, gy-gr*1.9);
      g.quadraticCurveTo(ox-gr*0.7, gy-gr*2.3, ox+gr*0.1, gy-gr*2.6);
      g.stroke();
    }
    // little failed embers dribbling down
    g.fillStyle=inkLevel(4);
    for(let i=0;i<4;i++){
      const dx=gx+(i-1.5)*gr*0.4, dy=gy+gr*(0.8+i*0.5);
      g.beginPath(); g.arc(dx,dy, 2.6-(i*0.4), 0,7); g.fill();
    }
  }

  // ---- STRIKE impact spark at the tip ----
  if (P.impact){
    g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
    for(let i=0;i<5;i++){
      const a=-Math.PI*0.5 + (i-2)*0.42;
      g.beginPath();
      g.moveTo(gx+Math.cos(a)*gr*1.1, gy+Math.sin(a)*gr*1.1);
      g.lineTo(gx+Math.cos(a)*gr*2.0, gy+Math.sin(a)*gr*2.0);
      g.stroke();
    }
  }

  g.restore();
}

export const asset = {
  id:"prop.circes-wand",
  type:"PROP",
  name:"Circe's Wand",
  statusWord:"IDLE",
  scene:"OD-B10-S06",

  params,
  // back -> front draw order the module honors
  layers:["fx-back","rod","butt","grip","collar","scrolls","gem","fx-front"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 'idle' pose; the runtime re-derives them under rotation from the pivot).
  anchors:{
    grip:{x:.52,y:.56},            // where Circe's hand takes the shaft (pivot)
    "grip:second":{x:.52,y:.63},    // off-hand hold lower on the rod
    tip:{x:.52,y:.145},            // ornate gem finial — the spell source
    "contact:target":{x:.52,y:.06}, // where the discharged spell lands
    "contact:ground":{x:.52,y:.80}, // rounded butt when set down
    balance:{x:.52,y:.55},         // center of mass (pivot)
  },
  // collision shape: a thin oriented capsule along the rod (asset space)
  collision:{ kind:"capsule", a:{x:.52,y:.14}, b:{x:.52,y:.80}, r:.022 },
  ownership:"circe",               // the sorceress's own transformation rod

  states:{
    initial:"idle",
    nodes:{
      idle:      { preview:{ mode:"idle",      status:"IDLE",      progress:0.15 } },
      point:     { preview:{ mode:"point",     status:"POINTING",  progress:0.42 } },
      strike:    { preview:{ mode:"strike",    status:"STRIKE",    progress:0.66 } },
      discharge: { preview:{ mode:"discharge", status:"DISCHARGE", progress:1.00 } },
      fizzle:    { preview:{ mode:"fizzle",    status:"FIZZLE",    progress:0.30 } },
      restore:   { preview:{ mode:"restore",   status:"RESTORE",   progress:0.80 } },
    },
    edges:[
      ["idle","point"],["point","strike"],["strike","discharge"],
      ["discharge","idle"],
      ["point","fizzle"],["strike","fizzle"],["fizzle","idle"],
      ["idle","restore"],["restore","idle"],["discharge","restore"],
    ],
  },
  channels:["angle","state","t"],

  preview:()=>({ mode:"idle", status:"IDLE", progress:0.15, t:0 }),
  draw(ctx,W,H,state){ drawWand(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
