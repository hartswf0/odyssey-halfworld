/* divine_fx.binding-oath-field — a visible COVENANT sealed between two figures,
   its consequence a hostile wand struck dead. DIVINE_FX asset. Scene function
   (OD-B10-S06): Circe swears the oath Odysseus demands; the sworn vow becomes a
   visible field. Two covenant parties stand apart (SOURCE left = Circe, TARGET
   right = Odysseus) and raise their hands to a central CLASP — a clasped-hand
   oath-glyph held inside a heavy BINDING RING (the seal of the sworn word). From
   beneath the ring straight DOWNWARD OATH-LINES drop, plumb and knotted, binding
   the vow to the covenant ground between them. The visible consequence: Circe's
   WAND — her power to do harm — is disabled, its spell-star dimmed and STRUCK
   THROUGH by a prohibition mark. The covenant reads as: no more hostile ops.

   Narrative / procedural over state.t + intensity, bind, reach, disable:
     SOURCE   (t low,  low)  — parties apart, hands rising toward the clasp, ring
                               faint, oath-lines unstarted, the wand still LIVE.
     TARGET   (t mid,  mid)  — hands meet, the clasp grips, the binding ring seals.
     FIELD    (t high, high) — plumb oath-lines descend and knot the vow to the
                               ground; the covenant field is established.
     TRANSFORM(t full, full) — the wand's spell-star dims and is STRUCK THROUGH:
                               the hostile power is disabled. BOUND.
   `bind`   : how tightly the two hands are clasped (grip drawn shut).
   `reach`  : how far the downward oath-lines have descended to the ground.
   `disable`: how fully the wand is struck through / its spell-star dimmed.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. Keep the upper
   band light so the card LABEL stays legible. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  horizon:  0.82,    // covenant ground line as frac of H
  ringCx:   0.50,    // binding-ring / clasp center x
  ringCy:   0.40,    // binding-ring / clasp center y
  ringR:    0.19,    // binding-ring outer radius as frac of W
  leftX:    0.125,   // SOURCE figure (Circe) stance x
  rightX:   0.875,   // TARGET figure (Odysseus) stance x
  oathLines:7,       // downward plumb oath-lines binding the vow
  wandBase: [0.110,0.560],  // disabled wand handle (frac of W,H)
  wandTip:  [0.215,0.435],  // disabled wand tip / spell-star (frac of W,H)
  intensity:1.0,
  bind:     1.0,
};

/* ---- FIELD: the covenant air. A pale field (kept light at the top so the card
   LABEL reads) with a soft solemn HALO disc behind the seal so the dark ring
   lifts off the paper. This is the field the sworn word establishes. ---- */
function drawField(g,W,H){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hy);
  const cx = W*params.ringCx, cy = H*params.ringCy;
  g.fillStyle = inkLevel(2);
  g.beginPath(); g.ellipse(cx, cy, W*0.30, W*0.30, 0, 0, TAU); g.fill();
}

/* ---- covenant GROUND the vow is bound to: a mid band below the horizon with a
   darker shore seam and a hard contour line at the waterline. ---- */
function drawGround(pen,g,W,H){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H-hy);
  g.fillStyle = inkLevel(4); g.fillRect(0,hy,W,H*0.012);
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 4);
}

/* ---- a covenant PARTY: a plain dark figure silhouette (robe mass + neck +
   head) standing on the ground. side = +1 for the left party (its inner side is
   to the right), -1 for the right party. Returns the inner-shoulder point where
   its raised arm departs toward the central clasp. ---- */
function drawFigure(pen,g,W,H,cx,side){
  const gy = H*params.horizon;
  const hr = W*0.050, headY = gy - H*0.215;
  const shY = gy - H*0.175, shW = W*0.100, hipW = W*0.086;
  const body = toneSolid(inkLevel(5));
  // ground contact shadow
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, gy+4, W*0.09, H*0.012, 0, 0, TAU); g.fill();
  // robe mass (shoulders -> ground)
  pen.paint(()=>{
    g.moveTo(cx-shW/2, shY); g.lineTo(cx+shW/2, shY);
    g.lineTo(cx+hipW/2, gy); g.lineTo(cx-hipW/2, gy); g.closePath();
  }, body, 5);
  // neck + head
  pen.limb(()=>{ g.moveTo(cx, shY); g.lineTo(cx, headY+hr*0.7); }, body, W*0.03);
  pen.paint(()=>{ g.ellipse(cx, headY, hr*0.92, hr, 0, 0, TAU); }, toneSolid(inkLevel(4)), 5);
  return { x: cx + side*shW*0.40, y: shY + H*0.010 };
}

/* ---- a raised ARM from a party's inner shoulder up-and-in to the clasp. One
   bent limb (shoulder -> elbow -> wrist) so the hands are lifted to the oath.
   side controls which way the elbow bows out. ---- */
function drawArm(pen,g,W,H,S,Wr,side){
  const body = toneSolid(inkLevel(5));
  const ex = (S.x+Wr.x)/2 - side*W*0.025;
  const ey = (S.y+Wr.y)/2 + H*0.028;
  pen.limb(()=>{ g.moveTo(S.x,S.y); g.lineTo(ex,ey); g.lineTo(Wr.x,Wr.y); }, body, W*0.028);
}

/* ---- SOURCE / oath-glyph: the great BINDING RING sealed around the clasp. A
   heavy dark annulus (dark band, light aperture) ringed with sworn notches. The
   clasped hands are held in the aperture (drawn after, on top). ---- */
function drawRing(pen,g,W,H,t){
  const cx = W*params.ringCx, cy = H*params.ringCy, R = W*params.ringR;
  const rIn = R*0.72;
  // faint outer sworn boundary
  pen.ink(()=>{ g.arc(cx,cy,R*1.14,0,TAU); }, 3);
  // ring band: dark annulus (dark outer disc, light aperture punched back)
  pen.paint(()=>{ g.arc(cx,cy,R,0,TAU); }, toneSolid(inkLevel(7)), 6);
  pen.paint(()=>{ g.arc(cx,cy,rIn,0,TAU); }, toneSolid(inkLevel(2)), 5);
  // sworn notches around the band
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = "round";
  for(let a=0;a<16;a++){
    const th = a/16*TAU;
    const r0 = rIn + (R-rIn)*0.26, r1 = R - (R-rIn)*0.12;
    g.beginPath();
    g.moveTo(cx+Math.cos(th)*r0, cy+Math.sin(th)*r0);
    g.lineTo(cx+Math.cos(th)*r1, cy+Math.sin(th)*r1);
    g.stroke();
  }
}

/* ---- the CLASPED-HAND oath-glyph in the ring aperture: two hands gripping —
   drawn as a horizontal bundle with a center seam where the two meet, interlocked
   finger ridges, and two thumbs riding over the top. `bind` draws the grip
   tighter (the bundle compacts + the seam closes). ---- */
function drawClasp(pen,g,W,H,t,bind){
  const cx = W*params.ringCx, cy = H*params.ringCy, R = W*params.ringR;
  const rIn = R*0.72;
  const tight = clamp01(bind) * (0.9 + 0.1*Math.sin(t*1.4));
  const cw = rIn*lerp(0.72, 0.86, clamp01(bind));
  const ch = rIn*0.48;
  // the clasped-hands bundle
  pen.paint(()=>{ g.ellipse(cx, cy, cw, ch, 0, 0, TAU); }, toneSolid(inkLevel(5)), 5);
  // seam where the two hands meet
  pen.ink(()=>{ g.moveTo(cx, cy-ch*0.78); g.lineTo(cx, cy+ch*0.78); }, 3);
  // interlocked finger ridges over the grip
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = "round";
  for(let i=-2;i<=2;i++){
    const fx = cx + i*cw*0.34;
    g.beginPath();
    g.moveTo(fx, cy-ch*0.72);
    g.quadraticCurveTo(fx + (i<0?1:-1)*cw*0.12, cy, fx, cy+ch*0.72);
    g.stroke();
  }
  // two thumbs curling over the top toward the seam (the grip closing)
  for(const s of [-1,1]){
    const tipx = cx + s*lerp(cw*0.30, cw*0.12, tight);
    g.beginPath();
    g.moveTo(cx + s*cw*0.52, cy - ch*0.15);
    g.quadraticCurveTo(cx + s*cw*0.30, cy - ch*0.95, tipx, cy - ch*0.45);
    g.stroke();
  }
}

/* ---- FIELD / OATH-LINES: straight plumb lines dropping from beneath the ring to
   the covenant ground — the vow bound down between the two parties. Center lines
   longest + heaviest, thinning at the margins; each carries binding KNOT ticks
   and ends in a downward arrowhead. They lengthen with `reach`. ---- */
function drawOathLines(pen,g,W,H,t,reach){
  const cx = W*params.ringCx, cy = H*params.ringCy, R = W*params.ringR;
  const hy = H*params.horizon;
  const n = params.oathLines, spread = R*1.35;
  const rr = smooth(clamp01(reach));
  const y0base = cy + R*0.92;
  for(let i=0;i<n;i++){
    const f = (i/(n-1)) - 0.5;                 // -0.5..0.5
    const x = cx + f*spread;
    const edge = 1 - Math.abs(f)*1.35;         // center strongest
    const y0 = y0base + Math.abs(f)*R*0.30;
    const y1 = lerp(y0+H*0.04, hy-H*0.006, rr*(0.7+0.3*edge)) + Math.sin(t*1.3+i)*2.5;
    g.strokeStyle = inkLevel(3 + Math.round(edge*3.2));
    g.lineWidth = lerp(2, 5, clamp01(edge));
    g.lineCap = "round";
    g.beginPath(); g.moveTo(x,y0); g.lineTo(x,y1); g.stroke();
    // binding knot ticks
    const knots = 3;
    for(let k=1;k<=knots;k++){
      const ky = lerp(y0,y1,k/(knots+1));
      const kw = lerp(3,7,clamp01(edge)) * (0.7+0.3*Math.sin(t*2+k+i));
      g.beginPath(); g.moveTo(x-kw,ky); g.lineTo(x+kw,ky); g.stroke();
    }
    // downward arrowhead where the vow is driven into the ground
    if (edge > 0.05 && y1 > y0+18){
      const ah = lerp(5,10,clamp01(edge));
      g.beginPath();
      g.moveTo(x-ah, y1-ah*1.3); g.lineTo(x, y1); g.lineTo(x+ah, y1-ah*1.3);
      g.stroke();
    }
  }
}

/* ---- CONSEQUENCE: the hostile WAND disabled. Circe's wand lies raised at lower
   left; its spell-star DIMS (rays shorten + lighten) and a prohibition mark
   (ring + diagonal slash) is STRUCK THROUGH it as `disable` grows — the visible
   sign that her power to harm Odysseus is switched off. ---- */
function drawWand(pen,g,W,H,t,disable){
  const bx = W*params.wandBase[0], by = H*params.wandBase[1];
  const tx = W*params.wandTip[0],  ty = H*params.wandTip[1];
  const D = smooth(clamp01(disable));
  // rod + handle knob
  pen.limb(()=>{ g.moveTo(bx,by); g.lineTo(tx,ty); }, toneSolid(inkLevel(5)), W*0.014);
  pen.paint(()=>{ g.arc(bx,by,W*0.022,0,TAU); }, toneSolid(inkLevel(6)), 4);
  // spell-star at the tip — rays shrink + lighten as the power is disabled
  const rays = 8, baseLen = W*0.058, life = 1 - 0.62*D;
  g.strokeStyle = inkLevel(clamp(6 - Math.round(D*3), 3, 6));
  g.lineCap = "round"; g.lineWidth = lerp(4, 2, D);
  for(let i=0;i<rays;i++){
    const th = i/rays*TAU + t*0.3;
    const len = baseLen*life*(i%2?0.62:1)*(0.9+0.1*Math.sin(t*3+i));
    g.beginPath(); g.moveTo(tx,ty);
    g.lineTo(tx+Math.cos(th)*len, ty+Math.sin(th)*len); g.stroke();
  }
  // star core
  pen.paint(()=>{ g.arc(tx,ty,W*0.017,0,TAU); },
            toneSolid(inkLevel(clamp(6 - Math.round(D*2), 4, 6))), 3);
  // prohibition mark (ring + diagonal strike) — the "disabled" glyph, grows with D
  if (D > 0.02){
    const pr = W*0.078;
    g.save();
    g.globalAlpha = clamp01(D*1.3);
    g.strokeStyle = INK; g.lineCap = "round"; g.lineJoin = "round";
    g.lineWidth = lerp(3, 7, D);
    g.beginPath(); g.arc(tx, ty, pr, 0, TAU*clamp01(D)); g.stroke();   // ring draws round
    const a = -Math.PI*0.25;                                          // diagonal strike-through
    const sx = tx - Math.cos(a)*pr, sy = ty - Math.sin(a)*pr;
    const ex = tx + Math.cos(a)*pr, ey = ty + Math.sin(a)*pr;
    const u = clamp01((D-0.2)/0.8);
    g.beginPath(); g.moveTo(sx,sy); g.lineTo(lerp(sx,ex,u), lerp(sy,ey,u)); g.stroke();
    g.restore();
  }
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const bind = st.bind ?? clamp(inten, 0, 1);
  const reach = st.reach ?? clamp((inten-0.10)*1.15, 0, 1);
  const disable = st.disable ?? clamp((inten-0.55)*1.9, 0, 1);
  const layers = st.layers || ["field","ground","figures","arms","oathlines","ring","clasp","wand"];
  const has = l => layers.includes(l);

  const cx = W*params.ringCx, cy = H*params.ringCy, R = W*params.ringR;
  const Wl = { x:cx - R*0.30, y:cy };   // left hand target in the aperture
  const Wr = { x:cx + R*0.30, y:cy };   // right hand target in the aperture

  if (has("field"))  drawField(g,W,H);
  if (has("ground")) drawGround(pen,g,W,H);

  let Sl = { x:W*params.leftX + W*0.06, y:H*params.horizon-H*0.14 };
  let Sr = { x:W*params.rightX - W*0.06, y:H*params.horizon-H*0.14 };
  if (has("figures")){
    Sl = drawFigure(pen,g,W,H, W*params.leftX,  +1);
    Sr = drawFigure(pen,g,W,H, W*params.rightX, -1);
  }
  if (has("arms")){
    drawArm(pen,g,W,H, Sl, Wl, +1);
    drawArm(pen,g,W,H, Sr, Wr, -1);
  }
  if (has("oathlines")) drawOathLines(pen,g,W,H,t,reach);
  if (has("ring"))      drawRing(pen,g,W,H,t);
  if (has("clasp"))     drawClasp(pen,g,W,H,t,bind);
  if (has("wand"))      drawWand(pen,g,W,H,t,disable);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.binding-oath-field",
  type:"DIVINE_FX",
  name:"Binding oath field",
  statusWord:"BOUND",
  scene:"OD-B10-S06",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["field","ground","figures","arms","oathlines","ring","clasp","wand"],
  // normalized 0..1 source / target / field / transform / consequence anchors
  anchors:{
    "source:circe":{    x:0.145, y:0.62 },   // the swearing party (left)
    "target:odysseus":{ x:0.855, y:0.62 },   // the covenant witness (right)
    "seal:ring":{       x:0.50,  y:0.40 },   // the binding ring / oath-glyph
    "clasp:hands":{     x:0.50,  y:0.40 },   // the clasped-hand covenant
    "field:oath-lines":{x:0.50,  y:0.62 },   // the downward vow-binding
    "ground:covenant":{ x:0.50,  y:0.82 },   // the ground the vow is bound to
    "wand:disabled":{   x:0.25,  y:0.605 },  // Circe's struck-through wand
    "camera:wide":{     x:0.50,  y:0.50 },
  },
  // affected regions
  zones:{
    seal:{  x0:0.28, y0:0.18, x1:0.72, y1:0.60 },   // the ring + clasp aperture
    field:{ x0:0.30, y0:0.44, x1:0.70, y1:0.82 },   // the oath-line corridor
    wand:{  x0:0.04, y0:0.50, x1:0.34, y1:0.86 },   // the disabled-wand footprint
  },
  // DIVINE_FX transformation states: proposed -> clasped -> bound -> disabled
  states:{
    initial:"transform",
    nodes:{
      // source: parties apart, hands rising, ring faint, wand still LIVE
      source:{    preview:{ t:0.4, intensity:0.28, bind:0.22, reach:0.0, disable:0.0,
                            status:"PROPOSED", progress:0.14 } },
      // target: hands meet, the clasp grips, the binding ring seals
      target:{    preview:{ t:1.2, intensity:0.62, bind:0.72, reach:0.28, disable:0.0,
                            status:"CLASPED",  progress:0.42 } },
      // field: the plumb oath-lines descend, binding the vow to the ground
      field:{     preview:{ t:1.9, intensity:0.86, bind:0.95, reach:1.0, disable:0.30,
                            status:"BINDING",  progress:0.68 } },
      // transform: the wand is struck through — the hostile power is disabled (neutral)
      transform:{ preview:{ t:2.6, intensity:1.28, bind:1.0, reach:1.0, disable:1.0,
                            status:"BOUND",    progress:0.90 } },
    },
    edges:[["source","target"],["target","field"],["field","transform"],
           ["transform","field"],["field","target"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","bind","reach","disable"],

  // neutral preview: the covenant fully BOUND — parties clasped, binding ring
  // sealed, plumb oath-lines driven into the ground, and the hostile wand dimmed
  // and struck through (reads unmistakably as a sworn oath that disables the wand).
  preview:()=>({ t:2.4, intensity:1.25, bind:1.0, reach:1.0, disable:1.0,
                 status:"BOUND", progress:0.88,
                 layers:["field","ground","figures","arms","oathlines","ring","clasp","wand"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
