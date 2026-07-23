/* set_piece.royal-hearth — the great central hall hearth of a palace.
   SET_PIECE. A raised circular STONE FIRE-RING sunk into the hall floor: a
   masonry drum with a ringed stone rim, a pale ASH BED inside, and FIRE rising
   from it. Before it, a low SUPPLICATION SLAB where a guest kneels in the ashes;
   a short RISE-ASSIST post beside it to be helped up by; and a GUEST-SEAT (a
   klismos chair) set to one side for the transition from suppliant to guest.
   Drawn as a separable architectural component in SOLID grays + hard contour;
   the engine dotify pass supplies the halftone. States lit / embers. Declares
   placement/collision, kneel + rise-assist + seat anchors, and a depth layer.
   Atlas: OD-B07-S03 — fire, ash bed, kneeling area, rise-assist anchor, guest-seat transition. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

/* ---- normalized layout (anchors + draw share these fractions of W,H) ---- */
const L = {
  groundY: 0.870,     // hall floor line
  hearthX: 0.46,      // fire-ring centre
  rimCy:   0.545,     // top-rim ellipse centre y
  rimRx:   0.215,     // *W  outer rim radius (x)
  rimRy:   0.074,     // *H  outer rim radius (y, perspective squash)
  drumH:   0.120,     // *H  masonry drum height (front face)
  ashK:    0.60,      // ash bed radius as fraction of rim radius
  seatX:   0.790, seatY: 0.795,   // guest-seat (klismos) beside the hearth
  kneelX:  0.450, kneelY: 0.815,  // supplication slab in front
  postX:   0.300, postY: 0.815,   // rise-assist post, left-front of the kneel spot
};

const params = {
  ringStones: 15,     // masonry blocks around the rim
  flameTongues: 7,
  flameMaxH: 0.235,   // *H  tallest tongue when lit
  hallPillars: true,  // faint flanking hall columns for context
  captions: true,     // HEARTH / GUEST tags
};

/* ---------- geometry helpers ---------- */
function arcPts(cx, cy, rx, ry, a0, a1, steps){
  const a=[]; for(let i=0;i<=steps;i++){ const t=a0+(a1-a0)*i/steps;
    a.push({ x:cx+Math.cos(t)*rx, y:cy+Math.sin(t)*ry }); } return a;
}
function tracked(g, text, x, y, size, track, color){
  g.save(); g.fillStyle=color; g.textBaseline="middle";
  g.font=`800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let cx=x; for(const ch of text){ g.fillText(ch,cx,y); cx+=g.measureText(ch).width+track; }
  g.restore();
}

/* one rising flame tongue as a filled contoured teardrop */
function flameTongue(pen, g, fx, baseY, bw, h, sway, tone){
  pen.paint(()=>{
    g.moveTo(fx-bw, baseY);
    g.quadraticCurveTo(fx-bw*0.85, baseY-h*0.55, fx+sway, baseY-h);
    g.quadraticCurveTo(fx+bw*0.85, baseY-h*0.55, fx+bw, baseY);
    g.quadraticCurveTo(fx, baseY+bw*0.35, fx-bw, baseY);
    g.closePath();
  }, toneSolid(inkLevel(tone)), 3);
}

/* ---------- the set ---------- */
function drawHearth(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx, t = st.t||0;
  const lit = st.lit !== false;                 // default lit
  const layers = st.layers || ["hall","floor","drum","rim","ashbed","fire","smoke","slab","post","seat"];
  const has = l => layers.includes(l);

  const gy = L.groundY*H;
  const cx = L.hearthX*W, cy = L.rimCy*H;
  const rx = L.rimRx*W, ry = L.rimRy*H;
  const drumH = L.drumH*H;
  const ashRx = rx*L.ashK, ashRy = ry*L.ashK;

  // ---- HALL context: faint flanking pillars + back shadow (lightest) ----
  if (has("hall") && params.hallPillars){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,gy);
    for (const px of [0.10, 0.90]){
      const x = px*W, pw = W*0.055, top = H*0.10, bot = gy;
      pen.paint(()=>{ g.rect(x-pw/2, top, pw, bot-top); }, toneSolid(inkLevel(2)), 4);
      pen.paint(()=>{ g.rect(x-pw*0.72, top, pw*1.44, H*0.028); }, toneSolid(inkLevel(3)), 4); // capital
      pen.paint(()=>{ g.rect(x-pw*0.80, bot-H*0.024, pw*1.60, H*0.024); }, toneSolid(inkLevel(3)), 4); // base
    }
  }

  // ---- FLOOR: paved hall floor (light so it reads as ground) ----
  if (has("floor")){
    g.fillStyle = inkLevel(2); g.fillRect(0, gy, W, H-gy);
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.30; g.lineWidth=2;
    for (let i=1;i<=4;i++){ const y=gy+(H-gy)*(i/5)*(i/5)+ (H-gy)*0.06;
      g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    for (let i=-4;i<=4;i++){ g.beginPath(); g.moveTo(cx, gy); g.lineTo(cx+i*W*0.14, H); g.stroke(); }
    g.restore();
  }

  // ---- DRUM: the masonry cylinder of the fire-ring (front face) ----
  if (has("drum")){
    const front = [
      {x:cx-rx, y:cy},
      {x:cx-rx, y:cy+drumH},
      ...arcPts(cx, cy+drumH, rx, ry, Math.PI, Math.PI*2, 22),  // bottom arc left->right
      {x:cx+rx, y:cy},
      ...arcPts(cx, cy, rx, ry, 0, Math.PI, 22),                // top front arc right->left
    ];
    pen.paint(()=>{ g.moveTo(front[0].x,front[0].y); for(let i=1;i<front.length;i++) g.lineTo(front[i].x,front[i].y); g.closePath(); },
      toneSolid(inkLevel(5)), 5);
    // vertical masonry seams on the drum face
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.55; g.lineWidth=2.4;
    for (let i=-3;i<=3;i++){ const a=Math.PI/2 + i*0.42; const sx=cx+Math.cos(a)*rx, sy=cy+Math.sin(a)*ry;
      if (Math.sin(a) < 0.02) continue; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx, sy+drumH*(0.6+0.4*Math.abs(Math.sin(a)))); g.stroke(); }
    // a course line partway down
    g.beginPath();
    const cl = arcPts(cx, cy+drumH*0.55, rx, ry, 0, Math.PI, 24);
    g.moveTo(cl[0].x,cl[0].y); for(const p of cl) g.lineTo(p.x,p.y); g.stroke();
    g.restore();
  }

  // ---- RIM: the raised stone fire-ring (ring of blocks around the top) ----
  if (has("rim")){
    // outer rim ellipse (stone)
    pen.paint(()=>{ g.ellipse(cx, cy, rx, ry, 0, 0, 7); }, toneSolid(inkLevel(4)), 5);
    // inner ash mouth cut out
    pen.paint(()=>{ g.ellipse(cx, cy, ashRx, ashRy, 0, 0, 7); }, toneSolid(inkLevel(2)), 4);
    // radial block seams from ash edge to outer edge -> reads as masonry ring
    g.save(); g.strokeStyle=INK; g.lineWidth=2.2; g.globalAlpha=0.6;
    for (let i=0;i<params.ringStones;i++){
      const a=(i/params.ringStones)*Math.PI*2;
      const ix=cx+Math.cos(a)*ashRx, iy=cy+Math.sin(a)*ashRy;
      const ox=cx+Math.cos(a)*rx,    oy=cy+Math.sin(a)*ry;
      g.beginPath(); g.moveTo(ix,iy); g.lineTo(ox,oy); g.stroke();
    }
    g.restore();
    // a few darker capstones on the near front edge for weight
    for (let i=0;i<params.ringStones;i++){
      if (i%3!==0) continue;
      const a=(i/params.ringStones)*Math.PI*2; if (Math.sin(a)<0.15) continue;
      const a2=((i+1)/params.ringStones)*Math.PI*2;
      pen.paint(()=>{
        g.moveTo(cx+Math.cos(a)*ashRx, cy+Math.sin(a)*ashRy);
        g.lineTo(cx+Math.cos(a)*rx,   cy+Math.sin(a)*ry);
        g.lineTo(cx+Math.cos(a2)*rx,  cy+Math.sin(a2)*ry);
        g.lineTo(cx+Math.cos(a2)*ashRx,cy+Math.sin(a2)*ashRy);
        g.closePath();
      }, toneSolid(inkLevel(5)), 2);
    }
  }

  // ---- ASH BED: pale ash inside the ring, with darker ash pockets ----
  if (has("ashbed")){
    pen.paint(()=>{ g.ellipse(cx, cy, ashRx, ashRy, 0, 0, 7); }, toneSolid(inkLevel(2)), 3);
    const ar=rnd(1717);
    for (let i=0;i<10;i++){
      const a=ar()*Math.PI*2, rr=Math.sqrt(ar())*0.8;
      const px=cx+Math.cos(a)*ashRx*rr, py=cy+Math.sin(a)*ashRy*rr;
      pen.fillPath(()=>{ g.ellipse(px,py, ashRx*0.16, ashRy*0.20, 0,0,7); }, inkLevel(ar()<0.5?3:1));
    }
    // rim shadow inside the mouth (far edge darker)
    g.save(); g.globalAlpha=0.5; g.strokeStyle=inkLevel(4); g.lineWidth=3;
    g.beginPath(); const sh=arcPts(cx,cy-ashRy*0.05,ashRx*0.94,ashRy*0.94,Math.PI,Math.PI*2,20);
    g.moveTo(sh[0].x,sh[0].y); for(const p of sh) g.lineTo(p.x,p.y); g.stroke(); g.restore();
  }

  // ---- FIRE: tall flames when lit, low coals when embers ----
  if (has("fire")){
    const baseY = cy + ashRy*0.35;
    const fr = rnd(909);
    if (lit){
      const n=params.flameTongues, maxH=params.flameMaxH*H, spread=ashRx*0.92;
      const order=[];
      for (let i=0;i<n;i++){
        const u=i/(n-1)-0.5;                         // -0.5..0.5
        const centreBias=1-Math.abs(u)*1.5;          // taller in the middle
        const flick=0.82+0.18*Math.sin(t*3.1+i*1.7);
        order.push({ i, fx:cx+u*spread*2, bw:lerp(ashRx*0.30,ashRx*0.16,Math.abs(u)*2),
          h:maxH*clamp(0.42+0.58*centreBias,0.3,1)*flick, sway:Math.sin(t*2.3+i)*W*0.012,
          tone: Math.abs(u)>0.28?5:4 });
      }
      // outer/darker tongues first, bright inner licks last
      order.sort((a,b)=> a.h-b.h);
      for (const f of order) flameTongue(pen,g,f.fx,baseY,f.bw,f.h,f.sway,f.tone);
      // a couple of bright inner licks (light -> few dots -> reads as heat)
      flameTongue(pen,g,cx-ashRx*0.15,baseY,ashRx*0.14,maxH*0.55*(0.9+0.1*Math.sin(t*4)),0,2);
      flameTongue(pen,g,cx+ashRx*0.18,baseY,ashRx*0.13,maxH*0.5*(0.9+0.1*Math.cos(t*4)),0,2);
    } else {
      // EMBERS: low glowing mound of coals + a few short licks
      pen.paint(()=>{ g.ellipse(cx, baseY, ashRx*0.82, ashRy*0.7, 0, Math.PI, 0); g.closePath(); },
        toneSolid(inkLevel(5)), 3);
      for (let i=0;i<16;i++){
        const u=(fr()-0.5)*1.6; const px=cx+u*ashRx*0.8, py=baseY-fr()*ashRy*0.5;
        pen.fillPath(()=>{ g.arc(px,py, ashRx*lerp(0.06,0.12,fr()), 0,7); }, inkLevel(fr()<0.35?2:6));
      }
      // three tiny licks
      for (const dx of [-0.25,0.05,0.30]) flameTongue(pen,g,cx+dx*ashRx,baseY,ashRx*0.09,params.flameMaxH*H*0.16,0,3);
    }
  }

  // ---- SMOKE: a faint wisp rising (lit only) ----
  if (has("smoke") && lit){
    g.save(); g.strokeStyle=inkLevel(2); g.lineWidth=W*0.02; g.lineCap="round"; g.globalAlpha=0.7;
    g.beginPath(); const sy=cy-params.flameMaxH*H*0.9;
    g.moveTo(cx, sy);
    g.quadraticCurveTo(cx+W*0.05, sy-H*0.06, cx-W*0.02, sy-H*0.12);
    g.quadraticCurveTo(cx-W*0.06, sy-H*0.17, cx+W*0.02, sy-H*0.23);
    g.stroke(); g.restore();
  }

  // ---- SUPPLICATION SLAB: low hearthstone + ash mat where a guest kneels ----
  if (has("slab")){
    const kx=L.kneelX*W, kyy=L.kneelY*H, sw=W*0.19, sh=H*0.038;
    // stone slab (perspective ellipse) set into the floor
    pen.paint(()=>{ g.ellipse(kx, kyy, sw, sh, 0, 0, 7); }, toneSolid(inkLevel(4)), 4);
    pen.paint(()=>{ g.ellipse(kx, kyy, sw*0.72, sh*0.72, 0, 0, 7); }, toneSolid(inkLevel(3)), 3); // ash-dusted centre
    // scored kneel-marks in the ash
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.5; g.lineWidth=2;
    for (let i=-2;i<=2;i++){ g.beginPath(); g.moveTo(kx+i*sw*0.20, kyy-sh*0.4); g.lineTo(kx+i*sw*0.20, kyy+sh*0.4); g.stroke(); }
    g.restore();
  }

  // ---- RISE-ASSIST POST: a short stone baluster to be helped up by ----
  if (has("post")){
    const px=L.postX*W, py=L.postY*H, pw=W*0.032, ph=H*0.105;
    pen.paint(()=>{ g.rect(px-pw*0.85, py-H*0.014, pw*1.7, H*0.014); }, toneSolid(inkLevel(5)), 4); // base
    pen.paint(()=>{ g.rect(px-pw/2, py-ph, pw, ph); }, toneSolid(inkLevel(3)), 4);        // light shaft -> separates from drum
    pen.paint(()=>{ g.ellipse(px, py-ph, pw*1.05, pw*0.55, 0, 0, 7); }, toneSolid(inkLevel(5)), 4); // rounded grip cap
    pen.seam(()=>{ g.moveTo(px-pw/2, py-ph*0.55); g.lineTo(px+pw/2, py-ph*0.55); }, 2);
    pen.seam(()=>{ g.moveTo(px-pw/2, py-ph*0.30); g.lineTo(px+pw/2, py-ph*0.30); }, 2);
  }

  // ---- GUEST-SEAT: a klismos chair set beside the hearth ----
  if (has("seat")){
    const sx=L.seatX*W, syy=L.seatY*H;            // syy = seat-top height
    const seatW=W*0.135, seatT=H*0.014, legH=H*0.115, lw=W*0.020;
    const backTopY=syy-H*0.135;
    const legTone=toneSolid(inkLevel(5));
    // curved splayed klismos back-posts (two, rising from the seat back edge)
    const backPost=(bx0,bx1,tone)=>pen.paint(()=>{
      g.moveTo(bx0-lw*0.5, syy);
      g.quadraticCurveTo(bx0-W*0.03, backTopY+H*0.02, bx1-lw*0.4, backTopY);
      g.lineTo(bx1+lw*0.4, backTopY);
      g.quadraticCurveTo(bx0+W*0.01, backTopY+H*0.03, bx0+lw*0.5, syy);
      g.closePath();
    }, toneSolid(inkLevel(tone)), 4);
    backPost(sx-seatW*0.36, sx-seatW*0.30, 4);
    // crest rail across the top of the back
    pen.paint(()=>{ g.rect(sx-seatW*0.46, backTopY-H*0.006, seatW*0.44, H*0.020); }, toneSolid(inkLevel(5)), 4);
    // back legs (behind the seat, recede)
    pen.paint(()=>{ g.rect(sx-seatW*0.30, syy, lw*0.85, legH*0.9); }, legTone, 4);
    pen.paint(()=>{ g.rect(sx+seatW*0.34, syy, lw*0.85, legH*0.85); }, legTone, 4);
    // seat slab (perspective top + front edge)
    pen.paint(()=>{ g.ellipse(sx, syy, seatW*0.5, seatT*2.2, 0, 0, 7); }, toneSolid(inkLevel(3)), 4);
    pen.paint(()=>{ g.rect(sx-seatW*0.5, syy, seatW, seatT*2.0); }, toneSolid(inkLevel(4)), 4);
    pen.seam(()=>{ g.moveTo(sx-seatW*0.46, syy+seatT*1.0); g.lineTo(sx+seatW*0.46, syy+seatT*1.0); }, 2);
    // front legs (splayed, near viewer, darker)
    pen.paint(()=>{ g.rect(sx-seatW*0.44, syy+seatT*1.8, lw, legH); }, toneSolid(inkLevel(6)), 4);
    pen.paint(()=>{ g.rect(sx+seatW*0.36, syy+seatT*1.8, lw, legH); }, toneSolid(inkLevel(6)), 4);
  }

  // ---- CAPTIONS + blue tick ----
  if (params.captions && has("floor")){
    tracked(g, "HEARTH", cx-W*0.06, gy+H*0.058, W*0.028, W*0.006, INK);
    tracked(g, "GUEST",  L.seatX*W-W*0.045, L.seatY*H+H*0.088, W*0.024, W*0.005, INK);
    g.fillStyle=ACCENT; g.fillRect(L.kneelX*W-W*0.012, L.kneelY*H+H*0.030, W*0.024, H*0.006);
  }
}

export const asset = {
  id:"set_piece.royal-hearth",
  type:"SET_PIECE",
  name:"Royal Hearth",
  statusWord:"LIT",
  scene:"OD-B07-S03",

  params,
  // back -> front depth layers; scene state can pass a subset
  layers:["hall","floor","drum","rim","ashbed","fire","smoke","slab","post","seat"],
  // normalized 0..1 placement / contact / camera anchors
  anchors:{
    "hearth:center":   { x:L.hearthX, y:L.rimCy },
    "fire:base":       { x:L.hearthX, y:0.615 },
    "ash:bed":         { x:L.hearthX, y:0.605 },
    "kneel:spot":      { x:L.kneelX,  y:L.kneelY },
    "rise-assist":     { x:L.postX,   y:0.710 },     // grip cap of the post
    "seat:guest":      { x:L.seatX,   y:L.seatY-0.06 },
    "approach:front":  { x:L.hearthX, y:0.965 },
    "camera:wide":     { x:0.50, y:0.50 },
    "camera:hearth":   { x:L.hearthX, y:0.62 },
  },
  // collision boundaries + walkable approach (normalized boxes)
  zones:{
    footprint: { x0:L.hearthX-L.rimRx, y0:L.rimCy-L.rimRy, x1:L.hearthX+L.rimRx, y1:L.rimCy+L.drumH+L.rimRy }, // solid drum
    kneel:     { x0:L.kneelX-0.10, y0:0.78, x1:L.kneelX+0.10, y1:0.85 },
    seat:      { x0:L.seatX-0.09, y0:0.70, x1:L.seatX+0.09, y1:0.90 },
    approach:  { x0:0.16, y0:0.90, x1:0.84, y1:0.99 },
  },
  states:{
    initial:"lit",
    nodes:{
      // full fire in the ring — the hall ablaze, guest kneels in the ashes
      lit:{ preview:{ lit:true, t:0.4,
        layers:["hall","floor","drum","rim","ashbed","fire","smoke","slab","post","seat"],
        status:"LIT", progress:.72 } },
      // banked down to glowing coals — late in the night, guest now seated
      embers:{ preview:{ lit:false, t:0,
        layers:["hall","floor","drum","rim","ashbed","fire","slab","post","seat"],
        status:"EMBERS", progress:.28 } },
    },
    edges:[["lit","embers"],["embers","lit"]],
  },
  channels:["fire","flicker","light","reveal"],

  preview:()=>({
    lit:true, t:0.4,
    layers:["hall","floor","drum","rim","ashbed","fire","smoke","slab","post","seat"],
    status:"LIT", progress:.72,
  }),
  draw(ctx,W,H,state){ drawHearth(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
