/* prop.dance-ball — a bright little hand-ball for the dance: the ball the
   Phaeacian youths toss and catch as they dance for their guest, a body kept
   in the air by feet and hands alike. PROP asset.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.

   Kept deliberately LIGHTER and SIMPLER than prop.laundry-ball (that ball is
   a mid-tone stitched two-panel leather sphere with a cross-hatched seam
   girdle). This one is a smooth, bright play-ball: a light body, a bold
   specular crown, a single decorative equator band, no stitching — so at a
   glance the two never read as the same object.

   Scene function (OD-B08-S04): a small reusable object, centred, with motion
   arc hints and four states —
     TOSS             (a straight VERTICAL toss: ball at the apex, an up-and-
                       down dashed plumb arc, rising motion streaks below it),
     PARTNER-ARC      (a lateral hand-to-hand arc between two grips — the ball
                       sailing across from a launching palm to a waiting one),
     BLIND-EXCHANGE   (the show-off pass made without looking: a low behind-
                       the-guard hand-off, a closed-eye "not-watching" glyph,
                       a short dashed pass arc), and
     DROPPED-RECOVERY (the fumble saved: ball low near the floor with a bounce
                       glint, a scooping hand sweeping up under it, ground line).
   Scale, grip / contact / support anchors, ownership and a circular collision
   footprint are declared in 0..1 space. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  cx:0.50,          // ball centre x (fraction of W) — centred
  cy:0.48,          // ball centre y (fraction of H)
  radius:0.120,     // ball radius (fraction of W) — small, hand-sized
  groundY:0.82,     // floor line (fraction of H) for the recovery state
};

// tones — everything a step LIGHTER than the laundry ball's leather
const BODY   = 2;   // bright light ball body
const BELLY  = 3;   // gentle shaded lower-right crescent (volume)
const CROWN  = 1;   // near-paper specular highlight (upper-left)
const BAND   = 4;   // single decorative equator band
const HAND   = 4;   // hand / arm tone
const HAND_D = 5;   // hand shade

/* ------------------------------------------------------------------
   THE BALL — a smooth bright ball centred at (cx,cy) radius r.
   body -> belly shade -> equator band -> crown highlight -> glint. */
function drawBall(pen,g,cx,cy,r){
  // ---- faint ground contact shadow (drawn soft, never competes) ----
  g.fillStyle="rgba(0,0,0,0.06)";
  g.beginPath(); g.ellipse(cx, cy+r*1.08, r*0.82, r*0.17, 0,0,7); g.fill();

  // ---- BODY: the bright sphere (light tone) ----
  pen.paint(()=>{ g.arc(cx, cy, r, 0, 7); }, toneSolid(inkLevel(BODY)), 5);

  // ---- BELLY shade: a soft darker crescent hugging the lower-right rim ----
  pen.fillPath(()=>{
    g.arc(cx, cy, r*0.99, Math.PI*0.08, Math.PI*0.82);                    // outer bottom-right
    g.arc(cx-r*0.22, cy-r*0.24, r*0.92, Math.PI*0.82, Math.PI*0.08, true);// inner, reversed
    g.closePath();
  }, inkLevel(BELLY));

  // ---- DECORATIVE EQUATOR BAND: one girdle stripe (the play-ball marking) ----
  //  drawn as the sliver between two equatorial ellipses, clipped to the disc.
  g.save();
  g.beginPath(); g.arc(cx, cy, r*0.995, 0, 7); g.clip();
  pen.fillPath(()=>{
    g.ellipse(cx, cy, r*1.02, r*0.30, 0, 0, Math.PI);           // lower edge of band
    g.ellipse(cx, cy, r*1.02, r*0.14, 0, Math.PI, 0, true);     // upper edge of band
    g.closePath();
  }, inkLevel(BAND));
  g.restore();
  // band contour edges so the stripe reads crisply over the sphere
  pen.ink(()=>{ g.ellipse(cx, cy, r*0.985, r*0.30, 0, 0.06, Math.PI-0.06); }, 2.6);
  pen.ink(()=>{ g.ellipse(cx, cy, r*0.985, r*0.14, 0, 0.06, Math.PI-0.06); }, 2.6);

  // ---- CROWN highlight: a bright upper-left specular crescent ----
  pen.fillPath(()=>{ g.ellipse(cx-r*0.34, cy-r*0.36, r*0.40, r*0.28, -0.7, 0,7); }, inkLevel(CROWN));

  // ---- tiny glint ring: a small bright open ring = "shiny/bright" tell ----
  g.strokeStyle=inkLevel(CROWN); g.lineWidth=Math.max(2,r*0.10); g.lineCap="round";
  g.beginPath(); g.arc(cx-r*0.36, cy-r*0.40, r*0.12, Math.PI*0.15, Math.PI*1.55); g.stroke();

  return { cx, cy, r, top:{x:cx,y:cy-r}, bottom:{x:cx,y:cy+r} };
}

/* a small open reaching / cupping hand at (px,py), splay direction `dir`
   in radians, palm radius pr. Draws palm + a few fingers + wrist stub. */
function drawHand(pen,g,px,py,dir,pr,wristAng){
  pen.paint(()=>{ g.ellipse(px, py, pr, pr*0.74, dir, 0, 7); }, toneSolid(inkLevel(HAND)), 4);
  for(let f=-2;f<=2;f++){
    const a = dir + f*0.34;
    pen.limb(()=>{ g.moveTo(px, py); g.lineTo(px+Math.cos(a)*pr*1.35, py+Math.sin(a)*pr*1.35); },
             toneSolid(inkLevel(HAND)), pr*0.28);
  }
  // wrist trailing out of frame
  const wa = wristAng ?? (dir+Math.PI);
  pen.limb(()=>{ g.moveTo(px, py); g.lineTo(px+Math.cos(wa)*pr*2.1, py+Math.sin(wa)*pr*2.1); },
           toneSolid(inkLevel(HAND_D)), pr*0.72);
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const toss = st.toss     ?? 0;   // vertical toss
  const parc = st.partner  ?? 0;   // partner arc
  const bex  = st.blind    ?? 0;   // blind exchange
  const drop = st.dropped  ?? 0;   // dropped-recovery
  const t    = st.t        ?? 0;

  const r  = W*params.radius;
  const groundY = H*params.groundY;

  // ---- resolve ball position per active state ----
  let bx = W*params.cx, by = H*params.cy;
  if (toss>0.02){ by = H*0.44 - Math.sin(t*2)*r*0.06; }        // near the apex, centred
  else if (parc>0.02){ by = H*0.40; }                          // mid, sailing across
  else if (bex>0.02){ bx = W*0.50; by = H*0.62; }              // low, behind the guard
  else if (drop>0.02){ bx = W*0.42; by = groundY - r*0.92; }   // near the floor

  // ================= MOTION ARC HINTS =================
  // VERTICAL TOSS: a plumb up-and-down dashed arc through the ball ----------
  if (toss>0.02){
    g.save();
    // a compact dashed apex lens just above the ball (peak of the toss)
    g.strokeStyle=ACCENT; g.globalAlpha=0.55; g.lineWidth=2.5;
    g.setLineDash([8,7]); g.lineCap="round";
    g.beginPath();
    g.moveTo(bx-r*0.9, by-r*1.35);
    g.quadraticCurveTo(bx, by-r*2.35, bx+r*0.9, by-r*1.35);
    g.stroke();
    g.setLineDash([]);
    // compact vertical double-headed arrow to the ball's left = plumb travel
    const ax=bx-r*1.7, ayT=by-r*1.6, ayB=by+r*1.6;
    g.globalAlpha=0.85; g.lineWidth=2.5;
    g.beginPath();
    g.moveTo(ax, ayT); g.lineTo(ax, ayB);                       // shaft
    g.moveTo(ax, ayT); g.lineTo(ax-r*0.16, ayT+r*0.30);         // up head
    g.moveTo(ax, ayT); g.lineTo(ax+r*0.16, ayT+r*0.30);
    g.moveTo(ax, ayB); g.lineTo(ax-r*0.16, ayB-r*0.30);         // down head
    g.moveTo(ax, ayB); g.lineTo(ax+r*0.16, ayB-r*0.30);
    g.stroke();
    g.restore();
    // short rising motion streaks just below the ball
    g.strokeStyle=INK; g.lineWidth=2.5; g.lineCap="round"; g.globalAlpha=0.5;
    for(let i=0;i<3;i++){ const xx=bx+(i-1)*r*0.5;
      g.beginPath(); g.moveTo(xx, by+r*1.15); g.lineTo(xx, by+r*1.15+r*0.5+(i%2)*r*0.15); g.stroke(); }
    g.globalAlpha=1;
  }

  // PARTNER ARC: a lateral hand-to-hand parabola across the stage -----------
  if (parc>0.02){
    const lx=W*0.16, ly=H*0.58, rx2=W*0.84, ry2=H*0.58;
    g.save();
    g.strokeStyle=ACCENT; g.globalAlpha=0.55; g.lineWidth=2.5;
    g.setLineDash([9,8]); g.lineCap="round";
    g.beginPath(); g.moveTo(lx, ly); g.quadraticCurveTo(bx, by-r*1.7, rx2, ry2); g.stroke();
    g.setLineDash([]);
    // travel arrow at the receiving (right) end
    g.globalAlpha=0.85;
    g.beginPath();
    g.moveTo(rx2, ry2); g.lineTo(rx2-r*0.5, ry2-r*0.28);
    g.moveTo(rx2, ry2); g.lineTo(rx2-r*0.44, ry2+r*0.18);
    g.stroke();
    g.restore();
    // launching (left) and waiting (right) hands at the grips
    drawHand(pen,g, lx, ly+r*0.2, -0.5, r*0.42, Math.PI*0.75);
    drawHand(pen,g, rx2, ry2+r*0.2, Math.PI+0.5, r*0.42, Math.PI*0.25);
  }

  // BLIND EXCHANGE: low behind-the-guard hand-off + not-watching glyph ------
  if (bex>0.02){
    // two hands meeting low from either side of the ball
    drawHand(pen,g, bx-r*1.35, by+r*0.35, -0.25, r*0.40, Math.PI*0.85);   // giving
    drawHand(pen,g, bx+r*1.35, by+r*0.35, Math.PI+0.25, r*0.40, Math.PI*0.15); // taking
    // short dashed pass arc between the two palms, dipping under the guard
    g.save();
    g.strokeStyle=ACCENT; g.globalAlpha=0.6; g.lineWidth=2.5;
    g.setLineDash([6,6]); g.lineCap="round";
    g.beginPath();
    g.moveTo(bx-r*0.95, by+r*0.1);
    g.quadraticCurveTo(bx, by-r*0.9, bx+r*0.95, by+r*0.1);
    g.stroke();
    g.setLineDash([]); g.restore();
    // the "not looking" glyph up top: a closed downcast eye (arc, no pupil) + slash
    g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
    const ex=bx, ey=H*0.24;
    g.beginPath(); g.arc(ex, ey, r*0.5, Math.PI*0.15, Math.PI*0.85); g.stroke();  // downcast lid
    for(let l=-1;l<=1;l++){ g.beginPath(); // lashes
      g.moveTo(ex+l*r*0.28, ey+r*0.5); g.lineTo(ex+l*r*0.28, ey+r*0.72); g.stroke(); }
    g.strokeStyle=ACCENT; g.lineWidth=3;
    g.beginPath(); g.moveTo(ex-r*0.6, ey+r*0.7); g.lineTo(ex+r*0.6, ey-r*0.5); g.stroke(); // slash
  }

  // DROPPED-RECOVERY: floor, bounce glint, scooping hand -------------------
  if (drop>0.02){
    // floor line
    pen.ink(()=>{ g.moveTo(0, groundY); g.lineTo(W, groundY); }, 3);
    g.strokeStyle=inkLevel(2); g.lineWidth=2; g.lineCap="round";
    for(let i=1;i<=2;i++){ const yy=groundY+(H-groundY)*(i/3);
      g.beginPath(); g.moveTo(W*0.1, yy); g.lineTo(W*0.9, yy); g.stroke(); }
    // bounce glint under the ball: a small dashed hop arc + impact ticks
    g.save();
    g.strokeStyle=ACCENT; g.globalAlpha=0.55; g.lineWidth=2.5;
    g.setLineDash([7,7]); g.lineCap="round";
    g.beginPath();
    g.moveTo(bx-r*1.4, groundY-2);
    g.quadraticCurveTo(bx-r*0.7, groundY-r*1.3, bx, by+r*0.9);
    g.stroke();
    g.setLineDash([]); g.restore();
    // impact ticks where the ball kissed the floor
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round"; g.globalAlpha=0.7;
    for(let k=-1;k<=1;k++){ const a=-Math.PI*0.5+k*0.4;
      g.beginPath();
      g.moveTo(bx-r*1.0+Math.cos(a)*r*0.1, groundY-r*0.05+Math.sin(a)*r*0.1);
      g.lineTo(bx-r*1.0+Math.cos(a)*r*0.35, groundY-r*0.05+Math.sin(a)*r*0.35);
      g.stroke(); }
    g.globalAlpha=1;
  }

  // ================= THE BALL (drawn last, on top of hands/arcs) =========
  drawBall(pen,g,bx,by,r);

  // scooping hand of the recovery reaches UP over the ball's underside ------
  if (drop>0.02){
    const px=bx-r*0.05, py=by+r*0.95;
    pen.paint(()=>{ g.ellipse(px, py, r*0.5, r*0.32, 0, 0, 7); }, toneSolid(inkLevel(HAND)), 4);
    for(let f=-2;f<=2;f++){ const fx=px+f*r*0.24;
      pen.limb(()=>{ g.moveTo(fx, py); g.lineTo(fx-f*r*0.05, py-r*0.34); }, toneSolid(inkLevel(HAND)), r*0.13); }
    pen.limb(()=>{ g.moveTo(px, py+r*0.1); g.lineTo(px+r*0.6, groundY+r*0.4); }, toneSolid(inkLevel(HAND_D)), r*0.42);
  }
}

export const asset = {
  id:"prop.dance-ball",
  type:"PROP",
  name:"Dance Ball",
  statusWord:"IN PLAY",
  scene:"OD-B08-S04",

  params,
  // back -> front draw order the prop honors
  layers:["floor","arc","hands","ball","glint","overhand"],
  // normalized 0..1 anchors: grip / contact / support / centre / motion
  anchors:{
    "centre":{x:.50,y:.48},           // ball centre
    "grip:overhand":{x:.50,y:.36},    // hand over the top to toss
    "grip:underhand":{x:.50,y:.60},   // cupped contact underneath (catch)
    "contact:left":{x:.16,y:.60},     // left palm (partner launch)
    "contact:right":{x:.84,y:.60},    // right palm (partner receive)
    "apex:toss":{x:.50,y:.30},        // top of the vertical toss
    "floor:contact":{x:.42,y:.82},    // recovery bounce point on the floor
  },
  // collision shape: the ball's circular footprint as an AABB (0..1)
  zones:{ bounds:{ x0:.38,y0:.36,x1:.62,y1:.60 }, footprint:{ x0:.38,y0:.58,x1:.62,y1:.62 } },
  // ownership: kept aloft by the two Phaeacian dancers, shared in the round
  ownership:{ owner:"phaeacian-dancers", shared:["halius","laodamas"] },
  states:{
    initial:"toss",
    nodes:{
      toss:              { preview:{ toss:1,    status:"TOSSED",     progress:.20 } },
      "partner-arc":     { preview:{ partner:1, status:"CROSSING",   progress:.45 } },
      "blind-exchange":  { preview:{ blind:1,   status:"BLIND PASS", progress:.70 } },
      "dropped-recovery":{ preview:{ dropped:1, status:"RECOVERED",  progress:.92 } },
    },
    edges:[["toss","partner-arc"],["partner-arc","blind-exchange"],
           ["blind-exchange","toss"],["partner-arc","dropped-recovery"],
           ["dropped-recovery","toss"]],
  },
  channels:["toss","partner","blind","dropped","t"],

  preview:()=>({ toss:1, partner:0, blind:0, dropped:0, t:0, status:"IN PLAY", progress:.2 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
