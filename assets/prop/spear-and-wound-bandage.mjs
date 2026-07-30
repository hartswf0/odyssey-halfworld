/* prop.spear-and-wound-bandage — the Parnassus hunting kit of Book XIX.
   The boy Odysseus goes up the wooded slope with Autolycus's sons; the boar
   comes out of its thicket first and drives its tusk above his knee, and he
   drives the long spear through its right shoulder. The sons "bound up the
   wound of noble godlike Odysseus skilfully, and checked the dark blood with a
   chant." What is left is the scar Eurycleia's hands will find twenty years
   later — so this prop is not decoration: it is the manufacture of the mark.

   PROP asset. ONE reusable object made of two parts that belong to one event —
   the ash hunting spear (leaf head, socketed collar, thong lashings, plain
   wood butt: a hunter's weapon, not a warrior's sauroter-spear) and the linen
   binding strip. Drawn as a field-surgery inspection plate: the weapon under
   registration on the left, and on the right a magnified callout, the thigh
   elevation carrying the wound through its whole life, the binding strip as
   its own object, and a five-step state ledger drawn as GEOMETRY (no type).

   Solid grays + hard contour into the offscreen ctx; the engine dotify pass
   supplies the halftone. Do NOT pre-dither.

   States (the five the scene asks for):
     · strike  — spear driven, motion chevrons, head clean, the tusk gash just
                 opened on the thigh; the binding still rolled and dormant.
     · blood   — runnels down the blade, drip beads under the socket, the gash
                 running; the roll paying out its first length.
     · wrap    — spear grounded; three turns of linen laid across the thigh
                 with paper showing between them; the strip serpentine, in use.
     · tighten — four close turns, the knot set on the outer thigh, tension
                 chevrons hauling from both sides; the strip drawn taut.
     · scar-forming — the binding off and stained, the thigh bare, the closed
                 seam and its stitch ticks: the permanent, addressable mark.
   Grip / contact / tie / mark anchors in 0..1; ownership + collision capsule. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  shaftRatio:0.030,   // shaft width as a fraction of spear length
  headRatio:0.200,    // leaf-head length as a fraction of spear length
  headHalfW:0.048,    // leaf half-width as a fraction of spear length
  gripFrom:0.585,     // thong grip start along the shaft (0 tip .. 1 butt)
  gripTo:0.735,
  wrapTurns:3,        // turns of linen in the `wrap` state
  tightTurns:4,       // turns once it is hauled closed
  rimTicks:24,        // measure ticks around the magnified callout
  ledgerSteps:5,      // strike / blood / wrap / tighten / scar
  ruleTicks:9,        // divisions on the declared-scale rule
};

/* ink levels — 0 is paper, 7 is full ink. The plate stays LIGHT: ash and skin
   sit at 1–2, and 5–7 is spent only on the accents the story needs (lashing,
   blood, the open wound, the active ledger chip). */
const ASH     = 2;   // ash shaft
const ASH_HI  = 1;   // lit edge of the pole
const ASH_SH  = 4;   // shaded edge of the pole
const BRONZE  = 4;   // the leaf head
const BRZ_HI  = 1;   // blade highlight facet
const BRZ_SH  = 6;   // blade shadow facet
const LASH    = 5;   // leather thong bindings — a small dark accent
const SKIN    = 1;   // the thigh: almost paper, carried by contour
const SKIN_SH = 2;   // one facet of shade so the limb is not empty
const FLESH   = 6;   // the open gash
const BLOOD   = 7;   // blood: the darkest thing on the plate, and the smallest
const CLOTH   = 2;   // linen
const CLOTH2  = 3;   // the alternating turn / the doubled edge
const STAIN   = 6;   // dried blood in the used strip
const PLATE   = 1;   // callout face

/* ---------- small path helpers ---------- */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}
/* a rounded bar from (x0,y0) to (x1,y1) of thickness w */
function bar(pen,g,x0,y0,x1,y1,w,tone,lw=3.0){
  const a=Math.atan2(y1-y0,x1-x0), L=Math.hypot(x1-x0,y1-y0);
  g.save(); g.translate(x0,y0); g.rotate(a);
  pen.paint(()=>{ rr(g,0,-w/2,L,w,w*0.42); }, tone, lw);
  g.restore();
}
/* the same bar, woven: cross ticks along its length so linen never reads flat */
function wovenBar(pen,g,x0,y0,x1,y1,w,level,ticks=4,lw=3.2){
  const a=Math.atan2(y1-y0,x1-x0), L=Math.hypot(x1-x0,y1-y0);
  g.save(); g.translate(x0,y0); g.rotate(a);
  pen.paint(()=>{ rr(g,0,-w/2,L,w,w*0.40); }, toneSolid(inkLevel(level)), lw);
  g.strokeStyle=INK; g.lineWidth=1.8; g.lineCap="round";
  for(let i=1;i<=ticks;i++){ const x=L*i/(ticks+1);
    g.beginPath(); g.moveTo(x,-w*0.30); g.lineTo(x+w*0.18,w*0.30); g.stroke(); }
  g.restore();
}
/* a ribbon polygon along a sampled centreline — the binding as a free object */
function ribbon(pen,g,pts,w,level,ticks=true){
  const N=pts.length;
  const nrm=i=>{ const a=pts[Math.max(0,i-1)], b=pts[Math.min(N-1,i+1)];
    const dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1; return {x:-dy/L,y:dx/L}; };
  pen.paint(()=>{
    for(let i=0;i<N;i++){ const n=nrm(i), hw=w*0.5*(pts[i].k??1);
      const x=pts[i].x+n.x*hw, y=pts[i].y+n.y*hw; i?g.lineTo(x,y):g.moveTo(x,y); }
    for(let i=N-1;i>=0;i--){ const n=nrm(i), hw=w*0.5*(pts[i].k??1);
      g.lineTo(pts[i].x-n.x*hw, pts[i].y-n.y*hw); }
    g.closePath();
  }, toneSolid(inkLevel(level)), 3.6);
  if(ticks){ g.strokeStyle=INK; g.lineWidth=1.8; g.lineCap="round";
    for(let i=2;i<N-2;i+=3){ const n=nrm(i), hw=w*0.42*(pts[i].k??1);
      g.beginPath(); g.moveTo(pts[i].x-n.x*hw,pts[i].y-n.y*hw);
      g.lineTo(pts[i].x+n.x*hw,pts[i].y+n.y*hw); g.stroke(); } }
}

/* ==================================================================
   THE SPEAR — drawn along its own axis so grip and contact anchors keep
   meaning at any lie. Local frame: tip at (0,0), s increasing toward butt.
   ================================================================== */
function leafHead(pen,g,hl,hw,w,{blood=false,lw=4.4}={}){
  const mid=hl*0.44;
  const path=()=>{ g.moveTo(0,0);
    g.quadraticCurveTo(hw,mid, w/2+2,hl);
    g.lineTo(-w/2-2,hl);
    g.quadraticCurveTo(-hw,mid, 0,0); };
  pen.paint(path, toneSolid(inkLevel(BRONZE)), lw);
  g.save(); g.beginPath(); path(); g.clip();
  g.fillStyle=inkLevel(BRZ_HI);                      // lit blade face
  g.beginPath(); g.moveTo(0,hl*0.05);
  g.quadraticCurveTo(-hw*0.70,mid,-1,hl-3); g.lineTo(-hw*0.98,mid); g.closePath(); g.fill();
  g.fillStyle=inkLevel(BRZ_SH);                      // shadowed blade face
  g.beginPath(); g.moveTo(w/2,hl);
  g.quadraticCurveTo(hw*0.88,mid,1,hl*0.09); g.lineTo(hw,mid); g.closePath(); g.fill();
  if(blood){          // two thin runnels toward the socket — the blade must
    g.strokeStyle=inkLevel(BLOOD); g.lineCap="round";   // stay a readable leaf
    for(let i=0;i<2;i++){ const off=(-0.45+i*0.95)*hw*0.55;
      g.lineWidth=Math.max(2.0, hl*0.020-i*0.5); g.beginPath();
      g.moveTo(off*0.30, hl*(0.16+i*0.07));
      g.quadraticCurveTo(off*1.05, hl*0.58, off*0.50, hl*0.99); g.stroke(); }
  }
  g.restore();
  pen.ink(()=>{ g.moveTo(0,hl*0.07); g.lineTo(0,hl-4); }, Math.max(2.2,lw*0.62)); // midrib
}
function socket(pen,g,s0,w,h,lw=3.6){
  pen.paint(()=>{ rr(g,-(w*1.55)/2,s0,w*1.55,h,w*0.24); }, toneSolid(inkLevel(BRONZE+1)), lw);
  pen.seam(()=>{ g.moveTo(-w*0.70,s0+h*0.52); g.lineTo(w*0.70,s0+h*0.52); }, Math.max(1.4,lw*0.42));
}
function lashing(pen,g,s0,s1,w,lw=3.2){
  const lw2=w+5;
  pen.paint(()=>{ rr(g,-lw2/2,s0,lw2,s1-s0,lw2*0.20); }, toneSolid(inkLevel(LASH)), lw);
  g.strokeStyle=inkLevel(0); g.lineWidth=Math.max(1.8,lw*0.55); g.lineCap="round";
  const n=Math.max(3,Math.round((s1-s0)/(lw2*0.66)));
  for(let i=0;i<n;i++){ const s=s0+(i+0.5)*(s1-s0)/n;
    g.beginPath(); g.moveTo(-lw2/2,s); g.lineTo(lw2/2,s+lw2*0.36); g.stroke(); }
}
function spear(pen,g,tip,butt,{blood=false,motion=false}={}){
  const dx=butt.x-tip.x, dy=butt.y-tip.y, L=Math.hypot(dx,dy);
  const ang=Math.atan2(dy,dx)-Math.PI/2;
  const w=L*params.shaftRatio, hl=L*params.headRatio, hw=L*params.headHalfW;
  const toScreen=(u,s)=>({ x:tip.x+u*Math.cos(ang)-s*Math.sin(ang),
                           y:tip.y+u*Math.sin(ang)+s*Math.cos(ang) });
  g.save(); g.translate(tip.x,tip.y); g.rotate(ang);

  if(motion){                                   // thrust chevrons trailing the head
    g.strokeStyle=inkLevel(4); g.lineCap="round";
    for(let i=0;i<3;i++){ const s=hl*0.62+i*L*0.062, k=hw*(1.30-i*0.16);
      g.lineWidth=4.2-i*0.8; g.beginPath();
      g.moveTo(-k, s+L*0.052); g.lineTo(0, s); g.lineTo(k, s+L*0.052); g.stroke(); }
  }
  // ---- ash shaft ----
  const sh0=hl*0.92, sh1=L*0.960;
  pen.paint(()=>{ rr(g,-w/2,sh0,w,sh1-sh0,w*0.34); }, toneSolid(inkLevel(ASH)), 4.6);
  g.fillStyle=inkLevel(ASH_HI); g.fillRect(-w/2+3, sh0+8, w*0.20, (sh1-sh0)-18);
  g.fillStyle=inkLevel(ASH_SH); g.fillRect(w/2-w*0.26, sh0+8, w*0.24, (sh1-sh0)-18);
  // ---- plain wood butt (a hunter's spear: no bronze sauroter) ----
  pen.paint(()=>{ rr(g,-(w+5)/2, L*0.930, w+5, L*0.062, w*0.32); }, toneSolid(inkLevel(3)), 3.6);
  pen.seam(()=>{ g.moveTo(-(w+5)/2, L*0.946); g.lineTo((w+5)/2, L*0.946); }, 1.8);
  // ---- leaf head, socketed collar, thong bindings ----
  leafHead(pen,g,hl,hw,w,{blood,lw:4.6});
  socket(pen,g,hl-5,w,L*0.034,3.8);
  lashing(pen,g,hl+L*0.034, hl+L*0.076, w, 3.2);
  lashing(pen,g,L*params.gripFrom, L*params.gripTo, w, 3.4);
  g.restore();

  // ---- blood leaves the rotated frame and falls straight down ----
  if(blood){
    const p=toScreen(0, hl+L*0.055), s=L*0.055;
    for(let i=0;i<3;i++){
      const bx=p.x+(-0.5+i*0.5)*s*0.9, by=p.y+s*(0.85+i*1.15);
      pen.fillPath(()=>{ g.moveTo(bx,by-s*0.34);
        g.quadraticCurveTo(bx+s*0.20, by+s*0.12, bx, by+s*0.26);
        g.quadraticCurveTo(bx-s*0.20, by+s*0.12, bx, by-s*0.34); }, inkLevel(BLOOD));
    }
  }
  return { tip:toScreen(0,0), head:toScreen(0,hl*0.42), socket:toScreen(0,hl+L*0.05),
           grip:toScreen(0,L*(params.gripFrom+params.gripTo)/2), butt:toScreen(0,L*0.985) };
}

/* ==================================================================
   THE THIGH ELEVATION — one limb carrying the wound through five states.
   Nothing in it spans the plate: every band stops inside the limb.
   ================================================================== */
const KNEE_U = 0.70;                       // where the knee sits down the limb
function limbPath(g,cx,y0,y1,hwTop,hwKnee){
  const H=y1-y0, kY=y0+H*KNEE_U, shW=hwKnee*0.70;
  g.moveTo(cx-hwTop*0.96, y0+H*0.06);
  g.bezierCurveTo(cx-hwTop*1.12, y0+H*0.30, cx-hwKnee*1.16, y0+H*0.54,
                  cx-hwKnee*1.02, kY-H*0.085);                 // outer thigh, bulged
  g.quadraticCurveTo(cx-hwKnee*1.22, kY+H*0.045, cx-shW*1.04, kY+H*0.115); // knee knob
  g.bezierCurveTo(cx-shW*0.98, y0+H*0.87, cx-shW*0.92, y0+H*0.95, cx-shW*0.88, y1);
  g.lineTo(cx+shW*0.80, y1-H*0.022);                            // oblique cut, not a bar
  g.bezierCurveTo(cx+shW*0.94, y0+H*0.93, cx+shW*1.02, y0+H*0.85, cx+shW*1.08, kY+H*0.115);
  g.quadraticCurveTo(cx+hwKnee*1.24, kY+H*0.040, cx+hwKnee*1.06, kY-H*0.090);
  g.bezierCurveTo(cx+hwKnee*1.18, y0+H*0.52, cx+hwTop*1.14, y0+H*0.28,
                  cx+hwTop*0.98, y0+H*0.05);
  g.lineTo(cx+hwTop*0.46, y0);
  g.lineTo(cx-hwTop*0.66, y0+H*0.04);
  g.closePath();
}
const hwAt=(u,hwTop,hwKnee)=>
  hwTop+(hwKnee-hwTop)*Math.pow(clamp(u/KNEE_U,0,1),1.10);

function gash(pen,g,x,y,len,open){
  g.save(); g.translate(x,y); g.rotate(-0.55);
  pen.paint(()=>{ g.moveTo(-len/2,0); g.quadraticCurveTo(0,-open, len/2,0);
                  g.quadraticCurveTo(0, open, -len/2,0); }, toneSolid(inkLevel(FLESH)), 3.8);
  pen.ink(()=>{ g.moveTo(-len*0.40,0); g.lineTo(len*0.40,0); }, 2.4);
  for(let i=0;i<4;i++){ const u=-0.32+i*0.22;      // torn edges
    pen.ink(()=>{ g.moveTo(u*len,-open*0.50); g.lineTo(u*len+len*0.05,-open*1.55); }, 2.2);
    pen.ink(()=>{ g.moveTo(u*len+len*0.03, open*0.50); g.lineTo(u*len+len*0.08, open*1.45); }, 2.0); }
  g.restore();
}
function scarLine(pen,g,x,y,len,{ticks=true,lw=3.6}={}){
  g.save(); g.translate(x,y); g.rotate(-0.55);
  pen.paint(()=>{ g.moveTo(-len/2,0); g.quadraticCurveTo(0,-len*0.11, len/2,0);
                  g.quadraticCurveTo(0, len*0.11, -len/2,0); }, toneSolid(inkLevel(SKIN_SH)), 3.0);
  pen.ink(()=>{ g.moveTo(-len*0.46,0); g.quadraticCurveTo(0,-len*0.045,len*0.46,0); }, lw);
  if(ticks) for(let i=0;i<6;i++){ const u=-0.38+i*0.152;
    pen.ink(()=>{ g.moveTo(u*len,-len*0.082); g.lineTo(u*len+len*0.022, len*0.082); }, 2.4); }
  g.restore();
}
function runnels(pen,g,x,y,h,n){
  g.strokeStyle=inkLevel(BLOOD); g.lineCap="round"; g.fillStyle=inkLevel(BLOOD);
  for(let i=0;i<n;i++){ const x0=x+(-0.4+i*0.4)*h*0.10;
    g.lineWidth=Math.max(2.4, h*0.022-i*0.5); g.beginPath();
    g.moveTo(x0, y+h*0.02);
    g.quadraticCurveTo(x0+h*0.035, y+h*0.20, x0-h*0.012, y+h*0.40); g.stroke();
    g.beginPath(); g.ellipse(x0-h*0.012, y+h*0.425, h*0.016, h*0.024,0,0,7); g.fill(); }
}
/* the knot, blocky and diagrammatic: two tails out of each corner, one clear
   crossing, and the bight body on top. Legible from 30px to 300px. */
function knot(pen,g,cx,cy,r){
  const tw=r*0.62;
  // the UNDER strand: lower-left to upper-right, drawn first
  wovenBar(pen,g, cx-r*2.05,cy+r*1.15, cx+r*2.05,cy-r*1.15, tw, CLOTH, 3, 3.0);
  // the OVER strand: upper-left to lower-right, crosses on top
  wovenBar(pen,g, cx-r*2.05,cy-r*1.15, cx+r*2.05,cy+r*1.15, tw, CLOTH2, 3, 3.0);
  // the bight — a rounded block of gathered cloth over the crossing
  pen.paint(()=>{ rr(g,cx-r*0.80,cy-r*0.72,r*1.60,r*1.44,r*0.44); },
    toneSolid(inkLevel(CLOTH)), 3.8);
  pen.seam(()=>{ g.moveTo(cx-r*0.52,cy-r*0.34); g.quadraticCurveTo(cx,cy,cx+r*0.52,cy+r*0.34); }, 2.6);
  pen.seam(()=>{ g.moveTo(cx-r*0.44,cy+r*0.40); g.quadraticCurveTo(cx,cy+r*0.04,cx+r*0.46,cy-r*0.28); }, 1.8);
  // the pulled loop rising out of the top of the bight
  pen.paint(()=>{ g.moveTo(cx-r*0.52,cy-r*0.62);
    g.bezierCurveTo(cx-r*0.98,cy-r*1.48, cx+r*0.86,cy-r*1.52, cx+r*0.44,cy-r*0.64);
    g.lineTo(cx+r*0.12,cy-r*0.68);
    g.bezierCurveTo(cx+r*0.44,cy-r*1.12, cx-r*0.58,cy-r*1.10, cx-r*0.20,cy-r*0.64);
    g.closePath(); }, toneSolid(inkLevel(CLOTH2)), 3.2);
}
/* haul arrows: solid diminishing heads pointing at the binding, so the pull
   reads as geometry rather than as three faint ticks */
function tension(pen,g,x,y,span,dir){
  for(let i=0;i<3;i++){
    const s=span*(1-i*0.22), cx=x+dir*i*span*0.46;
    pen.paint(()=>{ g.moveTo(cx, y);
      g.lineTo(cx-dir*s*0.52, y-s*0.34);
      g.lineTo(cx-dir*s*0.40, y);
      g.lineTo(cx-dir*s*0.52, y+s*0.34); g.closePath(); },
      toneSolid(inkLevel(i?4:6)), 2.4);
  }
}
/* a registration crosshair over a declared anchor point */
function anchorMark(pen,g,x,y,r){
  pen.paint(()=>{ g.ellipse(x,y,r,r,0,0,7); }, toneSolid(inkLevel(0)), 3.0);
  pen.ink(()=>{ g.moveTo(x-r*1.55,y); g.lineTo(x+r*1.55,y);
                g.moveTo(x,y-r*1.55); g.lineTo(x,y+r*1.55); }, 2.4);
}
function dashTo(pen,g,x0,y0,x1,y1,seg){
  const n=Math.max(2,Math.round(Math.hypot(x1-x0,y1-y0)/seg));
  for(let i=0;i<n;i+=2){ const a=i/n, b=Math.min(1,(i+1)/n);
    pen.ink(()=>{ g.moveTo(lerp(x0,x1,a),lerp(y0,y1,a));
                  g.lineTo(lerp(x0,x1,b),lerp(y0,y1,b)); }, 1.8); }
}
function thigh(pen,g,cx,y0,y1,hwTop,hwKnee,mode){
  const H=y1-y0, kY=y0+H*KNEE_U;
  const bound = (mode==="wrap"||mode==="tighten");
  // ---- the limb: almost paper, carried by contour ----
  pen.paint(()=>{ limbPath(g,cx,y0,y1,hwTop,hwKnee); }, toneSolid(inkLevel(SKIN)), 5);
  // one narrow shaded facet down the outer edge — only where cloth won't cover
  if(!bound) pen.paint(()=>{ g.moveTo(cx+hwTop*0.56,y0+H*0.07);
    g.bezierCurveTo(cx+hwKnee*1.00,y0+H*0.34, cx+hwKnee*0.86,y0+H*0.54, cx+hwKnee*0.80,kY-H*0.10);
    g.lineTo(cx+hwKnee*1.02,kY-H*0.09);
    g.bezierCurveTo(cx+hwKnee*1.16,y0+H*0.52, cx+hwTop*1.12,y0+H*0.28, cx+hwTop*0.97,y0+H*0.06);
    g.closePath(); }, toneSolid(inkLevel(SKIN_SH)), 2.4);
  pen.seam(()=>{ g.moveTo(cx-hwTop*0.34,y0+H*0.14);           // long muscle line
    g.quadraticCurveTo(cx-hwTop*0.12,y0+H*0.44, cx-hwKnee*0.36,kY-H*0.06); }, 2.4);
  pen.paint(()=>{ g.ellipse(cx,kY+H*0.030,hwKnee*0.78,H*0.062,0,0,7); },  // knee cap
    toneSolid(inkLevel(SKIN_SH)), 3.0);
  pen.seam(()=>{ g.moveTo(cx-hwKnee*0.62,kY+H*0.088);         // shin start
    g.quadraticCurveTo(cx,kY+H*0.118, cx+hwKnee*0.56,kY+H*0.086); }, 1.8);

  const wy = y0+H*0.28, wx = cx+hwTop*0.30, wl = hwTop*1.30;

  if(mode==="strike"){ gash(pen,g,wx,wy,wl,hwTop*0.30); }
  else if(mode==="blood"){ gash(pen,g,wx,wy,wl,hwTop*0.34); runnels(pen,g,wx,wy+hwTop*0.22,H,3); }
  else if(bound){
    const tight = mode==="tighten";
    const n = tight?params.tightTurns:params.wrapTurns;
    const u0=0.11, u1=tight?0.54:0.50;
    for(let i=0;i<n;i++){
      const u=lerp(u0,u1,(i+0.5)/n), y=y0+H*u;
      const hw=hwAt(u,hwTop,hwKnee)*(tight?1.16:1.20);
      const tilt=hw*(tight?0.10:0.17);
      const th=H*(u1-u0)/n*(tight?0.56:0.46);        // paper between every turn
      wovenBar(pen,g, cx-hw, y+tilt, cx+hw, y-tilt, th, i%2?CLOTH:1, 3, 3.2);
    }
    if(tight){
      knot(pen,g, cx+hwTop*1.16, y0+H*0.325, hwTop*0.30);
      tension(pen,g, cx-hwTop*1.30, y0+H*0.300, hwTop*0.55,  1);
      tension(pen,g, cx+hwTop*1.66, y0+H*0.345, hwTop*0.55, -1);
    } else {
      // the free end still travelling: a tail off the top turn
      ribbon(pen,g,[
        {x:cx-hwTop*1.00,y:y0+H*0.145},{x:cx-hwTop*1.48,y:y0+H*0.105},
        {x:cx-hwTop*1.84,y:y0+H*0.020},{x:cx-hwTop*1.60,y:y0-H*0.062,k:0.8}
      ], H*0.048, CLOTH, true);
    }
  } else {                                   // scar-forming
    scarLine(pen,g,wx,wy,wl,{ticks:true});
  }
  return { wound:{x:wx,y:wy}, knee:{x:cx,y:kY} };
}

/* ==================================================================
   THE MAGNIFIED CALLOUT — what the plate is actually reading right now.
   ================================================================== */
function callout(pen,g,cx,cy,R,kind,{blood=false}={}){
  pen.paint(()=>{ g.ellipse(cx,cy,R,R,0,0,7); }, toneSolid(inkLevel(3)), Math.max(2.6,R*0.030));
  pen.paint(()=>{ g.ellipse(cx,cy,R*0.90,R*0.90,0,0,7); }, toneSolid(inkLevel(PLATE)), Math.max(2,R*0.020));
  for(let i=0;i<params.rimTicks;i++){
    const a=(i/params.rimTicks)*Math.PI*2, lng=(i%3===0);
    const r0=R*1.05, r1=R*(lng?1.19:1.12);
    pen.ink(()=>{ g.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);
                  g.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1); }, lng?3.0:1.5);
  }
  g.save();
  if(kind==="head"){
    const hl=R*0.80, hw=R*0.26, w=R*0.155;
    g.translate(cx-R*0.02, cy-R*0.60); g.rotate(0.36);
    // shaft stub behind, so the head is clearly ON something
    pen.paint(()=>{ rr(g,-w/2, hl*0.90, w, R*0.60, w*0.34); }, toneSolid(inkLevel(ASH)), 4);
    g.fillStyle=inkLevel(ASH_SH); g.fillRect(w/2-w*0.26, hl*0.96, w*0.24, R*0.48);
    leafHead(pen,g,hl,hw,w,{blood,lw:4.4});
    socket(pen,g,hl-5,w,R*0.17,3.6);
    lashing(pen,g,hl+R*0.19, hl+R*0.40, w, 3.2);
  } else if(kind==="knot"){
    knot(pen,g, cx, cy+R*0.04, R*0.44);
    // the two lengths running out of the knot to the rim
    ribbon(pen,g,[{x:cx-R*0.76,y:cy+R*0.52},{x:cx-R*0.52,y:cy+R*0.34},
                  {x:cx-R*0.30,y:cy+R*0.24}], R*0.30, CLOTH, true);
    ribbon(pen,g,[{x:cx+R*0.30,y:cy-R*0.22},{x:cx+R*0.54,y:cy-R*0.34},
                  {x:cx+R*0.78,y:cy-R*0.50}], R*0.30, CLOTH2, true);
  } else {
    // a patch of skin, the closed seam across it, and the tension lines the
    // puckering pulls into the flesh either side
    pen.paint(()=>{ g.ellipse(cx,cy,R*0.78,R*0.64,-0.30,0,7); }, toneSolid(inkLevel(SKIN)), 3.4);
    g.save(); g.translate(cx,cy); g.rotate(-0.55);
    for(const d of [-1,1]) for(let k=1;k<=2;k++){
      const o=d*R*(0.19+(k-1)*0.16);
      pen.seam(()=>{ g.moveTo(-R*0.50, o*0.88);
        g.quadraticCurveTo(0, o*1.30, R*0.50, o*0.88); }, k===1?2.8:1.6);
    }
    g.restore();
    scarLine(pen,g, cx, cy, R*1.24, {ticks:true, lw:5.0});
  }
  g.restore();
}

/* ==================================================================
   THE BINDING STRIP as its own object — rolled, paying out, taut, or used.
   Vertical so it never stripes the frame.
   ================================================================== */
/* the binding before it is used: a cylinder of rolled linen, seen from the
   side, with the spiral of its own winding showing on the near end */
function rollOfLinen(pen,g,cx,cy,rad,len){
  pen.paint(()=>{ rr(g,cx-len*0.5,cy-rad,len,rad*2,rad*0.42); }, toneSolid(inkLevel(CLOTH)), 4.2);
  for(let i=1;i<4;i++) pen.seam(()=>{ const x=cx-len*0.5+len*i/4.2;
    g.moveTo(x,cy-rad*0.92); g.lineTo(x+rad*0.26,cy+rad*0.92); }, 1.9);
  pen.paint(()=>{ g.ellipse(cx-len*0.5,cy,rad*0.36,rad,0,0,7); }, toneSolid(inkLevel(CLOTH2)), 3.4);
  for(let i=1;i<=3;i++) pen.seam(()=>{ g.ellipse(cx-len*0.5,cy,rad*0.36*i/4,rad*i/4,0,0,7); }, 1.7);
}
function bandageStrip(pen,g,sx,y0,y1,amp,mode){
  const H=y1-y0, w=amp*0.62;
  /* a serpentine centreline: the linen always meanders, so this register can
     never read as a bar or a ruler */
  const wave=(n,a,turns,u0=0,u1=1,taper=0)=>{
    const p=[]; for(let i=0;i<n;i++){ const u=i/(n-1);
      p.push({ x:sx+Math.sin(u0*Math.PI+u*Math.PI*turns)*a,
               y:lerp(lerp(y0,y1,u0),lerp(y0,y1,u1),u), k:1-taper*u }); }
    return p;
  };
  if(mode==="strike" || mode==="blood"){
    rollOfLinen(pen,g, sx+amp*0.05, y0+H*0.12, amp*0.62, amp*2.05);
    const tail=[{x:sx+amp*0.98,y:y0+H*0.20},{x:sx+amp*0.66,y:y0+H*0.36},
                {x:sx-amp*0.20,y:y0+H*0.50},{x:sx+amp*0.62,y:y0+H*0.66},
                {x:sx-amp*0.10,y:y0+H*0.80,k:0.84}];
    if(mode==="blood") tail.push({x:sx+amp*0.52,y:y0+H*0.93,k:0.68});
    ribbon(pen,g,tail,w,CLOTH,true);
    if(mode==="blood") pen.fillPath(()=>{
      g.ellipse(sx+amp*0.30,y0+H*0.90,amp*0.30,amp*0.22,0.3,0,7); }, inkLevel(STAIN));
  } else if(mode==="wrap"){
    rollOfLinen(pen,g, sx+amp*0.05, y0+H*0.07, amp*0.52, amp*1.75);
    ribbon(pen,g, wave(18, amp*0.86, 2.3, 0.16, 1.0), w, CLOTH, true);
  } else if(mode==="tighten"){
    // ONE continuous length, drawn taut, with the knot set on its middle
    ribbon(pen,g, wave(15, amp*0.50, 1.0, 0.0, 1.0), w, CLOTH, true);
    const kx=sx+amp*0.50, ky=lerp(y0,y1,0.50);
    knot(pen,g, kx, ky, amp*0.44);
    tension(pen,g, kx-amp*1.28, ky+H*0.22, amp*0.62,  1);
    tension(pen,g, kx+amp*1.28, ky-H*0.22, amp*0.62, -1);
  } else {                                   // used, laid down, stained
    const p=wave(17, amp*0.90, 3.0, 0.05, 1.0, 0.20);
    ribbon(pen,g,p,w,CLOTH,true);
    for(const i of [4,7,10]) pen.fillPath(()=>{
      g.ellipse(p[i].x, p[i].y, amp*0.26, amp*0.20, 0.4,0,7); }, inkLevel(STAIN));
  }
}

/* ==================================================================
   PLATE FURNITURE — brackets, declared-scale rule, state ledger.
   Every glyph is GEOMETRY: nothing on this plate is small type.
   ================================================================== */
function brackets(pen,g,x0,y0,x1,y1,k,solid){
  const lw=solid?3.6:2.2;
  for(const [sx,sy,cx0,cy0] of [[1,1,x0,y0],[-1,1,x1,y0],[1,-1,x0,y1],[-1,-1,x1,y1]])
    pen.ink(()=>{ g.moveTo(cx0+sx*k,cy0); g.lineTo(cx0,cy0); g.lineTo(cx0,cy0+sy*k); }, lw);
}
function scaleRule(pen,g,x,y0,y1,tick){
  const n=params.ruleTicks;
  for(let i=0;i<n;i++){                     // spine drawn in segments, never one bar
    const a=lerp(y0,y1,i/n)+ (y1-y0)/n*0.14, b=lerp(y0,y1,(i+1)/n)-(y1-y0)/n*0.14;
    pen.ink(()=>{ g.moveTo(x,a); g.lineTo(x,b); }, 2.4);
  }
  for(let i=0;i<=n;i++){ const y=lerp(y0,y1,i/n), lng=(i%3===0);
    pen.ink(()=>{ g.moveTo(x,y); g.lineTo(x+tick*(lng?1.9:1.0), y); }, lng?3.4:2.0); }
}
/* the five states as chips: chevron / drop / turns / knot / seam */
function stepGlyph(pen,g,i,cx,cy,s,col){
  g.strokeStyle=col; g.fillStyle=col; g.lineWidth=Math.max(2.8,s*0.17);
  g.lineCap="round"; g.lineJoin="round";
  if(i===0){ g.beginPath(); g.moveTo(cx-s*0.62,cy+s*0.42); g.lineTo(cx,cy-s*0.52);
             g.lineTo(cx+s*0.62,cy+s*0.42); g.stroke();
             g.beginPath(); g.moveTo(cx,cy-s*0.10); g.lineTo(cx,cy+s*0.66); g.stroke(); }
  else if(i===1){ g.beginPath(); g.moveTo(cx,cy-s*0.72);
             g.quadraticCurveTo(cx+s*0.62,cy+s*0.22, cx,cy+s*0.62);
             g.quadraticCurveTo(cx-s*0.62,cy+s*0.22, cx,cy-s*0.72); g.fill(); }
  else if(i===2){ for(let k=0;k<3;k++){ const y=cy+(k-1)*s*0.50;
             g.beginPath(); g.moveTo(cx-s*0.66,y-s*0.10); g.lineTo(cx+s*0.66,y+s*0.10); g.stroke(); } }
  else if(i===3){ g.beginPath(); g.arc(cx-s*0.28,cy,s*0.36,0,7); g.stroke();
             g.beginPath(); g.arc(cx+s*0.28,cy,s*0.36,0,7); g.stroke(); }
  else { g.beginPath(); g.moveTo(cx-s*0.70,cy+s*0.10);
             g.quadraticCurveTo(cx,cy-s*0.32, cx+s*0.70,cy+s*0.10); g.stroke();
             g.lineWidth=Math.max(2.2,s*0.13);
             for(let k=-1;k<=1;k++){ const x=cx+k*s*0.40;
               g.beginPath(); g.moveTo(x,cy-s*0.22); g.lineTo(x+s*0.06,cy+s*0.34); g.stroke(); } }
}
function ledger(pen,g,x,y,cs,gap,active){
  for(let i=0;i<params.ledgerSteps;i++){
    const cx=x+i*(cs+gap);
    const on=(i===active), done=(i<active);
    pen.paint(()=>{ rr(g,cx,y,cs,cs,cs*0.16); },
      toneSolid(inkLevel(on?7:(done?2:1))), on?3.6:2.6);
    stepGlyph(pen,g,i, cx+cs/2, y+cs/2, cs*0.30, on?inkLevel(0):INK);
    if(i<params.ledgerSteps-1)                       // short connector, not a rail
      pen.ink(()=>{ g.moveTo(cx+cs+gap*0.22, y+cs*0.5);
                    g.lineTo(cx+cs+gap*0.78, y+cs*0.5); }, done?3.0:1.6);
  }
}

/* ==================================================================
   THE PLATE
   ================================================================== */
const AXIS = {
  strike : { tip:{x:.105,y:.130}, butt:{x:.445,y:.845} },
  blood  : { tip:{x:.115,y:.155}, butt:{x:.450,y:.860} },
  wrap   : { tip:{x:.190,y:.120}, butt:{x:.330,y:.870} },
  tighten: { tip:{x:.195,y:.120}, butt:{x:.335,y:.870} },
  scar   : { tip:{x:.075,y:.300}, butt:{x:.455,y:.800} },
};
const KIND = { strike:"head", blood:"head", wrap:"knot", tighten:"knot", scar:"scar" };
const STEP = { strike:0, blood:1, wrap:2, tighten:3, scar:4 };

function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  let mode = st.mode || "strike";
  if (mode==="scar-forming" || mode==="scarred") mode="scar";
  if (!AXIS[mode]) mode="strike";
  const blood = (mode==="blood");

  // registration brackets around the weapon under inspection
  brackets(pen,g, W*0.035, H*0.095, W*0.500, H*0.900, W*0.048, mode==="scar");
  // declared scale, vertical so it cannot stripe the plate
  scaleRule(pen,g, W*0.056, H*0.185, H*0.845, W*0.020);

  // ---- the weapon ----
  const A = AXIS[mode];
  const S = spear(pen,g, {x:A.tip.x*W,y:A.tip.y*H}, {x:A.butt.x*W,y:A.butt.y*H},
                  { blood, motion: mode==="strike" });

  // ---- declared scale: the spear's own anchor points, registered ----
  for(const p of [S.tip, S.socket, S.grip, S.butt]){
    dashTo(pen,g, Math.max(W*0.082, p.x-W*0.150), p.y, p.x-W*0.026, p.y, W*0.024);
    anchorMark(pen,g, p.x, p.y, W*0.015);
  }

  // ---- the thigh carrying the wound (tilted: a limb, never a column) ----
  const lx=W*0.640, ly0=H*0.410, ly1=H*0.775, hwT=W*0.096, hwK=W*0.044;
  const la=-0.115, ca=Math.cos(la), sa=Math.sin(la);
  const unrot=p=>({ x:lx+(p.x-lx)*ca-(p.y-ly0)*sa, y:ly0+(p.x-lx)*sa+(p.y-ly0)*ca });
  g.save(); g.translate(lx,ly0); g.rotate(la); g.translate(-lx,-ly0);
  const T0 = thigh(pen,g, lx, ly0, ly1, hwT, hwK, mode);
  g.restore();
  const T = { wound:unrot(T0.wound), knee:unrot(T0.knee) };

  // ---- the magnified read, with leaders from whatever it is reading ----
  const cx=W*0.735, cy=H*0.252, R=W*0.180;
  const from = (KIND[mode]==="head") ? S.head : T.wound;
  pen.ink(()=>{ g.moveTo(from.x, from.y); g.lineTo(cx-R*0.86, cy+R*0.52); }, 2.0);
  pen.ink(()=>{ g.moveTo(from.x, from.y); g.lineTo(cx-R*0.52, cy+R*0.86); }, 1.5);
  callout(pen,g, cx, cy, R, KIND[mode], { blood });

  // ---- the binding strip as its own object ----
  bandageStrip(pen,g, W*0.885, H*0.445, H*0.775, W*0.056, mode);

  // ---- the five-state ledger ----
  ledger(pen,g, W*0.520, H*0.845, W*0.070, W*0.018, STEP[mode]);
}

export const asset = {
  id:"prop.spear-and-wound-bandage",
  type:"PROP",
  name:"Spear and Wound Bandage",
  statusWord:"BOUND",
  scene:"OD-B19-S05",

  params,
  // back -> front
  layers:["brackets","scale-rule","motion","shaft","butt","head","socket","lashing",
          "blood","limb","wound","turns","knot","tension","leader","callout","strip","ledger"],

  /* normalized 0..1 grip / support / contact anchors. The spear anchors are
     measured in the neutral `wrap` (grounded) lie; the runtime re-derives them
     from the returned axis when the lie changes. */
  anchors:{
    "grip":{x:.255,y:.615},              // the thonged hand-hold — two-handed weapon
    "grip:second":{x:.240,y:.500},       // off hand, up the shaft
    "tip":{x:.190,y:.120},               // the point that goes through the boar
    "socket":{x:.222,y:.300},            // head-to-shaft collar
    "contact:ground":{x:.330,y:.870},    // butt on the slope when planted
    "contact:wound":{x:.688,y:.517},     // where the tusk went in, above the knee
    "tie:knot":{x:.703,y:.531},          // where the binding is knotted off
    "mark:scar":{x:.688,y:.517},         // the permanent mark this event makes
    "roll:linen":{x:.892,y:.487},        // the binding before it is used
    "lens:inspect":{x:.735,y:.252},      // focus point when magnified
  },
  // a thin oriented capsule along the shaft (asset space, `wrap` lie)
  collision:{ kind:"capsule", a:{x:.190,y:.120}, b:{x:.330,y:.870}, r:.028 },
  // young Odysseus carries the spear; Autolycus's sons own the binding and
  // do the tying — the wound and its mark stay with him for good.
  ownership:"ithaca:odysseus",
  boundBy:"autolycuss-sons",
  zones:{ bounds:{x0:.03,y0:.09,x1:.96,y1:.90},
          footprint:{x0:.19,y0:.80,x1:.46,y1:.88} },

  states:{
    initial:"strike",
    nodes:{
      strike:        { preview:{ mode:"strike",  status:"STRIKE",   progress:.25 } },
      blood:         { preview:{ mode:"blood",   status:"BLEEDING", progress:.42 } },
      wrap:          { preview:{ mode:"wrap",    status:"WRAPPED",  progress:.62 } },
      tighten:       { preview:{ mode:"tighten", status:"BOUND",    progress:.82 } },
      "scar-forming":{ preview:{ mode:"scar",    status:"SCARRED",  progress:1.0 } },
    },
    edges:[
      ["strike","blood"],["blood","wrap"],["wrap","tighten"],
      ["tighten","scar-forming"],["wrap","blood"],["tighten","wrap"],
      ["scar-forming","strike"],
    ],
  },
  channels:["mode","angle","turns","t"],

  preview:()=>({ mode:"tighten", status:"BOUND", progress:.82, t:0 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{});
    return { anchors:asset.anchors, collision:asset.collision, ownership:asset.ownership }; },
};
export default asset;
