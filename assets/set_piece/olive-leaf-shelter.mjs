/* set_piece.olive-leaf-shelter — the double olive thicket Odysseus crawls into.
   SET_PIECE. Two intertwined olive bushes — one WILD, one CULTIVATED (grafted)
   — grown from a shared root into one dense canopy, with a low crawl-in HOLLOW
   between the twisted trunks and a deep LEAF-LITTER bed on the ground. Drawn as
   a separable environmental component in SOLID grays + hard contour; the engine
   dotify pass supplies the halftone. Declares a crawl-in anchor, placement /
   collision boundaries, a depth layer, and states open / leaf-covered.
   Atlas: OD-B05-S06 — paired wild+cultivated growth, crawl-in, leaf-cover, rain/wind cover. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

/* ---- normalized layout (anchors + draw share these fractions of W,H) ---- */
const L = {
  groundY: 0.845,        // litter / ground line
  crownY:  0.20,         // top of the shared canopy
  hollowX: 0.50,         // crawl-in centre
  hollowTop: 0.525,      // arch springs from here up into the canopy
  hollowHalfW: 0.115,    // half-width of the arched crawl-in mouth
  wildX:  0.335, wildY:  0.335,   // wild bush foliage centre
  cultX:  0.665, cultY:  0.315,   // cultivated bush foliage centre
};

const params = {
  wildClumps: 30, cultClumps: 26,
  leafBed: true,          // deep leaf-litter bed on the ground
  captions: true,         // WILD / TAME tags under each trunk
  swayAmp: 0.006,         // wind channel: canopy sway fraction of W
};

/* ---- small offscreen text (drawn into the source, dotified later) ---- */
function tracked(g, text, x, y, size, track, color){
  g.save(); g.fillStyle=color; g.textBaseline="middle";
  g.font=`800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let cx=x; for(const ch of text){ g.fillText(ch,cx,y); cx+=g.measureText(ch).width+track; }
  g.restore();
}

/* a single olive leaf glyph (narrow lanceolate) */
function leaf(g, x, y, len, ang, tone){
  g.save(); g.translate(x,y); g.rotate(ang);
  g.beginPath(); g.ellipse(0,0,len,len*0.30,0,0,7);
  g.fillStyle=inkLevel(tone); g.fill();
  g.strokeStyle=INK; g.lineWidth=1.4; g.stroke();
  g.beginPath(); g.moveTo(-len*0.85,0); g.lineTo(len*0.85,0); g.stroke();
  g.restore();
}

/* a tapered, gently-curved trunk/branch as a filled contoured polygon */
function taperBranch(pen, g, pts, w0, w1, tone){
  const n=pts.length, left=[], right=[];
  for(let i=0;i<n;i++){
    const p=pts[i], a=pts[Math.max(0,i-1)], b=pts[Math.min(n-1,i+1)];
    let nx=-(b.y-a.y), ny=(b.x-a.x); const d=Math.hypot(nx,ny)||1; nx/=d; ny/=d;
    const w=lerp(w0,w1,i/(n-1))/2;
    left.push({x:p.x+nx*w,y:p.y+ny*w}); right.push({x:p.x-nx*w,y:p.y-ny*w});
  }
  pen.paint(()=>{
    g.moveTo(left[0].x,left[0].y);
    for(let i=1;i<n;i++) g.lineTo(left[i].x,left[i].y);
    for(let i=n-1;i>=0;i--) g.lineTo(right[i].x,right[i].y);
    g.closePath();
  }, toneSolid(inkLevel(tone)), 4);
}
function quadPts(x0,y0,cx,cy,x1,y1,steps){
  const a=[]; for(let i=0;i<=steps;i++){ const t=i/steps;
    a.push({ x:lerp(lerp(x0,cx,t),lerp(cx,x1,t),t), y:lerp(lerp(y0,cy,t),lerp(cy,y1,t),t) }); }
  return a;
}

/* a bushy foliage mass: overlapping contoured clumps read as leaf-scallops.
   `dark` sprinkles shadow pockets; `stragglers` push a few clumps past the
   dome edge so the WILD bush reads scruffier than the CULTIVATED one. */
function bushMass(pen, g, o){
  const rand=rnd(o.seed), items=[];
  for(let i=0;i<o.n;i++){
    const ang=rand()*Math.PI*2, rr=Math.pow(rand(),0.55);
    let px=o.cx+Math.cos(ang)*o.rx*rr, py=o.cy+Math.sin(ang)*o.ry*rr;
    if(o.stragglers && rand()<0.16){ px+=Math.cos(ang)*o.rx*0.35; py+=Math.sin(ang)*o.ry*0.35; }
    const r=lerp(o.minR,o.maxR,rand());
    const tone = rand()<o.darkP ? o.dark : (rand()<0.22 ? o.base-1 : o.base);
    items.push({ px, py, r, tone, sway:rand()*6.28 });
  }
  items.sort((a,b)=> b.r - a.r);   // big clumps behind, small in front -> depth
  for(const c of items){
    const dx=Math.sin((o.t||0)+c.sway)*o.swayPx;
    pen.paint(()=>{ g.arc(c.px+dx, c.py, c.r, 0, 7); }, toneSolid(inkLevel(clamp(c.tone,1,7))), 4);
  }
}

function drawShelter(ctx, W, H, st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx, t=st.t||0;
  const layers = st.layers || ["ground","hollow","trunks","canopy-back","canopy","leaf-bed","leaves"];
  const has=l=>layers.includes(l);
  const covered = layers.includes("leaf-cover") || st.covered;
  const swayPx = params.swayAmp*W;

  const gy=L.groundY*H, hx=L.hollowX*W, hw=L.hollowHalfW*W;
  const archTop=L.hollowTop*H, spring=0.685*H;

  // ---- GROUND band (lightest -> reads as open earth) ----
  if(has("ground")){
    g.fillStyle=inkLevel(1); g.fillRect(0,gy,W,H-gy);
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.32; g.lineWidth=2;
    for(let i=0;i<5;i++){ const y=gy+(H-gy)*(0.2+0.18*i); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.restore();
  }

  // ---- HOLLOW: the dark crawl-in recess between the trunks ----
  if(has("hollow")){
    const arch=(inset,tone)=>{
      const w=hw-inset, top=archTop*(1)+inset*0.9, sp=spring;
      pen.paint(()=>{
        g.moveTo(hx-w, gy);
        g.lineTo(hx-w, sp);
        g.quadraticCurveTo(hx-w, top, hx, top);
        g.quadraticCurveTo(hx+w, top, hx+w, sp);
        g.lineTo(hx+w, gy); g.closePath();
      }, toneSolid(inkLevel(tone)), 4);
    };
    arch(0, 5);                      // recess rim
    arch(W*0.030, 6);                // deeper darkness within
    // a couple of faint recess lines so the dark reads as depth, not a blob
    g.save(); g.strokeStyle=inkLevel(2); g.lineWidth=2; g.globalAlpha=0.6;
    for(let i=1;i<=2;i++){ const w=hw-W*0.030-i*W*0.020;
      g.beginPath(); g.moveTo(hx-w, gy); g.lineTo(hx-w, spring);
      g.quadraticCurveTo(hx-w, archTop+i*W*0.02, hx, archTop+i*W*0.02); g.stroke(); }
    g.restore();
  }

  // ---- TRUNKS: two twisted trunks growing from a shared root, intertwining ----
  if(has("trunks")){
    // wild trunk (left): crooked, crosses toward centre, mid bark tone
    taperBranch(pen, g,
      quadPts(0.30*W, gy, 0.27*W, 0.60*H, 0.44*W, 0.40*H, 12),
      W*0.046, W*0.022, 4);
    // a wild side-branch kicking out
    taperBranch(pen, g,
      quadPts(0.36*W, 0.58*H, 0.22*W, 0.50*H, 0.18*W, 0.40*H, 8),
      W*0.026, W*0.011, 4);
    // cultivated trunk (right): straighter, tended, leans to meet the wild one
    taperBranch(pen, g,
      quadPts(0.70*W, gy, 0.73*W, 0.60*H, 0.56*W, 0.40*H, 12),
      W*0.044, W*0.020, 3);
    // bark seams on the trunks so the mid tone reads as wood, not a slab
    g.save(); g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    g.beginPath(); g.moveTo(0.31*W,gy); g.quadraticCurveTo(0.30*W,0.60*H,0.43*W,0.42*H); g.stroke();
    g.beginPath(); g.moveTo(0.69*W,gy); g.quadraticCurveTo(0.72*W,0.60*H,0.565*W,0.42*H); g.stroke();
    g.restore();
    // the graft/intertwine knot where they cross
    pen.paint(()=>{ g.ellipse(0.50*W, 0.445*H, W*0.040, H*0.026, 0.3, 0, 7); }, toneSolid(inkLevel(4)), 4);
  }

  // ---- CANOPY-BACK: darker distant foliage giving the dome its depth ----
  if(has("canopy-back")){
    bushMass(pen, g, { cx:L.wildX*W, cy:(L.wildY+0.05)*H, rx:0.20*W, ry:0.16*H,
      n:12, minR:W*0.07, maxR:W*0.11, base:5, dark:6, darkP:0.5, seed:2201, t, swayPx:swayPx*0.5 });
    bushMass(pen, g, { cx:L.cultX*W, cy:(L.cultY+0.05)*H, rx:0.18*W, ry:0.15*H,
      n:11, minR:W*0.07, maxR:W*0.11, base:4, dark:5, darkP:0.4, seed:3307, t, swayPx:swayPx*0.5 });
  }

  // ---- CANOPY: the two bushes woven into one dense cover over the hollow ----
  if(has("canopy")){
    // WILD bush — scruffier, darker, with stragglers poking past the dome
    bushMass(pen, g, { cx:L.wildX*W, cy:L.wildY*H, rx:0.245*W, ry:0.215*H,
      n:params.wildClumps, minR:W*0.045, maxR:W*0.098, base:4, dark:5, darkP:0.24,
      stragglers:true, seed:1013, t, swayPx });
    // CULTIVATED bush — rounder, more uniform mid tone, tended
    bushMass(pen, g, { cx:L.cultX*W, cy:L.cultY*H, rx:0.225*W, ry:0.20*H,
      n:params.cultClumps, minR:W*0.052, maxR:W*0.092, base:3, dark:4, darkP:0.18,
      stragglers:false, seed:5077, t, swayPx });
    // a woven crown clump bridging the two heads -> reads as intertwined
    bushMass(pen, g, { cx:0.50*W, cy:L.crownY*H, rx:0.13*W, ry:0.08*H,
      n:8, minR:W*0.05, maxR:W*0.085, base:3, dark:5, darkP:0.3, seed:9001, t, swayPx });
    // scatter a few individual leaves along the lower fringe over the mouth
    const lr=rnd(444);
    for(let i=0;i<14;i++){
      const x=hx+(lr()-0.5)*hw*2.1, y=archTop*H/H*0 + (0.50+lr()*0.06)*H;
      leaf(g, x, y, W*0.028, (lr()-0.5)*2.2, lr()<0.4?5:3);
    }
  }

  // ---- LEAF-BED: the deep litter Odysseus heaps a bed from ----
  if(has("leaf-bed") && params.leafBed){
    // a tall lighter litter mound heaped over the base of the mouth so the
    // bottom reads as a leaf BED, not a continuation of the dark hollow
    pen.paint(()=>{ g.ellipse(hx, gy+H*0.006, hw*1.55, H*0.085, 0, Math.PI, 0); g.closePath(); },
      toneSolid(inkLevel(2)), 4);
    pen.paint(()=>{ g.ellipse(hx, gy-H*0.030, hw*1.15, H*0.070, 0, Math.PI, 0); g.closePath(); },
      toneSolid(inkLevel(3)), 4);
    // strewn leaves piled on the bed (light so they pop off the dark hollow)
    const lr=rnd(777);
    for(let i=0;i<40;i++){
      const x=hx+(lr()-0.5)*hw*2.9, y=gy-lr()*H*0.085;
      leaf(g, x, y, W*0.028, (lr()-0.5)*3.1, lr()<0.3?4:1);
    }
  }

  // ---- LEAF-COVER (state): litter heaped up INTO the mouth, hiding the dark ----
  if(covered){
    // fill the hollow with a heap of leaf clumps
    bushMass(pen, g, { cx:hx, cy:0.72*H, rx:hw*0.95, ry:H*0.11,
      n:16, minR:W*0.045, maxR:W*0.08, base:2, dark:4, darkP:0.35, seed:6161, t:0, swayPx:0 });
    const lr=rnd(2323);
    for(let i=0;i<40;i++){
      const x=hx+(lr()-0.5)*hw*1.9, y=(0.60+lr()*0.24)*H;
      leaf(g, x, y, W*0.027, (lr()-0.5)*3.1, lr()<0.3?4:2);
    }
  }

  // ---- CAPTIONS: WILD / TAME tags identifying the two stocks ----
  if(params.captions && has("ground")){
    tracked(g, "WILD", 0.20*W, gy+H*0.075, W*0.030, W*0.006, INK);
    tracked(g, "TAME", 0.72*W, gy+H*0.075, W*0.030, W*0.006, INK);
    // a small blue tick under the crawl-in mouth
    g.fillStyle=ACCENT; g.fillRect(hx-W*0.012, gy+H*0.052, W*0.024, H*0.006);
  }
}

export const asset = {
  id:"set_piece.olive-leaf-shelter",
  type:"SET_PIECE",
  name:"Olive Leaf Shelter",
  statusWord:"SHELTER",
  scene:"OD-B05-S06",

  params,
  // back -> front depth layers; scene state can pass a subset / add leaf-cover
  layers:["ground","hollow","trunks","canopy-back","canopy","leaf-bed","leaves"],
  // normalized 0..1 placement / contact / camera anchors
  anchors:{
    "crawl-in:mouth":   { x:L.hollowX, y:0.74 },   // where a figure crawls in
    "bed:center":       { x:L.hollowX, y:0.82 },   // the leaf bed
    "trunk:wild":       { x:0.315, y:L.groundY },
    "trunk:cultivated": { x:0.685, y:L.groundY },
    "graft:knot":       { x:0.50, y:0.455 },
    "canopy:crown":     { x:0.50, y:L.crownY },
    "approach:front":   { x:0.50, y:0.94 },
    "camera:wide":      { x:0.50, y:0.50 },
  },
  // collision boundaries + walkable approach (normalized boxes)
  zones:{
    footprint: { x0:0.10, y0:0.62, x1:0.90, y1:0.86 },   // solid bush base
    hollow:    { x0:L.hollowX-L.hollowHalfW, y0:0.525, x1:L.hollowX+L.hollowHalfW, y1:0.845 },
    bed:       { x0:0.30, y0:0.80, x1:0.70, y1:0.90 },
    approach:  { x0:0.16, y0:0.88, x1:0.84, y1:0.98 },
  },
  states:{
    initial:"open",
    nodes:{
      // mouth open, dark hollow, bed heaped beside it — before he burrows in
      open:{ preview:{ layers:["ground","hollow","trunks","canopy-back","canopy","leaf-bed","leaves"],
        status:"OPEN", progress:.30 } },
      // litter heaped into the mouth — Odysseus buried, hidden from wind & rain
      "leaf-covered":{ preview:{ layers:["ground","hollow","trunks","canopy-back","canopy","leaf-bed","leaf-cover"],
        covered:true, status:"COVERED", progress:.95 } },
      // wind test — canopy sway animates over t
      windblown:{ preview:{ layers:["ground","hollow","trunks","canopy-back","canopy","leaf-bed","leaves"],
        t:1.4, status:"WINDBLOWN", progress:.55 } },
    },
    edges:[["open","leaf-covered"],["open","windblown"],["windblown","leaf-covered"]],
  },
  channels:["reveal","cover","wind","rustle"],

  preview:()=>({
    layers:["ground","hollow","trunks","canopy-back","canopy","leaf-bed","leaves"],
    t:0.2, status:"SHELTER", progress:.34,
  }),
  draw(ctx,W,H,state){ drawShelter(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
