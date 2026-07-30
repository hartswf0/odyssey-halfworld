/* prop.thrown-footstool — the low wooden footstool Antinous hurls at the
   beggar in his own hall. PROP asset. One isolated reusable object: a squat
   carpentered slab on four short tapered legs, with a carved fret band across
   the front rail. Drawn in SOLID grays + hard contour into the offscreen ctx;
   the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B17-S05): a single piece of hall furniture cycling through
   AT TABLE / SEIZED / AIMED / IN FLIGHT / STRUCK / FALLING / EVIDENCE. The
   stool is drawn about its own centre with a rigid-body ROTATION and a
   foreshortening TILT per state (tilt 1 = looking down on the top face,
   tilt 0 = edge-on), so the same carpentry tumbles continuously through the
   throw. The diagram layers around it — grip ticks, sight line, parabolic arc,
   impact burst, motion ghosts, floor scuff — are procedural overlays, never
   baked-in figures. Grip, support and contact anchors stay meaningful across
   the whole arc.
   Atlas: isolated reusable object; declared scale, grip/support/contact
   anchors, ownership, collision shape, all scene-required states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  halfWidth:198,     // half of the slab width in source px at neutral scale (660x880)
  slabTh:0.30,       // slab thickness, in half-width units (a thick squat slab)
  legH:0.40,         // leg length, in half-width units (SHORT — a foot rest, not a table)
  legW:0.105,        // leg half-width at the slab, in half-width units (blocky)
  frets:5,           // carved notches across the front rail (few + large: the
                     // dot lattice eats anything finer once the stool tumbles)
  topLvl:2,          // ink level: top face (lightest — the foot-rest plane)
  frontLvl:3,        // ink level: front rail
  sideLvl:5,         // ink level: turned-away right side (the one dark accent)
  legLvl:4,          // ink level: near legs (far legs go one level lighter)
  fretLvl:1,         // ink level: carved notches (light, cut into the rail)
  collision:"box",
};

/* per-state rigid-body pose + which diagram overlays are live.
   cx/cy are fractions of W/H; s is the half-width as a fraction of W;
   rot is radians about the stool's own front-edge midpoint. */
const POSE = {
  rest:     { cx:0.50, cy:0.522, s:0.300, rot: 0.00, tilt:0.90, status:"AT TABLE",  progress:0.10, floor:true, shadow:true },
  lift:     { cx:0.50, cy:0.420, s:0.288, rot:-0.30, tilt:0.72, status:"SEIZED",    progress:0.26, grip:true, lift:true, shadow:true },
  aim:      { cx:0.35, cy:0.370, s:0.250, rot:-0.74, tilt:0.54, status:"AIMED",     progress:0.42, grip:true, aim:true },
  flight:   { cx:0.45, cy:0.395, s:0.245, rot: 0.62, tilt:0.55, status:"IN FLIGHT", progress:0.60, arc:true,  spin:true },
  impact:   { cx:0.42, cy:0.400, s:0.240, rot: 1.18, tilt:0.44, status:"STRUCK",    progress:0.76, burst:true, shoulder:true },
  fall:     { cx:0.50, cy:0.480, s:0.235, rot: 2.30, tilt:0.48, status:"FALLING",   progress:0.88, ghosts:true, floor:true, dust:true },
  evidence: { cx:0.47, cy:0.453, s:0.262, rot: 1.78, tilt:0.42, status:"EVIDENCE",  progress:1.00, floor:true, scuff:true, peg:true },
};

/* the source frame the module is authored against, and the floor line in it */
const SRC_W = 660, SRC_H = 880, FLOOR_Y = 0.680;

/* ---- rigid-body geometry of the stool in screen px ---------------------
   Local frame: origin at the midpoint of the TOP FRONT edge, x to the right
   in half-widths, y down. The back corners are offset by the oblique (bx,by)
   which collapses toward 0 as tilt -> 0 (edge-on). */
function stoolGeom(cx, cy, s, rot, tilt){
  const th = params.slabTh, legH = params.legH, lw = params.legW;
  const dep = 1.05 * clamp(tilt, 0, 1);
  const bx = 0.30 * dep, by = -0.52 * dep;
  const cos = Math.cos(rot), sin = Math.sin(rot);
  const T = (x,y)=>({ x: cx + (x*cos - y*sin)*s, y: cy + (x*sin + y*cos)*s });
  const leg = (x,y)=>({
    a:T(x-lw, y), b:T(x+lw, y),
    c:T(x+lw*0.72, y+legH), d:T(x-lw*0.72, y+legH),
  });
  return {
    T, th, legH, bx, by,
    FLt:T(-1,0),      FRt:T(1,0),      BRt:T(1+bx,by),      BLt:T(-1+bx,by),
    FLb:T(-1,th),     FRb:T(1,th),     BRb:T(1+bx,by+th),   BLb:T(-1+bx,by+th),
    legs:{
      fl:leg(-0.80, th),      fr:leg(0.80, th),
      bl:leg(-0.80+bx, by+th), br:leg(0.80+bx, by+th),
    },
  };
}

const quad = (g,a,b,c,d)=>{ g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.lineTo(d.x,d.y); g.closePath(); };

/* the stool: back legs -> side face -> front rail -> top face -> front legs */
function drawStool(g, pen, G){
  const L = G.legs;
  // far legs (behind the slab — one level lighter so they sit back in depth)
  [L.bl, L.br].forEach(k=>{
    pen.paint(()=>quad(g,k.a,k.b,k.c,k.d), toneSolid(inkLevel(params.legLvl-1)), 4);
  });
  // right side face (turned away — darkest plane)
  pen.paint(()=>quad(g,G.FRt,G.BRt,G.BRb,G.FRb), toneSolid(inkLevel(params.sideLvl)), 5);
  // front rail
  pen.paint(()=>quad(g,G.FLt,G.FRt,G.FRb,G.FLb), toneSolid(inkLevel(params.frontLvl)), 5);
  // top face — the foot-rest plane, kept light so the object breathes
  pen.paint(()=>quad(g,G.FLt,G.FRt,G.BRt,G.BLt), toneSolid(inkLevel(params.topLvl)), 5);
  // carved fret band cut into the front rail (light notches, broken span)
  const n = params.frets, th = G.th;
  for(let i=0;i<n;i++){
    const f0 = -0.80 + (1.60/n)*(i+0.16), f1 = -0.80 + (1.60/n)*(i+0.84);
    pen.paint(()=>quad(g, G.T(f0,th*0.26), G.T(f1,th*0.26), G.T(f1,th*0.76), G.T(f0,th*0.76)),
              toneSolid(inkLevel(params.fretLvl)), 4);
  }
  // grain seams on the top face — two BROKEN runs, never one full span
  [[-0.80,-0.16],[0.16,0.80]].forEach(([u0,u1])=>{
    const a=G.T(u0, 0), b=G.T(u1, 0);
    const a2={x:lerp(a.x,G.T(u0+G.bx,G.by).x,0.48), y:lerp(a.y,G.T(u0+G.bx,G.by).y,0.48)};
    const b2={x:lerp(b.x,G.T(u1+G.bx,G.by).x,0.48), y:lerp(b.y,G.T(u1+G.bx,G.by).y,0.48)};
    pen.seam(()=>{ g.moveTo(a2.x,a2.y); g.lineTo(b2.x,b2.y); }, 3.6);
  });
  // front legs
  [L.fl, L.fr].forEach(k=>{
    pen.paint(()=>quad(g,k.a,k.b,k.c,k.d), toneSolid(inkLevel(params.legLvl)), 5);
  });
}

/* outline-only silhouette, for the motion ghosts of the fall */
function drawStoolGhost(g, pen, G){
  const L = G.legs;
  [L.bl,L.br,L.fl,L.fr].forEach(k=> pen.ink(()=>quad(g,k.a,k.b,k.c,k.d), 5));
  pen.ink(()=>quad(g,G.FLt,G.FRt,G.BRt,G.BLt), 5);
  pen.ink(()=>quad(g,G.FLt,G.FRt,G.FRb,G.FLb), 5);
  pen.ink(()=>quad(g,G.FRt,G.BRt,G.BRb,G.FRb), 5);
}

/* a BROKEN floor line — never a full-width bar */
function drawFloor(g, pen, W, gy){
  const segs = [[0.08,0.27],[0.38,0.58],[0.71,0.92]];
  segs.forEach(([a,b])=> pen.ink(()=>{ g.moveTo(W*a,gy); g.lineTo(W*b,gy); }, 5));
  g.strokeStyle="rgba(0,0,0,0.42)"; g.lineWidth=5; g.lineCap="round";
  for(let i=0;i<5;i++){ const x=W*(0.14+i*0.18);
    g.beginPath(); g.moveTo(x,gy+10); g.lineTo(x-W*0.035,gy+38); g.stroke(); }
}

function softShadow(g, x, y, rx, ry, a=0.14){
  g.fillStyle=`rgba(0,0,0,${a})`; g.beginPath(); g.ellipse(x,y,rx,ry,0,0,7); g.fill();
}

function drawFootstool(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "rest";
  const P = POSE[mode] || POSE.rest;
  const cx = W*P.cx, cy = H*P.cy, s = W*P.s;
  const gy = H*FLOOR_Y;    // the hall floor: the neutral pose stands exactly on it
  const G = stoolGeom(cx, cy, s, P.rot, P.tilt);

  /* ---------------- FLOOR ---------------- */
  if (P.floor) drawFloor(g, pen, W, gy);
  if (P.shadow) softShadow(g, cx+s*0.16, mode==="rest" ? gy-4 : gy+6, s*0.98, s*0.16, mode==="rest"?0.16:0.10);

  /* -------- AIM: sight line out to a target reticle -------- */
  if (P.aim){
    const tx = W*0.845, ty = H*0.470;
    g.strokeStyle="rgba(0,0,0,0.55)"; g.lineWidth=7; g.lineCap="butt"; g.setLineDash([22,17]);
    g.beginPath(); g.moveTo(cx+s*0.9, cy+s*0.1); g.lineTo(tx-s*0.40, ty); g.stroke();
    g.setLineDash([]);
    // reticle: four corner brackets + a crosshair (all geometry, no type)
    const r = s*0.34, k = r*0.42;
    g.strokeStyle=INK; g.lineWidth=8; g.lineCap="butt";
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy])=>{
      g.beginPath();
      g.moveTo(tx+sx*r, ty+sy*r - sy*k); g.lineTo(tx+sx*r, ty+sy*r);
      g.lineTo(tx+sx*r - sx*k, ty+sy*r); g.stroke();
    });
    g.lineWidth=6;
    g.beginPath(); g.moveTo(tx-r*0.34,ty); g.lineTo(tx+r*0.34,ty);
    g.moveTo(tx,ty-r*0.34); g.lineTo(tx,ty+r*0.34); g.stroke();
    g.fillStyle=ACCENT; g.beginPath(); g.arc(tx,ty,r*0.14,0,7); g.fill();
  }

  /* -------- FLIGHT: parabolic arc from throw point to the shoulder -------- */
  if (P.arc){
    const p0={x:W*0.135,y:H*0.585}, p1={x:W*0.875,y:H*0.455}, cp={x:W*0.50,y:H*0.075};
    g.strokeStyle="rgba(0,0,0,0.55)"; g.lineWidth=7; g.lineCap="butt"; g.setLineDash([22,16]);
    g.beginPath(); g.moveTo(p0.x,p0.y); g.quadraticCurveTo(cp.x,cp.y,p1.x,p1.y); g.stroke();
    g.setLineDash([]);
    g.fillStyle=INK; g.beginPath(); g.arc(p0.x,p0.y,9,0,7); g.fill();
    // chevron at the arc's end — where the corner will land
    g.strokeStyle=INK; g.lineWidth=8; g.lineCap="round";
    g.beginPath(); g.moveTo(p1.x-34,p1.y-26); g.lineTo(p1.x,p1.y); g.lineTo(p1.x-34,p1.y+26); g.stroke();
  }

  /* -------- SPIN: tumble ticks around the flying stool -------- */
  if (P.spin){
    g.strokeStyle="rgba(0,0,0,0.50)"; g.lineWidth=8; g.lineCap="round";
    for(let i=0;i<3;i++){ const a0=-0.7+i*2.15;
      g.beginPath(); g.arc(cx+s*0.1, cy-s*0.05, s*(1.24+i*0.16), a0, a0+0.58); g.stroke(); }
  }

  /* -------- IMPACT: contact bracket + burst rays + shock arcs -------- */
  if (P.burst){
    // the burst starts at the leading corner itself — the `contact:shoulder`
    // anchor — so the flash is welded to the geometry, not floating beside it
    const corner = G.T(1, 0);
    const ix = corner.x + s*0.10, iy = corner.y;
    g.strokeStyle=INK; g.lineWidth=8; g.lineCap="round";
    for(let i=0;i<7;i++){ const a = -Math.PI*0.66 + i*(Math.PI*1.32/6);
      const r0 = s*0.30, r1 = s*(0.66 + (i%2?0.24:0.0));
      g.beginPath();
      g.moveTo(ix+Math.cos(a)*r0, iy+Math.sin(a)*r0);
      g.lineTo(ix+Math.cos(a)*r1, iy+Math.sin(a)*r1); g.stroke(); }
    g.strokeStyle="rgba(0,0,0,0.48)"; g.lineWidth=7;
    for(let i=0;i<2;i++){ g.beginPath(); g.arc(ix, iy, s*(1.02+i*0.26), -Math.PI*0.52, Math.PI*0.52); g.stroke(); }
    if (P.shoulder){
      // the struck plane, as an abstract contact bracket — never a figure
      const bx = ix + s*0.72;
      g.strokeStyle=INK; g.lineWidth=7; g.lineCap="butt";
      g.beginPath();
      g.moveTo(bx, iy - s*0.62); g.lineTo(bx + s*0.22, iy - s*0.62);
      g.moveTo(bx + s*0.22, iy - s*0.62); g.lineTo(bx + s*0.22, iy + s*0.62);
      g.moveTo(bx + s*0.22, iy + s*0.62); g.lineTo(bx, iy + s*0.62); g.stroke();
    }
  }

  /* -------- FALL: motion ghosts of the two previous frames + dust -------- */
  if (P.ghosts){
    g.save(); g.globalAlpha=0.42;
    for(let i=2;i>=1;i--){
      const gg = stoolGeom(cx + s*0.44*i, cy - s*0.66*i, s*(1 - 0.05*i), P.rot - 0.52*i, P.tilt);
      drawStoolGhost(g, pen, gg);
    }
    g.restore();
  }
  if (P.dust){
    g.strokeStyle="rgba(0,0,0,0.48)"; g.lineWidth=7; g.lineCap="round";
    for(let i=0;i<6;i++){ const x = cx + s*(-1.0 + i*0.42), y = gy - 10 - (i%2)*16;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x - s*0.20, y - s*0.20); g.stroke(); }
  }

  /* -------- EVIDENCE: floor scuff + marker peg + leader -------- */
  if (P.scuff){
    g.fillStyle="rgba(0,0,0,0.13)";
    g.beginPath(); g.ellipse(cx + s*0.10, gy - s*0.02, s*1.15, s*0.22, 0,0,7); g.fill();
    g.strokeStyle="rgba(0,0,0,0.52)"; g.lineWidth=7; g.lineCap="round";
    for(let i=0;i<4;i++){ const x = cx - s*0.60 + i*s*0.44;
      g.beginPath(); g.moveTo(x, gy - s*0.14); g.lineTo(x + s*0.28, gy + s*0.04); g.stroke(); }
  }
  if (P.peg){
    const px = W*0.855, top = gy - s*0.98;
    pen.ink(()=>{ g.moveTo(px, gy+4); g.lineTo(px, top); }, 7);
    g.fillStyle=ACCENT; g.beginPath();
    g.moveTo(px, top); g.lineTo(px + s*0.36, top + s*0.16); g.lineTo(px, top + s*0.32); g.closePath(); g.fill();
    g.strokeStyle="rgba(0,0,0,0.52)"; g.lineWidth=7; g.setLineDash([16,13]);
    g.beginPath(); g.moveTo(cx + s*1.05, gy - s*0.30); g.lineTo(px - 10, gy - s*0.30); g.stroke();
    g.setLineDash([]);
  }

  /* ---------------- THE STOOL ---------------- */
  drawStool(g, pen, G);

  /* -------- GRIP: finger ticks along the seized rail + lift arrow -------- */
  if (P.grip){
    g.strokeStyle=INK; g.lineWidth=8; g.lineCap="round";
    for(let i=0;i<4;i++){
      const fx = -0.52 + i*0.30;
      const a = G.T(fx, G.th*0.10), b = G.T(fx, -G.th*0.52);
      g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
    }
    // thumb tick hooking under the front rail
    const t0 = G.T(-0.72, G.th*0.30), t1 = G.T(-1.05, G.th*0.55);
    g.beginPath(); g.moveTo(t0.x,t0.y); g.lineTo(t1.x,t1.y); g.stroke();
  }
  if (P.lift){
    const ax = cx - s*0.05, ay0 = cy - s*0.92, ay1 = cy - s*1.34;
    g.strokeStyle=INK; g.lineWidth=9; g.lineCap="round";
    g.beginPath(); g.moveTo(ax, ay0); g.lineTo(ax, ay1); g.stroke();
    g.fillStyle=INK; g.beginPath();
    g.moveTo(ax, ay1 - s*0.20); g.lineTo(ax - s*0.14, ay1 + s*0.02);
    g.lineTo(ax + s*0.14, ay1 + s*0.02); g.closePath(); g.fill();
  }
}

/* ---- anchors + collision, COMPUTED from the neutral pose ----------------
   Never hand-written: they are read straight off stoolGeom() so they cannot
   drift when the carpentry proportions are tuned. */
function geomFor(mode){
  const P = POSE[mode];
  return stoolGeom(SRC_W*P.cx, SRC_H*P.cy, SRC_W*P.s, P.rot, P.tilt);
}
const REST = geomFor("rest");
const nrm = p => ({ x:+(p.x/SRC_W).toFixed(3), y:+(p.y/SRC_H).toFixed(3) });

const ANCHORS = (()=>{
  const G = REST, { th, legH, bx, by } = G;
  return {
    center:             nrm(G.T(bx/2, (by+th)/2)),   // centre of mass of the slab / tumble pivot
    "grip:rail":        nrm(G.T(0, th/2)),           // the front rail a hand seizes to throw
    "grip:leg":         nrm(G.T(-0.80, th+legH*0.5)),// a leg taken instead, for a low swing
    "support:top":      nrm(G.T(bx/2, by/2)),        // top face — its proper use, a foot rest
    "rest:feet":        nrm(G.T(bx/2, by/2)),        // where a seated guest's feet go
    "contact:shoulder": nrm(G.T(1, 0)),              // the leading corner that strikes
    "contact:floor":    nrm(G.T(bx/2, th+legH)),     // four-leg floor footprint centre
    "contact:table":    nrm(G.T(0, 0)),              // tucked-under-the-table contact edge
    "mark:landing":     nrm(geomFor("evidence").T(0, 0.35)), // where it comes to rest
  };
})();

const BOUNDS = (()=>{
  const G = REST, { th, legH, bx, by } = G;
  const pts = [G.T(-1,by), G.T(1+bx,by), G.T(-1,th+legH), G.T(1+bx,th+legH)];
  const xs = pts.map(p=>p.x), ys = pts.map(p=>p.y);
  return { x0:+(Math.min(...xs)/SRC_W).toFixed(3), y0:+(Math.min(...ys)/SRC_H).toFixed(3),
           x1:+(Math.max(...xs)/SRC_W).toFixed(3), y1:+(Math.max(...ys)/SRC_H).toFixed(3) };
})();

export const asset = {
  id:"prop.thrown-footstool",
  type:"PROP",
  name:"Thrown Footstool",
  statusWord:"AT TABLE",
  scene:"OD-B17-S05",

  params,
  // back -> front draw order the module honors
  layers:["floor","shadow","sight-line","flight-arc","impact-burst","motion-ghosts",
          "scuff-and-peg","spin","back-legs","side-face","front-rail","top-face",
          "fret-band","front-legs","grip-ticks","lift-arrow"],

  // normalized 0..1 grip / support / contact anchors, measured in the neutral
  // `rest` pose; the runtime re-derives them under rot/tilt from `center`.
  anchors: ANCHORS,
  // collision shape: an axis-aligned box around the slab + legs (neutral pose)
  collision:{ kind:"box", bounds:BOUNDS },
  zones:{
    bounds: BOUNDS,
    // the usable top surface — where feet rest, and the plane a suitor grabs across
    footpad:{ x0:BOUNDS.x0, y0:BOUNDS.y0, x1:BOUNDS.x1, y1:ANCHORS["contact:table"].y },
  },
  ownership:"megaron-hall",   // house furniture of Odysseus; seized by Antinous

  states:{
    initial:"rest",
    nodes:{
      rest:     { preview:{ mode:"rest",     status:"AT TABLE",  progress:0.10 } },
      lift:     { preview:{ mode:"lift",     status:"SEIZED",    progress:0.26 } },
      aim:      { preview:{ mode:"aim",      status:"AIMED",     progress:0.42 } },
      flight:   { preview:{ mode:"flight",   status:"IN FLIGHT", progress:0.60 } },
      impact:   { preview:{ mode:"impact",   status:"STRUCK",    progress:0.76 } },
      fall:     { preview:{ mode:"fall",     status:"FALLING",   progress:0.88 } },
      evidence: { preview:{ mode:"evidence", status:"EVIDENCE",  progress:1.00 } },
    },
    edges:[
      ["rest","lift"],["lift","aim"],["aim","flight"],["flight","impact"],
      ["impact","fall"],["fall","evidence"],["evidence","rest"],
      ["lift","rest"],["aim","lift"],
    ],
  },
  channels:["mode","rot","tilt","t"],

  preview:()=>({ mode:"rest", status:"AT TABLE", progress:0.10, t:0 }),
  draw(ctx,W,H,state){
    drawFootstool(ctx,W,H,state||{});
    return { anchors:asset.anchors, collision:asset.collision, zones:asset.zones };
  },
};
export default asset;
