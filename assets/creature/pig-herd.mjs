/* creature.pig-herd — a large managed HERD OF SWINE penned on the farmstead
   (Eumaeus' sties, Odyssey Book 14). CREATURE asset (quadruped, NOT humanoid):
   a cluster of pigs drawn deterministically from ONE pig template, inside a
   railed PEN.

   ONE pig TEMPLATE (custom geometry on engine primitives):
     · a fat barrel BODY (pale hide, shaded back + pale underbelly for form)
     · a wedge HEAD ending in a blunt flat SNOUT disc (two nostril dots)
     · two floppy EARS, a small EYE
     · a curly corkscrew TAIL at the rump
     · four stubby TROTTER legs on cloven feet
   The template is articulated by a `posture` knob: stand / feed / lie.

   HERD + PEN: N pigs placed from a deterministic formation into a fenced pen
   (horizontal rails + posts, a feeding trough). Near pigs bolder, far pigs
   dimmer + smaller, so the cluster reads with depth.

   States (channels drive them) — the required managed-herd states:
     pen-grouped  — the whole drove standing/milling inside the rails (the herd
                    at rest; escape-prevention fence bold around them).
     feeding      — the drove crowded at the trough, heads down, snouts rooting.
     night-huddle — the drove bedded down for the night: pigs lying tight in an
                    overlapping cluster, eyes shut, a crescent moon over a dark
                    ground.
   A `selected` index marks one boar picked out (for slaughter) with a ring.

   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B14-S01 — managed herd, pen grouping, feeding, selected-slaughter,
   escape prevention, night states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- flat tone levels (the POST pass turns them into dots). Pigs read as a
   pale mid hide so the dark snout/ears/legs/eye + the bold pen rails pop. ---- */
const T_HIDE  = (d=0)=> toneSolid(inkLevel(3-d));   // pig hide (light-mid); d dims far pigs
const T_BACK  = (d=0)=> toneSolid(inkLevel(4-d));   // shaded back/haunch mass
const T_BELLY = (d=0)=> toneSolid(inkLevel(2));     // pale underbelly (form)
const T_HEAD  = (d=0)=> toneSolid(inkLevel(4-d));   // head wedge
const T_SNOUT = (d=0)=> toneSolid(inkLevel(5-d));   // blunt snout disc (darker)
const T_EAR   = (d=0)=> toneSolid(inkLevel(5-d));   // floppy ear
const T_LEG   = (d=0)=> toneSolid(inkLevel(5-d));   // trotter
const T_HOOF  = ()=> toneSolid(inkLevel(7));        // hard cloven foot
const T_RAIL  = ()=> toneSolid(inkLevel(6));        // fence rail (bold, dark wood)
const T_POST  = ()=> toneSolid(inkLevel(7));        // fence post
const T_TROUGH= ()=> toneSolid(inkLevel(5));        // feeding trough
const T_SLOP  = ()=> toneSolid(inkLevel(4));        // feed mash in the trough

/* ============================================================
   ONE PIG TEMPLATE
   Drawn in a LOCAL frame: origin at the pig's FEET-CENTER on the ground,
   pig facing +x. Caller translates to (x,y) and pre-scales dir for facing.
   s = body unit (roughly nose-to-rump length / 2). posture: stand|feed|lie.
   d = depth-dim (0 near .. 1 far) darkens/dims far members.
   ============================================================ */
function drawPig(pen, s, posture, d, o={}){
  const g = pen.ctx;
  const lie  = posture==="lie";
  const feed = posture==="feed";

  const rx = s*(lie?0.74:0.62), ry = s*(lie?0.30:0.40);
  const legLen = lie ? s*0.06 : s*0.34;
  const bodyCy = -(legLen + ry);                 // body center height above feet

  // hip roots along the belly line
  const bellyY = bodyCy + ry*0.86;
  const foreHipX =  rx*0.50, hindHipX = -rx*0.56;
  const legW = s*0.15;

  // ---- FAR pair of legs first (behind, dimmer) ----
  const drawLeg = (hx, foot, w, tone)=>{
    pen.limb(()=>{ g.moveTo(hx, bellyY); g.lineTo(foot.x, foot.y-w*0.4); }, tone, w);
    // cloven hoof
    pen.paint(()=>{
      g.moveTo(foot.x-w*0.55, foot.y-w*0.5);
      g.lineTo(foot.x+w*0.55, foot.y-w*0.5);
      g.lineTo(foot.x+w*0.42, foot.y);
      g.lineTo(foot.x-w*0.42, foot.y);
      g.closePath();
    }, T_HOOF(), 2.2);
    pen.seam(()=>{ g.moveTo(foot.x, foot.y-w*0.46); g.lineTo(foot.x, foot.y); }, 1.6);
  };
  if (!lie){
    drawLeg(foreHipX - s*0.14, P(foreHipX - s*0.10, 0), legW*0.86, T_LEG(d+1));
    drawLeg(hindHipX - s*0.14, P(hindHipX - s*0.10, 0), legW*0.86, T_LEG(d+1));
  }

  // ---- curly corkscrew TAIL at the rump (behind body) ----
  {
    const tb = P(-rx*0.98, bodyCy - ry*0.30);
    pen.ink(()=>{
      g.moveTo(tb.x, tb.y);
      g.bezierCurveTo(tb.x - s*0.24, tb.y - s*0.10, tb.x - s*0.02, tb.y - s*0.24, tb.x - s*0.18, tb.y - s*0.26);
      g.bezierCurveTo(tb.x - s*0.30, tb.y - s*0.27, tb.x - s*0.26, tb.y - s*0.12, tb.x - s*0.12, tb.y - s*0.14);
    }, Math.max(2.4, s*0.05));
  }

  // ---- BARREL body ----
  pen.paint(()=>{
    g.moveTo(-rx*0.98, bodyCy - ry*0.20);                              // rump top
    g.quadraticCurveTo(-rx*0.30, bodyCy - ry*1.02, rx*0.44, bodyCy - ry*0.96); // level back
    g.quadraticCurveTo(rx*1.00, bodyCy - ry*0.80, rx*1.02, bodyCy - ry*0.10);  // shoulder to chest
    g.quadraticCurveTo(rx*1.00, bodyCy + ry*0.86, rx*0.30, bodyCy + ry*1.00);  // brisket -> belly
    g.quadraticCurveTo(-rx*0.60, bodyCy + ry*1.06, -rx*1.00, bodyCy + ry*0.40);// deep belly -> haunch
    g.quadraticCurveTo(-rx*1.14, bodyCy + ry*0.06, -rx*0.98, bodyCy - ry*0.20);
    g.closePath();
  }, T_HIDE(d), 5);
  // shaded back/haunch mass + pale underbelly (form)
  pen.paint(()=>{ g.ellipse(-rx*0.42, bodyCy - ry*0.22, rx*0.60, ry*0.66, 0,0,TAU); }, T_BACK(d), 0);
  pen.paint(()=>{ g.ellipse( rx*0.14, bodyCy + ry*0.52, rx*0.72, ry*0.40, 0,0,TAU); }, T_BELLY(d), 0);

  // ---- HEAD wedge at the front (+x). Lowers for feed/lie. ----
  const headDrop = feed ? 1.0 : lie ? 0.5 : (o.headDrop ?? 0.15);
  const hr = s*0.44;
  const HCx = rx*0.98 + hr*0.30;
  const HCy = lerp(bodyCy - ry*0.10, bellyY + s*0.30, headDrop);   // up vs down at ground/trough
  g.save(); g.translate(HCx, HCy); g.rotate(lerp(-0.05, 0.55, headDrop));

  // ear (floppy triangle, up over the crown) — drawn behind the skull
  pen.paint(()=>{
    g.moveTo(-hr*0.20, -hr*0.30);
    g.quadraticCurveTo(-hr*0.10, -hr*1.05, hr*0.30, -hr*0.86);
    g.quadraticCurveTo(hr*0.20, -hr*0.30, hr*0.08, -hr*0.18);
    g.closePath();
  }, T_EAR(d), 3);

  // head skull (rounded wedge)
  pen.paint(()=>{
    g.moveTo(-hr*0.60, -hr*0.34);
    g.quadraticCurveTo(hr*0.10, -hr*0.72, hr*0.78, -hr*0.30);       // brow -> toward snout
    g.quadraticCurveTo(hr*1.02, hr*0.02, hr*0.86, hr*0.34);         // cheek to snout base
    g.quadraticCurveTo(hr*0.20, hr*0.78, -hr*0.56, hr*0.40);        // jaw
    g.quadraticCurveTo(-hr*0.86, hr*0.02, -hr*0.60, -hr*0.34);
    g.closePath();
  }, T_HEAD(d), 4);

  // blunt SNOUT disc at the tip
  const sx = hr*0.98, sy = hr*0.06;
  pen.paint(()=>{ g.ellipse(sx, sy, hr*0.30, hr*0.34, 0.2, 0, TAU); }, T_SNOUT(d), 3.5);
  // two nostril dots
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(sx+hr*0.06, sy - hr*0.11, hr*0.06, hr*0.09, 0,0,TAU); g.fill();
  g.beginPath(); g.ellipse(sx+hr*0.06, sy + hr*0.11, hr*0.06, hr*0.09, 0,0,TAU); g.fill();

  // eye (shut for the sleeping huddle)
  const ex = hr*0.18, ey = -hr*0.10;
  if (lie){
    g.strokeStyle=INK; g.lineWidth=Math.max(1.8,hr*0.10); g.lineCap="round";
    g.beginPath(); g.moveTo(ex-hr*0.12, ey); g.lineTo(ex+hr*0.12, ey); g.stroke();
  } else {
    g.fillStyle=INK; g.beginPath(); g.ellipse(ex, ey, hr*0.11, hr*0.12, 0,0,TAU); g.fill();
  }
  // mouth line back from the snout
  pen.seam(()=>{ g.moveTo(sx-hr*0.10, sy+hr*0.24); g.lineTo(-hr*0.30, hr*0.42); }, 2);
  g.restore();

  // ---- NEAR pair of legs (over the body) ----
  if (!lie){
    drawLeg(foreHipX + s*0.02, P(foreHipX + s*0.06, 0), legW, T_LEG(d));
    drawLeg(hindHipX + s*0.02, P(hindHipX + s*0.06, 0), legW, T_LEG(d));
  } else {
    // tucked fore-trotter stub poking out from the lying belly
    pen.paint(()=>{ g.ellipse(rx*0.40, -s*0.03, legW*0.9, legW*0.5, 0,0,TAU); }, T_LEG(d), 2.6);
  }
}

/* ============================================================
   HERD FORMATION — deterministic placements from one seed. Returns a list of
   { x,y,s,dir,posture,d } in canvas space for the given state + pen box.
   ============================================================ */
function formation(state, W, H, pen){
  const n = pen.count;
  const R = rnd(pen.seed);
  const out = [];
  const gx0 = W*0.10, gx1 = W*0.90;                 // pen interior x-span
  const gTop = H*0.48, gBot = H*0.88;               // ground band (clears the back fence .. front)

  const posture = state==="feeding" ? "feed" : state==="night-huddle" ? "lie" : "stand";

  if (state==="feeding"){
    // two crowded ranks along the trough near mid-height, all facing the trough
    const troughY = H*0.66;
    const ranks = [ {y:troughY - H*0.05, face:+1, k:0}, {y:troughY + H*0.10, face:+1, k:1} ];
    // pigs press in from both sides toward center trough
    let idx=0;
    for (let r=0;r<2;r++){
      const per = Math.ceil(n/2);
      for (let i=0;i<per && idx<n;i++,idx++){
        const t = per>1 ? i/(per-1) : 0.5;
        const side = t<0.5 ? -1 : 1;                 // left half faces right, right half faces left
        const x = lerp(gx0+W*0.10, gx1-W*0.10, t);
        const depth = clamp01((ranks[r].y-gTop)/(gBot-gTop));
        const s = lerp(W*0.070, W*0.115, depth) * (0.92+0.16*R());
        out.push({ x, y:ranks[r].y + (R()-0.5)*H*0.02, s, dir: side<0?+1:-1,
                   posture:"feed", d: r===0?1:0 });
      }
    }
    return out;
  }

  if (state==="night-huddle"){
    // one tight overlapping bedded cluster, low-center
    const cx = W*0.50, cy = H*0.74;
    for (let i=0;i<n;i++){
      const ang = (i/n)*TAU + R()*0.6;
      const rad = (0.2+0.8*R());
      const x = cx + Math.cos(ang)*W*0.22*rad;
      const y = cy + Math.sin(ang)*H*0.10*rad;
      const depth = clamp01((y-gTop)/(gBot-gTop));
      const s = lerp(W*0.080, W*0.120, depth) * (0.9+0.2*R());
      out.push({ x, y, s, dir: R()<0.5?-1:1, posture:"lie", d: depth<0.5?1:0 });
    }
    // draw far (small,high) first
    out.sort((a,b)=>a.y-b.y);
    return out;
  }

  // pen-grouped: scattered milling drove in ~3 receding rows
  const rows = 3;
  let idx=0;
  for (let r=0;r<rows;r++){
    const per = r===0? Math.floor(n*0.28) : r===1? Math.floor(n*0.34) : n - Math.floor(n*0.28) - Math.floor(n*0.34);
    const ry = lerp(gTop+H*0.04, gBot, r/(rows-1));
    const depth = r/(rows-1);
    for (let i=0;i<per && idx<n;i++,idx++){
      const t = per>1 ? i/(per-1) : 0.5;
      const x = lerp(gx0+W*0.06, gx1-W*0.06, t) + (R()-0.5)*W*0.06;
      const s = lerp(W*0.075, W*0.120, depth) * (0.9+0.2*R());
      out.push({ x, y: ry + (R()-0.5)*H*0.03, s, dir: R()<0.45?-1:1,
                 posture:"stand", d: r===0?2:r===1?1:0, headDrop:0.05+0.3*R() });
    }
  }
  return out;
}

/* the railed PEN: back fence (rails+posts), side posts, and a trough for feed.
   Drawn so the fence brackets the herd (escape prevention reads visually). */
function drawPen(pen, W, H, state){
  const g = pen.ctx;
  const night = state==="night-huddle";

  // ground tone (darker for night)
  g.fillStyle = inkLevel(night?2:1); g.fillRect(0, H*0.36, W, H*0.64);

  // crescent MOON for the night state
  if (night){
    const mx=W*0.80, my=H*0.16, mr=W*0.06;
    pen.paint(()=>{ g.ellipse(mx,my,mr,mr,0,0,TAU); }, toneSolid(inkLevel(2)), 3);
    g.save(); g.globalCompositeOperation="destination-out";
    g.beginPath(); g.ellipse(mx-mr*0.5, my-mr*0.2, mr*0.9, mr*0.9, 0,0,TAU); g.fill(); g.restore();
    // stars
    g.fillStyle=inkLevel(4);
    for(let i=0;i<9;i++){ const sx=W*(0.08+0.72*((i*0.173)%1)), sy=H*(0.05+0.22*((i*0.311)%1));
      g.beginPath(); g.arc(sx,sy,2.2,0,TAU); g.fill(); }
  }

  // ---- BACK fence: three horizontal rails on posts across the pen ----
  const fy = H*0.40;                                   // fence line (behind herd)
  const posts = 6;
  for (let i=0;i<=posts;i++){
    const x = lerp(W*0.06, W*0.94, i/posts);
    pen.paint(()=>{ g.rect(x-W*0.010, fy-H*0.14, W*0.020, H*0.15); }, T_POST(), 3);
  }
  for (let r=0;r<3;r++){
    const yy = fy - H*0.115 + r*H*0.045;
    pen.paint(()=>{ g.rect(W*0.055, yy, W*0.89, H*0.016); }, T_RAIL(), 3);
  }

  // ---- SIDE fence posts (foreground corners) reinforcing the enclosure ----
  const sidePost=(x)=>{ pen.paint(()=>{ g.rect(x-W*0.014, H*0.42, W*0.028, H*0.46); }, T_POST(), 3.5); };
  sidePost(W*0.045); sidePost(W*0.955);
  // low foreground rail across the bottom (the near pen wall) — drawn LAST elsewhere

  // ---- feeding TROUGH (only in feeding state) ----
  if (state==="feeding"){
    const ty=H*0.68, tw=W*0.60, th=H*0.05, tx=W*0.5-tw/2;
    pen.paint(()=>{
      g.moveTo(tx, ty); g.lineTo(tx+tw, ty);
      g.lineTo(tx+tw-W*0.02, ty+th); g.lineTo(tx+W*0.02, ty+th); g.closePath();
    }, T_TROUGH(), 4);
    pen.paint(()=>{ g.ellipse(W*0.5, ty+th*0.2, tw*0.46, th*0.55, 0,0,TAU); }, T_SLOP(), 2.5);
  }
}

/* foreground near-rail drawn over the herd, so the pen visibly contains them. */
function drawNearRail(pen, W, H){
  const g = pen.ctx;
  const y = H*0.90;
  for (let r=0;r<2;r++){
    const yy = y + r*H*0.04;
    pen.paint(()=>{ g.rect(W*0.02, yy, W*0.96, H*0.020); }, T_RAIL(), 3.5);
  }
}

function drawHerd(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const st = state.pose || state.state || "pen-grouped";
  const P0 = asset.params;

  // pen + ground + fences (back)
  drawPen(pen, W, H, st);

  // herd
  const pigs = formation(st, W, H, P0);
  // painter's order: far (small / high y) first
  const ordered = pigs.slice().sort((a,b)=> a.y - b.y);
  for (const p of ordered){
    // ground shadow
    ctx.save(); ctx.fillStyle="rgba(0,0,0,0.08)";
    ctx.beginPath(); ctx.ellipse(p.x, p.y+ (p.posture==="lie"? p.s*0.06 : 2), p.s*(p.posture==="lie"?0.9:0.8), p.s*0.16, 0,0,TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(p.x, p.y); ctx.scale(p.dir, 1);
    drawPig(pen, p.s, p.posture, p.d, { headDrop:p.headDrop });
    ctx.restore();
  }

  // selected boar (for slaughter) — a blue ring + tick over one near pig
  const sel = clamp(P0.selected|0, 0, pigs.length-1);
  if (state.showSelected !== false && pigs.length){
    // pick the frontmost (largest s) as the selected, unless index overrides
    let target = pigs[sel] || pigs[0];
    if (sel===0){ target = pigs.reduce((a,b)=> b.s>a.s?b:a, pigs[0]); }
    const g = ctx;
    g.save(); g.strokeStyle=ACCENT; g.lineWidth=3.5;
    g.beginPath(); g.ellipse(target.x, target.y - target.s*0.5, target.s*0.95, target.s*0.72, 0,0,TAU); g.stroke();
    // a small caret tag above
    g.beginPath(); g.moveTo(target.x, target.y - target.s*1.35);
    g.lineTo(target.x - target.s*0.14, target.y - target.s*1.60);
    g.lineTo(target.x + target.s*0.14, target.y - target.s*1.60); g.closePath();
    g.fillStyle=ACCENT; g.fill();
    g.restore();
  }

  // near foreground rail (contains the herd)
  drawNearRail(pen, W, H);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"creature.pig-herd",
  type:"CREATURE",
  name:"Pig herd",
  statusWord:"PENNED",
  scene:"OD-B14-S01",

  // procedural knobs
  params:{
    count:11,            // pigs drawn from the template into the pen
    seed:1414,           // deterministic formation seed
    selected:0,          // index of the boar picked out (0 => frontmost)
    hide:"#e0d3c4",      // pale pig hide
    collision:true,      // barrel + trotter footprint + pen rails used for collision
    escapeProof:true,    // fence brackets the drove (visual escape-prevention)
  },
  // back -> front draw order the scene honors
  layers:["ground","moon","stars","back-fence","side-posts","trough",
          "herd-shadows","herd","selected-ring","near-rail"],
  // normalized 0..1 attention / contact / placement anchors
  anchors:{
    "pen:center":{x:.50,y:.68},
    "herd:lead":{x:.50,y:.72},          // the frontmost / selected boar
    "trough:feed":{x:.50,y:.69},
    "fence:back":{x:.50,y:.40},
    "gate:left":{x:.05,y:.66},          // the pen gate (entrance/exit)
    "gate:right":{x:.95,y:.66},
    "moon:night":{x:.80,y:.16},
    "camera:pen":{x:.50,y:.60},
  },
  // pen footprints for placement / pathing / collision
  zones:{
    pen:{ x0:.06,y0:.40,x1:.94,y1:.92 },
    "fence:line":{ x0:.06,y0:.26,x1:.94,y1:.42 },
    walkable:{ x0:.10,y0:.44,x1:.90,y1:.90 },
  },
  states:{
    initial:"pen-grouped",
    nodes:{
      "pen-grouped":{ preview:{ pose:"pen-grouped" } },  // the drove milling in the pen
      feeding:{       preview:{ pose:"feeding" } },       // crowded at the trough, heads down
      "night-huddle":{preview:{ pose:"night-huddle" } },  // bedded down for the night
    },
    edges:[
      ["pen-grouped","feeding"],["feeding","pen-grouped"],
      ["pen-grouped","night-huddle"],["night-huddle","pen-grouped"],
    ],
  },
  channels:["pose","selected","density","headDrop","t"],

  preview:()=>({ pose:"pen-grouped", status:"PENNED", progress:.22 }),
  draw(ctx,W,H,state){ return drawHerd(ctx,W,H,state); },
};
export default asset;
