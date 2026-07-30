/* set_piece.axe-alignment-lane — the Book-21 SHOOTING CORRIDOR.
   SET_PIECE. The twelve axe-heads Odysseus sets in a dead-straight trench down
   the megaron floor, each planted haft-down in its own socket so that the twelve
   socket-EYES stand at one height on one line. Drawn as a separable architectural
   component: a light floor LANE strip whose two long edges are the collision
   corridor, a broken TRENCH with twelve socket mouths and their planting-anchor
   ticks, twelve axes receding up the frame, the SIGHTLINE ruled dead-straight
   through every eye — buried by the blades, surviving only in the eyes and the
   gaps, which is the alignment proof — the arrow riding that line, the archer's
   STANCE plate at the near end and the MARK beyond the twelfth.
   Two verification insets: the APERTURE (the lane seen down its own axis: the
   twelve heads nested one inside the next, closing on a single clear hole) and
   the SOCKET SECTION (one axe cut through: blade, eye, lug, haft, socket cavity,
   planting-depth bracket, and the eye datum with its pass-through arrow). The
   count is stated as GEOMETRY — seven-segment numerals over a tally comb — since
   set type at this size dissolves in the dot lattice.
   SOLID grays + hard contour only; the engine dotify pass supplies the halftone.
   Atlas: OD-B21-S02 — straight shooting corridor with twelve sockets, planting
   anchors, sightline, and arrow pass-through verification. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---------------- normalized lane geometry (fractions of W,H) ----------------
   Everything — anchors, sockets, sightline — derives from these numbers. Because
   the base point AND the scale are both affine in the depth parameter, every eye
   centre lands on ONE straight line. That is the whole point of this set piece,
   so it is a property of the geometry, never something nudged by hand. */
const LANE = {
  n:12,
  ease:0.90,                          // depth spacing: near steps longer than far
  near:{ x:0.195, y:0.632 },          // socket 01 base
  far: { x:0.865, y:0.318 },          // socket 12 base
  nearScale:0.86, farScale:0.68,
  eyeRise:0.068,                      // *H  base -> eye centre at scale 1
  hw:0.062,                           // *H  lane strip half-width at scale 1
  backF:-0.100, frontF:1.020,         // lane strip extent
  sightBack:-0.165, sightFront:1.090, // the ruled line runs clear past both ends
  stanceF:-0.075,                     // archer's plate
  markF:1.090,                        // the mark the ruled line terminates in
};

/* axe-head proportions, all *scale. The head is RING-DOMINANT: a thick socket
   lug pierced by an oversized eye, with a modest blade fanning off its crown.
   That is deliberate — twelve pierced rings threaded on one rod is the image the
   set piece exists to make, and a hole under about five dot cells across simply
   dissolves in the halftone. The blade must stay narrower than the ring or the
   heads collide as the row closes toward the far end. */
const AXE = {
  lugRx:0.034, lugRy:0.037,           // *W , *H   the pierced socket lug
  eyeR:0.024,                         // *W        the hole the arrow goes through
  haftHalf:0.012, haftTop:0.032,      // *W , *H
  neckY:0.026, neckHalf:0.013,        // blade root, buried in the lug crown
  topY:0.080,  topHalf:0.033,         // horned cutting edge
  crest:0.013,                        // *H  edge camber
  waist:0.55,                         // side concavity — what makes it an axe
};

/* the same silhouette in aperture-panel pixels, enlarged by INSET_K so the
   nested heads read at inset size. Derived from AXE — never re-typed. */
const AXE_PX = (k, W=660, H=880) => ({
  eyeR:AXE.eyeR*W*k, lugRx:AXE.lugRx*W*k, lugRy:AXE.lugRy*H*k,
  neckY:-AXE.neckY*H*k, neckHalf:AXE.neckHalf*W*k,
  topY:-AXE.topY*H*k,   topHalf:AXE.topHalf*W*k, crest:AXE.crest*H*k,
  haftHalf:AXE.haftHalf*W*k, haftY0:AXE.haftTop*H*k, haftY1:(LANE.eyeRise+0.007)*H*k,
});

/* verification insets — corner-bracketed, never boxed (a closed rect at this size
   lays two long rules across the frame) */
const APERTURE = { x0:0.058, y0:0.085, x1:0.318, y1:0.360, cx:0.188, cy:0.2225,
                   nest:[1.0,0.80,0.64,0.51] };
/* the inset axe in panel pixels — the SAME silhouette as a lane axe, enlarged by
   K so the nested heads read at inset size */
const INSET_K = 1.65;
const SECTION = { x0:0.455, y0:0.700, x1:0.940, y1:0.935 };
const COUNT   = { x:0.088, y:0.790, h:0.055, lw:8.5,
                  tallyY:0.868, tallyH:0.026, step:16, gap:14 };

const params = {
  lanePlaneLevel:1,   // floor strip — lightest tone; most of the frame stays paper
  bladeLevel:2,       // axe blade plane
  lugLevel:3,         // socket lug
  haftLevel:3,
  socketLevel:5,      // socket mouths — small, dark, countable
  trenchLevel:3,
  boundaryLW:5,       // lane collision contour
  brackets:true,
};

/* ---------------- lane parameterisation ---------------- */
const frac = i => Math.pow(i/(LANE.n-1), LANE.ease);
function laneN(f){
  return { x: lerp(LANE.near.x, LANE.far.x, f),
           y: lerp(LANE.near.y, LANE.far.y, f),
           s: lerp(LANE.nearScale, LANE.farScale, f) };
}
function eyeN(f){ const p=laneN(f); return { x:p.x, y:p.y - LANE.eyeRise*p.s, s:p.s }; }
function laneP(f,W,H){ const p=laneN(f); return { x:p.x*W, y:p.y*H, s:p.s }; }
function eyeP(f,W,H){ const p=eyeN(f);  return { x:p.x*W, y:p.y*H, s:p.s }; }

/* unit direction + normal of the sightline in pixel space */
function sightAxis(W,H){
  const a=eyeP(0,W,H), b=eyeP(1,W,H);
  const dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1;
  return { ux:dx/L, uy:dy/L, nx:-dy/L, ny:dx/L };
}

/* ---------------- small geometry helpers ---------------- */
function seg(g,x1,y1,x2,y2,lw,color,dash){
  g.save(); g.strokeStyle=color||INK; g.lineWidth=lw; g.lineCap="round";
  if(dash) g.setLineDash(dash);
  g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();
  g.setLineDash([]); g.restore();
}
function corner(g, x, y, dx, dy, len, lw){
  g.save(); g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="butt";
  g.beginPath(); g.moveTo(x+dx*len, y); g.lineTo(x,y); g.lineTo(x, y+dy*len); g.stroke(); g.restore();
}
function brackets(g, W, H, B, len, lw){
  const x0=B.x0*W, y0=B.y0*H, x1=B.x1*W, y1=B.y1*H, L=len*W;
  corner(g,x0,y0, 1, 1,L,lw); corner(g,x1,y0,-1, 1,L,lw);
  corner(g,x0,y1, 1,-1,L,lw); corner(g,x1,y1,-1,-1,L,lw);
}
/* seven-segment numerals — every number in this module is drawn as GEOMETRY */
const SEG7 = { "0":"abcdef","1":"bc","2":"abged","3":"abgcd","4":"fgbc","5":"afgcd",
               "6":"afgecd","7":"abc","8":"abcdefg","9":"abfgcd" };
function segDigit(g, ch, x, y, h, lw){
  const w=h*0.60, m=SEG7[ch]||"", my=y+h/2, i=lw*0.75;
  const on = k => m.includes(k);
  g.save(); g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="round";
  const ln=(x1,y1,x2,y2)=>{ g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke(); };
  if(on("a")) ln(x+i,y,   x+w-i,y);
  if(on("b")) ln(x+w,y+i, x+w,  my-i);
  if(on("c")) ln(x+w,my+i,x+w,  y+h-i);
  if(on("d")) ln(x+i,y+h, x+w-i,y+h);
  if(on("e")) ln(x,  my+i,x,    y+h-i);
  if(on("f")) ln(x,  y+i, x,    my-i);
  if(on("g")) ln(x+i,my,  x+w-i,my);
  g.restore();
  return w;
}
function segNumber(g, text, x, y, h, lw){
  let cx=x; for(const ch of text){ cx += segDigit(g,ch,cx,y,h,lw) + h*0.30; }
}

/* the blade path, shared by the lane axes, the aperture nest and the section.
   Concave flanks sweeping out to horned corners over a cambered cutting edge —
   the concavity is what separates an axe head from a flat hat at this size. */
function bladePath(g, cx, cy, neckY, neckHalf, topY, topHalf, crest){
  const wx=AXE.waist;
  g.moveTo(cx-neckHalf, cy+neckY);
  g.quadraticCurveTo(cx-neckHalf-(topHalf-neckHalf)*wx*0.35, cy+(neckY+topY)*0.55,
                     cx-topHalf, cy+topY);
  g.quadraticCurveTo(cx, cy+topY-crest*2.2, cx+topHalf, cy+topY);
  g.quadraticCurveTo(cx+neckHalf+(topHalf-neckHalf)*wx*0.35, cy+(neckY+topY)*0.55,
                     cx+neckHalf, cy+neckY);
  g.closePath();
}

/* ---------------- one axe, planted haft-down in its socket ---------------- */
function drawAxe(pen, g, W, H, f, opts={}){
  const b = laneP(f,W,H), s = b.s;
  const E = { x:b.x, y:b.y - LANE.eyeRise*H*s };
  const lw = Math.max(2.5, 4.6*s);

  // haft stub, sunk into the socket mouth
  const hh=AXE.haftHalf*W*s, hy0=E.y+AXE.haftTop*H*s, hy1=b.y+0.007*H*s;
  pen.paint(()=>{ g.rect(E.x-hh, hy0, hh*2, hy1-hy0); },
            toneSolid(inkLevel(params.haftLevel)), lw);

  // blade fanning out of the lug crown
  pen.paint(()=>{ bladePath(g, E.x, E.y, -AXE.neckY*H*s, AXE.neckHalf*W*s,
                            -AXE.topY*H*s, AXE.topHalf*W*s, AXE.crest*H*s); },
            toneSolid(inkLevel(params.bladeLevel)), lw);

  // socket lug carrying the eye
  pen.paint(()=>{ g.ellipse(E.x, E.y, AXE.lugRx*W*s, AXE.lugRy*H*s, 0, 0, 7); },
            toneSolid(inkLevel(params.lugLevel)), lw);

  // the EYE — a real hole: paper straight through the head
  const er=AXE.eyeR*W*s;
  pen.paint(()=>{ g.arc(E.x, E.y, er, 0, 7); }, toneSolid(inkLevel(0)), Math.max(2.5, 3.4*s));

  // the sightline, restored INSIDE the hole (the head fills buried it)
  if (opts.sight){
    const a=eyeP(LANE.sightBack,W,H), c=eyeP(LANE.sightFront,W,H);
    g.save(); g.beginPath(); g.arc(E.x,E.y,er*0.92,0,7); g.clip();
    seg(g,a.x,a.y,c.x,c.y, Math.max(2.5, 3.4*s), INK);
    g.restore();
  }
  return { E, s, base:b, eyeR:er };
}

/* ---------------- the arrow, riding the sightline ---------------- */
function drawArrow(g, W, H, q){
  const P=eyeP(q,W,H), s=Math.max(0.55,P.s), A=sightAxis(W,H);
  const len=0.128*W*s, hs=len*0.25;
  const tx=P.x+A.ux*len*0.42, ty=P.y+A.uy*len*0.42;
  const bx=P.x-A.ux*len*0.58, by=P.y-A.uy*len*0.58;
  seg(g,bx,by,tx,ty,Math.max(4,6.5*s),INK);
  g.save(); g.fillStyle=INK; g.beginPath();
  g.moveTo(tx+A.ux*hs*1.6, ty+A.uy*hs*1.6);
  g.lineTo(tx-A.nx*hs*0.80, ty-A.ny*hs*0.80);
  g.lineTo(tx+A.nx*hs*0.80, ty+A.ny*hs*0.80);
  g.closePath(); g.fill(); g.restore();
  for(const k of [-1,1]){
    seg(g, bx, by, bx-A.ux*hs*1.6+A.nx*hs*1.15*k, by-A.uy*hs*1.6+A.ny*hs*1.15*k,
        Math.max(3,4*s), INK);
  }
}

/* ---------------- APERTURE inset: the lane seen down its own axis ----------
   The twelve heads nested one inside the next; when the line is true they close
   on ONE clear hole. Deliberately NOT concentric rings — that would read as a
   second bullseye and collide with the mark at the far end of the lane. */
function drawAperture(pen, g, W, H, lit){
  const A=APERTURE, cx=A.cx*W, cy=A.cy*H, I=AXE_PX(INSET_K);
  A.nest.forEach((k,i)=>{
    const lw=Math.max(2.5, 5*k);
    g.save(); g.strokeStyle=INK; g.lineWidth=lw; g.lineJoin="round";
    g.beginPath(); bladePath(g, cx, cy, I.neckY*k, I.neckHalf*k, I.topY*k, I.topHalf*k, I.crest*k);
    g.stroke();
    g.beginPath(); g.ellipse(cx, cy, I.lugRx*k, I.lugRy*k, 0, 0, 7); g.stroke();
    if(i===0){   // only the nearest head shows its haft
      g.beginPath(); g.rect(cx-I.haftHalf*k, cy+I.haftY0*k, I.haftHalf*2*k, (I.haftY1-I.haftY0)*k);
      g.stroke();
    }
    g.restore();
  });
  // the clear aperture: the twelfth eye, paper through everything
  const hole=I.eyeR*A.nest[A.nest.length-1];
  pen.paint(()=>{ g.arc(cx,cy,hole,0,7); }, toneSolid(inkLevel(0)), 4);
  if (lit){ g.save(); g.fillStyle=INK; g.beginPath(); g.arc(cx,cy,5.5,0,7); g.fill(); g.restore(); }
  // datum ticks: left / right on the eye line, one below — never crossing rules
  seg(g, cx-76, cy, cx-58, cy, 4, INK);
  seg(g, cx+58, cy, cx+76, cy, 4, INK);
  seg(g, cx, cy+86, cx, cy+102, 4, INK);
  if (params.brackets) brackets(g,W,H,A,0.038,4);
}

/* ---------------- SECTION inset: one axe cut through its socket ------------ */
function drawSection(pen, g, W, H, lit){
  const ax=0.800*W, eyeY=0.808*H, floorY=0.868*H, cutBot=0.908*H;

  // broken floor line (never a rule across the frame)
  seg(g, 0.680*W, floorY, 0.752*W, floorY, 5, INK);
  seg(g, 0.848*W, floorY, 0.912*W, floorY, 5, INK);

  // socket cavity, cut open: light plane + hatch, not a black block
  pen.paint(()=>{ g.rect(ax-0.032*W, floorY, 0.064*W, cutBot-floorY); },
            toneSolid(inkLevel(2)), 4);
  for(let k=0;k<4;k++){
    const x=ax-0.028*W + k*0.019*W;
    seg(g, x, cutBot-3, x+0.012*W, floorY+3, 2.5, inkLevel(4));
  }
  // planting-depth bracket
  seg(g, 0.726*W, floorY, 0.726*W, cutBot, 4, INK);
  seg(g, 0.726*W, floorY, 0.746*W, floorY, 4, INK);
  seg(g, 0.726*W, cutBot, 0.746*W, cutBot, 4, INK);

  // haft sunk in the cavity
  pen.paint(()=>{ g.rect(ax-0.013*W, eyeY+0.032*H, 0.026*W, cutBot-(eyeY+0.032*H)); },
            toneSolid(inkLevel(params.haftLevel)), 4);
  // blade + lug + eye, same silhouette as the lane axes
  pen.paint(()=>{ bladePath(g, ax, eyeY, -0.034*H, 0.016*W, -0.084*H, 0.035*W, 0.008*H); },
            toneSolid(inkLevel(params.bladeLevel)), 5);
  pen.paint(()=>{ g.ellipse(ax, eyeY, 0.042*W, 0.044*H, 0, 0, 7); },
            toneSolid(inkLevel(params.lugLevel)), 5);
  pen.paint(()=>{ g.arc(ax, eyeY, 0.028*W, 0, 7); }, toneSolid(inkLevel(0)), 4);

  // eye DATUM: short dashed rules + the pass-through arrow head
  if (lit){
    seg(g, 0.580*W, eyeY, 0.746*W, eyeY, 3.5, INK, [13,10]);
    seg(g, ax-0.025*W, eyeY, ax+0.025*W, eyeY, 3.5, INK);      // through the hole
    seg(g, 0.862*W, eyeY, 0.900*W, eyeY, 3.5, INK, [13,10]);
    g.save(); g.fillStyle=INK; g.beginPath();
    g.moveTo(0.926*W, eyeY); g.lineTo(0.902*W, eyeY-0.012*H); g.lineTo(0.902*W, eyeY+0.012*H);
    g.closePath(); g.fill(); g.restore();
  }
  if (params.brackets) brackets(g,W,H,SECTION,0.038,4);
}

/* ---------------- the count block: numeral over a tally comb ---------------- */
function drawCount(g, W, H){
  segNumber(g, "12", COUNT.x*W, COUNT.y*H, COUNT.h*H, COUNT.lw);
  const y0=COUNT.tallyY*H, y1=y0+COUNT.tallyH*H;
  let x=COUNT.x*W;
  for(let i=0;i<LANE.n;i++){
    seg(g, x, y0, x, y1, 4.5, INK);
    x += COUNT.step;
    if(i%4===3) x += COUNT.gap;
  }
}

/* ---------------- the set piece ---------------- */
function drawLane(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const layers = st.layers || ["floor","trench","sockets","axes","sightline","arrow","aperture","section","count"];
  const has = l => layers.includes(l);
  const sight = has("sightline");
  const t = st.t || 0;
  const arrowQ = (st.arrowQ != null) ? st.arrowQ : (0.06 + ((t*0.30)%1)*1.02);

  const A = sightAxis(W,H);
  const back = laneP(LANE.backF,W,H), front = laneP(LANE.frontF,W,H);

  /* ---- LANE PLANE: the corridor floor. A light plane whose two long edges ARE
         the collision boundary of the shooting corridor. ---- */
  if (has("floor")){
    const hwA=LANE.hw*H*back.s, hwB=LANE.hw*H*front.s;
    pen.paint(()=>{
      g.moveTo(back.x + A.nx*hwA,  back.y + A.ny*hwA);
      g.lineTo(front.x+ A.nx*hwB,  front.y+ A.ny*hwB);
      g.lineTo(front.x- A.nx*hwB,  front.y- A.ny*hwB);
      g.lineTo(back.x - A.nx*hwA,  back.y - A.ny*hwA);
      g.closePath();
    }, toneSolid(inkLevel(params.lanePlaneLevel)), params.boundaryLW);

    // archer's stance plate at the near end — kept clear of the sightline so the
    // ruled line has a clean run for the nocked arrow
    const sp=laneP(LANE.stanceF,W,H), ss=sp.s;
    pen.paint(()=>{ g.rect(sp.x-0.036*W*ss, sp.y-0.010*H*ss, 0.072*W*ss, 0.028*H*ss); },
              toneSolid(inkLevel(2)), 4);
    seg(g, sp.x-0.024*W*ss, sp.y+0.004*H*ss, sp.x+0.024*W*ss, sp.y+0.004*H*ss, 4, INK);
    for(const k of [-1,1]) seg(g, sp.x+k*0.036*W*ss, sp.y+0.020*H*ss,
                                  sp.x+k*0.036*W*ss, sp.y+0.036*H*ss, 4, INK);

    // the MARK the ruled line terminates in
    const mk=laneP(LANE.markF,W,H), ms=mk.s, my=mk.y-LANE.eyeRise*H*ms;
    g.save(); g.strokeStyle=INK; g.lineWidth=4.5;
    g.beginPath(); g.arc(mk.x, my, 0.032*W*ms, 0, 7); g.stroke(); g.restore();
    pen.paint(()=>{ g.arc(mk.x, my, 0.013*W*ms, 0, 7); }, toneSolid(inkLevel(5)), 3);
  }

  /* ---- TRENCH: broken between sockets, never one continuous band ---- */
  if (has("trench")){
    for(let i=0;i<LANE.n-1;i++){
      const a=laneP(frac(i),W,H), b=laneP(frac(i+1),W,H);
      const p0={ x:lerp(a.x,b.x,0.30), y:lerp(a.y,b.y,0.30) };
      const p1={ x:lerp(a.x,b.x,0.70), y:lerp(a.y,b.y,0.70) };
      seg(g,p0.x,p0.y,p1.x,p1.y, Math.max(3.5, 7*a.s), inkLevel(params.trenchLevel));
    }
  }

  /* ---- SOCKETS + planting anchors ---- */
  if (has("sockets")){
    for(let i=0;i<LANE.n;i++){
      const b=laneP(frac(i),W,H), s=b.s;
      pen.paint(()=>{ g.ellipse(b.x, b.y, 0.026*W*s, 0.0095*H*s, 0, 0, 7); },
                toneSolid(inkLevel(params.socketLevel)), Math.max(2.5, 3.6*s));
      for(const k of [-1,1]){
        seg(g, b.x + A.nx*0.036*W*s*k, b.y + A.ny*0.036*W*s*k,
               b.x + A.nx*0.054*W*s*k, b.y + A.ny*0.054*W*s*k, Math.max(2.5,3.6*s), INK);
      }
      if (i%4===3){   // station tick every fourth socket
        seg(g, b.x + A.nx*0.056*W*s, b.y + A.ny*0.056*W*s,
               b.x + A.nx*0.090*W*s, b.y + A.ny*0.090*W*s, Math.max(3,4.5*s), INK);
      }
    }
  }

  /* ---- SIGHTLINE, laid BEHIND the heads, running clear past both ends ---- */
  if (sight){
    const a=eyeP(LANE.sightBack,W,H), c=eyeP(LANE.sightFront,W,H);
    seg(g,a.x,a.y,c.x,c.y,5.5,INK);
  }

  /* ---- THE TWELVE AXES, far -> near so the near ones overlap true ---- */
  if (has("axes")){
    for(let i=LANE.n-1;i>=0;i--) drawAxe(pen, g, W, H, frac(i), { sight });
  }

  if (has("arrow")) drawArrow(g, W, H, clamp(arrowQ, LANE.sightBack+0.04, LANE.sightFront-0.02));
  if (has("aperture")) drawAperture(pen, g, W, H, sight);
  if (has("section"))  drawSection(pen, g, W, H, sight);
  if (has("count"))    drawCount(g, W, H);
}

/* ---------------- anchors: every socket + every eye, computed ---------------- */
const ANCHORS = {};
for(let i=0;i<LANE.n;i++){
  const id=String(i+1).padStart(2,"0"), f=frac(i);
  const b=laneN(f), e=eyeN(f);
  ANCHORS[`socket:${id}`] = { x:b.x, y:b.y };
  ANCHORS[`eye:${id}`]    = { x:e.x, y:e.y };
}
ANCHORS["stance:archer"]  = { x:laneN(LANE.stanceF).x,   y:laneN(LANE.stanceF).y };
ANCHORS["mark:target"]    = { x:laneN(LANE.markF).x,     y:eyeN(LANE.markF).y };
ANCHORS["sightline:near"] = { x:eyeN(LANE.sightBack).x,  y:eyeN(LANE.sightBack).y };
ANCHORS["sightline:far"]  = { x:eyeN(LANE.sightFront).x, y:eyeN(LANE.sightFront).y };
ANCHORS["aperture:centre"]= { x:APERTURE.cx, y:APERTURE.cy };
ANCHORS["section:socket"] = { x:0.800, y:0.868 };
ANCHORS["camera:lane"]    = { x:0.500, y:0.440 };

export const asset = {
  id:"set_piece.axe-alignment-lane",
  type:"SET_PIECE",
  name:"Axe alignment lane",
  statusWord:"ALIGNED",
  scene:"OD-B21-S02",

  params,
  layers:["floor","trench","sockets","axes","sightline","arrow","aperture","section","count"],
  anchors:ANCHORS,

  /* collision boundaries / footprints (normalized boxes) */
  zones:{
    lane:     { x0:0.040, y0:0.190, x1:0.955, y1:0.720 },
    trench:   { x0:0.160, y0:0.270, x1:0.900, y1:0.660 },
    stance:   { x0:0.045, y0:0.620, x1:0.180, y1:0.720 },
    mark:     { x0:0.865, y0:0.195, x1:0.960, y1:0.290 },
    aperture: { x0:APERTURE.x0, y0:APERTURE.y0, x1:APERTURE.x1, y1:APERTURE.y1 },
    section:  { x0:SECTION.x0,  y0:SECTION.y0,  x1:SECTION.x1,  y1:SECTION.y1 },
    count:    { x0:0.078, y0:0.775, x1:0.435, y1:0.900 },
  },
  /* flat floor furniture: figures stand behind and beside it, the arrow in front */
  depth:"midground",

  states:{
    initial:"laid",
    nodes:{
      // axes set in their sockets; the line not yet proved
      laid:{ preview:{ layers:["floor","trench","sockets","axes","section","count"],
                       status:"PLANTED", progress:.28 } },
      // the sightline ruled through all twelve eyes; aperture reads clear
      aligned:{ preview:{ layers:["floor","trench","sockets","axes","sightline","aperture","section","count"],
                          status:"ALIGNED", progress:.55 } },
      // the arrow away, mid-lane
      shot:{ preview:{ layers:["floor","trench","sockets","axes","sightline","arrow","aperture","section","count"],
                       arrowQ:0.44, status:"LOOSED", progress:.78 } },
      // through all twelve and into the mark
      passed:{ preview:{ layers:["floor","trench","sockets","axes","sightline","arrow","aperture","section","count"],
                         arrowQ:1.05, status:"PASSED", progress:1 } },
    },
    edges:[["laid","aligned"],["aligned","shot"],["shot","passed"],
           ["passed","aligned"],["aligned","laid"]],
  },
  channels:["align","arrow-travel","reveal","depth","socket-count"],

  preview:()=>({
    layers:["floor","trench","sockets","axes","sightline","arrow","aperture","section","count"],
    arrowQ:-0.075, t:0.6, status:"ALIGNED", progress:.55,
  }),
  draw(ctx,W,H,state){ drawLane(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
