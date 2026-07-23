/* ensemble.dispersing-assembly — a gathered crowd coming apart.
   ENSEMBLE asset. Scene function (OD-B02-S04): an assembly that has just
   broken up, its people streaming away in SEPARATE FLOWS toward the farms
   (fore-left), the town (back-center, receding), and the palace (fore-right)
   — caught mid-scatter, WITHOUT RESOLUTION: the streams are strung out and
   staggered, nobody has arrived. Built from ONE separable member template
   (drawWalker) instanced N times deterministically. Exposes a FORMATION
   channel (streams | scatter | cluster), disperse (0 gathered .. 1 gone),
   spread (stream width), and a wave (how much the tail of each stream lags).
   Drawn in SOLID grays + hard contour; the engine dotify pass supplies the
   halftone. Destinations are drawn only as small landmark icons — no named
   characters are baked in. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"streams",   // streams | scatter | cluster
  disperse:0.55,         // 0 = still gathered at the origin .. 1 = all reached edges
  spread:1.0,            // lateral width of each flow (0 tight .. 1.5 loose)
  wave:0.8,              // how much the tail of each stream LAGS the head
  counts:[6,6,6],        // members per flow: [farms, town, palace]
  originX:0.50,          // where the assembly stood
  originY:0.60,
  showPaths:true,        // faint fanning flow lines from origin to the three poles
  showLandmarks:true,    // the three destination icons
};

/* three destinations the crowd breaks toward. Town recedes (small, high);
   farms and palace come forward to the flanks (large, low). Landmark icons
   sit slightly beyond each travel pole so they read behind the streams. */
const DEST = {
  farms:  { x:0.11, y:0.78 },   // fore-left
  town:   { x:0.50, y:0.44 },   // back-center (recedes most)
  palace: { x:0.89, y:0.77 },   // fore-right
};
const MARK = {
  farms:  { x:0.11, y:0.55 },   // above the left-flank stream
  town:   { x:0.50, y:0.34 },   // a skyline above the receding stream
  palace: { x:0.92, y:0.64 },   // a gate on the right flank
};
const FLOW_KEYS = ["farms","town","palace"];

/* scale from vertical position: high on canvas = far = small. */
function scaleForY(H, y){ return lerp(58, 138, clamp01((y/H - 0.34)/(0.86-0.34))); }

/* -------- ONE member template: a robed figure walking away --------
   dir in -1..1 aims the stride + face toward travel. |dir|<0.28 reads as a
   back view (walking straight away) — no face, just the back of the head.
   phase drives the stride swing; feat carries deterministic identity. */
function drawWalker(pen, cx, baseY, s, dir, phase, shade, feat){
  const g = pen.ctx;
  const robe = toneSolid(inkLevel(shade.robe));
  const skin = toneSolid(inkLevel(shade.skin));
  const dark = toneSolid(inkLevel(shade.hair));

  const back    = Math.abs(dir) < 0.28;
  const legLen  = s*0.34;
  const hipY    = baseY - legLen;
  const shoY    = hipY - s*0.30;
  const shoTop  = s*0.15;
  const hipTop  = s*0.12;
  const headR   = s*0.105*feat.headS;
  const headCy  = shoY - headR*1.05;
  const lw      = Math.max(2, s*0.03);

  // stride: front foot advances in the travel direction
  const sw = Math.sin(phase)*legLen*0.32;
  const stepF = (back ? Math.abs(sw) : dir*sw);
  const stepB = -stepF*0.7;
  const legT  = toneSolid(inkLevel(shade.leg));
  pen.limb(()=>{ g.moveTo(cx, hipY); g.lineTo(cx+stepB, baseY); }, legT, Math.max(3,s*0.045)); // back leg
  // robe: trapezoid torso, shoulders -> hips
  pen.paint(()=>{
    g.moveTo(cx-shoTop, shoY);
    g.lineTo(cx+shoTop, shoY);
    g.lineTo(cx+hipTop, hipY+s*0.02);
    g.lineTo(cx-hipTop, hipY+s*0.02);
    g.closePath();
  }, robe, lw);
  // a single hem/drape seam that leans with travel
  pen.seam(()=>{ g.moveTo(cx+dir*s*0.02, shoY+s*0.04); g.lineTo(cx-dir*s*0.03, hipY); }, Math.max(2,s*0.02));
  pen.limb(()=>{ g.moveTo(cx, hipY); g.lineTo(cx+stepF, baseY); }, legT, Math.max(3,s*0.05)); // front leg (over robe)

  // one swinging arm on the near side (skipped for tiny/back figures to stay clean)
  if (!back){
    const armY = shoY + s*0.02;
    const hand = { x: cx + dir*s*0.11 - Math.sin(phase)*s*0.06, y: hipY - s*0.02 };
    pen.limb(()=>{ g.moveTo(cx+dir*shoTop*0.6, armY); g.lineTo(hand.x, hand.y); }, skin, Math.max(2,s*0.04));
  }

  // neck
  pen.paint(()=>{ g.rect(cx-headR*0.3, shoY-headR*0.55, headR*0.6, headR*0.8); }, skin, Math.max(2,s*0.02));

  // hair BACK mass
  pen.paint(()=>{ g.ellipse(cx, headCy+headR*0.12, headR*1.1, headR*1.18, 0,0,7); }, dark, Math.max(2,s*0.028));
  // head, nudged in travel direction
  const hx = cx + dir*headR*0.28;
  pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.9, headR, 0,0,7); }, skin, Math.max(2,s*0.03));

  if (back){
    // back of the head: hair covers the crown, no face
    pen.paint(()=>{
      g.moveTo(hx-headR*0.9, headCy+headR*0.1);
      g.quadraticCurveTo(hx, headCy-headR*1.2, hx+headR*0.9, headCy+headR*0.1);
      g.quadraticCurveTo(hx, headCy+headR*0.5, hx-headR*0.9, headCy+headR*0.1);
    }, dark, Math.max(2,s*0.024));
  } else {
    // profile-ish face: a nose pointing the way they travel + one eye
    const eyeY = headCy - headR*0.05;
    g.fillStyle = INK;
    g.beginPath(); g.ellipse(hx+dir*headR*0.28, eyeY, headR*0.12, headR*0.14, 0,0,7); g.fill();
    g.strokeStyle=INK; g.lineWidth=Math.max(1.5,headR*0.14); g.lineCap="round";
    g.beginPath(); g.moveTo(hx+dir*headR*0.5, eyeY+headR*0.1);
    g.lineTo(hx+dir*headR*0.9, eyeY+headR*0.5); g.stroke();
    // hair front cap
    pen.paint(()=>{
      g.moveTo(hx-headR*0.9, headCy);
      g.quadraticCurveTo(hx, headCy-headR*1.3, hx+headR*0.9, headCy);
      g.quadraticCurveTo(hx+dir*headR*0.4, headCy-headR*0.5, hx, headCy-headR*0.42);
      g.quadraticCurveTo(hx-headR*0.4, headCy-headR*0.5, hx-headR*0.9, headCy);
    }, dark, Math.max(2,s*0.022));
    if (feat.beard)
      pen.paint(()=>{
        g.moveTo(hx-headR*0.5, headCy+headR*0.35);
        g.quadraticCurveTo(hx+dir*headR*0.3, headCy+headR*1.2, hx+headR*0.5, headCy+headR*0.35);
        g.quadraticCurveTo(hx, headCy+headR*0.7, hx-headR*0.5, headCy+headR*0.35);
      }, dark, Math.max(2,s*0.02));
  }
  return { head:{x:hx,y:headCy}, r:headR };
}

/* -------- destination landmark icons (small, at each pole) -------- */
function drawLandmark(pen, key, px, py, u){
  const g = pen.ctx;
  if (key==="farms"){
    // a low field line + a few wheat sheaves
    pen.ink(()=>{ g.moveTo(px-u*1.6, py); g.lineTo(px+u*1.6, py); }, 3);
    for (let i=-1;i<=1;i++){
      const sx = px + i*u*0.9;
      pen.paint(()=>{ g.ellipse(sx, py-u*0.6, u*0.22, u*0.5, 0,0,7); }, toneSolid(inkLevel(4)), 3);
      g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
      for (let k=-1;k<=1;k++){ g.beginPath(); g.moveTo(sx, py-u*0.6); g.lineTo(sx+k*u*0.18, py-u*1.15); g.stroke(); }
    }
  } else if (key==="town"){
    // a huddle of small pitched rooftops
    for (let i=-1;i<=1;i++){
      const bx = px + i*u*0.85, bw = u*0.6, bh = u*0.55;
      pen.paint(()=>{ g.rect(bx-bw/2, py-bh, bw, bh); }, toneSolid(inkLevel(4)), 3);
      pen.paint(()=>{ g.moveTo(bx-bw*0.62, py-bh); g.lineTo(bx, py-bh-u*0.4); g.lineTo(bx+bw*0.62, py-bh); g.closePath(); },
                toneSolid(inkLevel(5)), 3);
    }
  } else { // palace — a small columned gate
    const cw=u*0.16, ch=u*1.3, span=u*1.5;
    for (let i=-1;i<=1;i++){
      const sx = px + i*span/2;
      pen.paint(()=>{ g.rect(sx-cw/2, py-ch, cw, ch); }, toneSolid(inkLevel(5)), 3);
    }
    // architrave + pediment
    pen.paint(()=>{ g.rect(px-span/2-cw, py-ch-u*0.18, span+cw*2, u*0.18); }, toneSolid(inkLevel(6)), 3);
    pen.paint(()=>{ g.moveTo(px-span/2-cw, py-ch-u*0.18); g.lineTo(px, py-ch-u*0.7);
                    g.lineTo(px+span/2+cw, py-ch-u*0.18); g.closePath(); }, toneSolid(inkLevel(4)), 3);
  }
}

/* -------- build the dispersing member set deterministically -------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const disperse = clamp01(p.disperse);
  const wave = clamp01(p.wave);
  const spread = clamp(p.spread, 0, 1.5);
  const origin = { x:W*p.originX, y:H*p.originY };
  const counts = p.counts || [6,6,6];

  const members = [];
  for (let f=0; f<3; f++){
    const key = FLOW_KEYS[f];
    const n = counts[f] || 6;
    const destBase = DEST[key];
    for (let i=0;i<n;i++){
      const rng = rnd((f*211 + i*37 + 5)>>>0);
      // where along the stream this member sits: head of stream leads, tail lags
      const rank = n>1 ? i/(n-1) : 0;                       // 0 head .. 1 tail
      let dest = { x:destBase.x*W, y:destBase.y*H };
      if (p.formation==="scatter"){
        // no coherent destination: fan out to a random edge point
        const ang = rng()*Math.PI*2;
        dest = { x:origin.x + Math.cos(ang)*W*0.48, y:origin.y + Math.sin(ang)*H*0.42 };
      }
      // stagger: tail members have travelled less -> the stream is strung out
      const lag = rank*wave;
      const prog = p.formation==="cluster" ? 0.04*rank
                 : smooth(clamp01(disperse*(1+wave) - lag));
      // lateral offset perpendicular to the travel path, shrinking as they go
      const dx = dest.x-origin.x, dy = dest.y-origin.y;
      const L = Math.hypot(dx,dy)||1; const nx=-dy/L, ny=dx/L;
      const laneJit = (rng()-0.5);
      const lane = laneJit * spread * lerp(W*0.11, W*0.055, prog);
      let px = lerp(origin.x, dest.x, prog) + nx*lane;
      let py = lerp(origin.y, dest.y, prog) + ny*lane*0.5;
      // keep feet on stage
      py = clamp(py, H*0.34, H*0.90);
      const s = scaleForY(H, py) * (0.9 + rng()*0.2);
      // facing/travel direction from horizontal component of the path
      const dir = clamp((dest.x-origin.x)/(W*0.30), -1, 1);
      const feat = { beard: rng()<0.45, headS: 0.9+rng()*0.25 };
      const depth = py/H;
      const shade = {
        robe: 2 + (i%2) + Math.round(depth*1.0),   // lighter robes (2..4) — no black blobs
        skin: 2 + Math.round(depth),
        leg:  3 + Math.round(depth),               // mid-gray legs
        hair: 5 + Math.round(depth),               // dark hair for head contrast
      };
      members.push({ cx:px, baseY:py, s, dir, phase:rng()*Math.PI*2 + prog*6,
                     shade, feat, flow:f, key, prog, depth });
    }
  }
  // paint back -> front
  members.sort((a,b)=> a.baseY - b.baseY);
  return { members, origin, showPaths:p.showPaths, showLandmarks:p.showLandmarks, disperse };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const { members, origin, showPaths, showLandmarks } = buildMembers(W, H, st);

  // ground band under the whole scene (light — reads as the plaza/road)
  g.fillStyle = inkLevel(2); g.fillRect(0, H*0.60, W, H*0.40);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.22;
  g.beginPath(); g.moveTo(0,H*0.60); g.lineTo(W,H*0.60); g.stroke();
  g.globalAlpha=1;

  // faint fanning FLOW paths from the origin toward each landmark, each
  // ending in an arrowhead — the direction of the three separate flows.
  if (showPaths){
    g.strokeStyle=INK; g.lineCap="round";
    for (const key of FLOW_KEYS){
      const m = MARK[key];
      const tx = m.x*W, ty = m.y*H + scaleForY(H,m.y*H)*0.6;
      const dx = tx-origin.x, dy = ty-origin.y, L=Math.hypot(dx,dy)||1;
      const ux=dx/L, uy=dy/L;
      const ex = origin.x + ux*L*0.86, ey = origin.y + uy*L*0.86;  // stop short of the mark
      g.setLineDash([2,7]); g.globalAlpha = 0.35; g.lineWidth = 2.4;
      g.beginPath(); g.moveTo(origin.x, origin.y); g.lineTo(ex, ey); g.stroke();
      // arrowhead
      g.setLineDash([]); g.globalAlpha = 0.55; g.lineWidth = 3;
      const a = 0.5, hl = 14;
      g.beginPath();
      g.moveTo(ex, ey);
      g.lineTo(ex - (ux*Math.cos(a)-uy*Math.sin(a))*hl, ey - (uy*Math.cos(a)+ux*Math.sin(a))*hl);
      g.moveTo(ex, ey);
      g.lineTo(ex - (ux*Math.cos(-a)-uy*Math.sin(-a))*hl, ey - (uy*Math.cos(-a)+ux*Math.sin(-a))*hl);
      g.stroke();
    }
    g.setLineDash([]); g.globalAlpha=1;
  }

  // a small marker where the assembly stood (the emptied origin)
  g.strokeStyle=INK; g.globalAlpha=0.5; g.lineWidth=2;
  g.beginPath(); g.ellipse(origin.x, origin.y, W*0.05, H*0.018, 0,0,7); g.stroke();
  g.globalAlpha=1;

  // destination landmarks (drawn behind the walkers streaming toward them)
  if (showLandmarks){
    drawLandmark(pen, "town",   MARK.town.x*W,   MARK.town.y*H,   W*0.055);
    drawLandmark(pen, "farms",  MARK.farms.x*W,  MARK.farms.y*H,  W*0.05);
    drawLandmark(pen, "palace", MARK.palace.x*W, MARK.palace.y*H, W*0.052);
  }

  // the crowd, back -> front
  for (const m of members) drawWalker(pen, m.cx, m.baseY, m.s, m.dir, m.phase, m.shade, m.feat);
}

export const asset = {
  id:"ensemble.dispersing-assembly",
  type:"ENSEMBLE",
  name:"Dispersing assembly",
  statusWord:"SCATTERING",
  scene:"OD-B02-S04",

  params,
  // back -> front draw order the ensemble honors
  layers:["ground","flow-paths","origin-mark","landmarks","crowd"],
  // normalized 0..1 anchors: the origin + the three flow poles + placement
  anchors:{
    "origin:assembly":{x:.50,y:.60},
    "flow:farms":{x:.10,y:.80}, "flow:town":{x:.50,y:.40}, "flow:palace":{x:.90,y:.79},
    "center":{x:.50,y:.58},     "camera:wide":{x:.50,y:.52},
  },
  zones:{ plaza:{ x0:.04,y0:.42,x1:.96,y1:.90 } },
  channels:["formation","disperse","spread","wave","density"],
  states:{
    initial:"gathered",
    nodes:{
      // still one body, barely beginning to loosen
      gathered:  { preview:{ formation:"cluster", disperse:0.06, wave:0.4, status:"GATHERED" } },
      // the streams pull apart toward the three destinations — mid-scatter
      breaking:  { preview:{ formation:"streams", disperse:0.5,  wave:0.9, status:"BREAKING" } },
      // strung out, nearly gone, no resolution
      dispersed: { preview:{ formation:"streams", disperse:0.9,  wave:0.7, status:"DISPERSED" } },
      // an incoherent scatter (alarm / rout) in every direction
      scattered: { preview:{ formation:"scatter", disperse:0.7,  wave:1.0, spread:1.4, status:"SCATTERED" } },
    },
    edges:[
      ["gathered","breaking"],["breaking","dispersed"],
      ["breaking","scattered"],["scattered","dispersed"],
    ],
  },

  // neutral preview = the break caught mid-flow (three streams, unresolved)
  preview:()=>({ formation:"streams", disperse:0.55, spread:1.0, wave:0.8, status:"SCATTERING", progress:0.55 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
