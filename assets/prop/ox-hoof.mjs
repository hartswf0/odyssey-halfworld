/* prop.ox-hoof — the butchered ox foot that Ctesippus takes out of the basket
   and hurls at the beggar as his "guest-gift" (Book XX). PROP asset. One
   isolated reusable object: a foreleg sawn off below the knee — cut shank with
   the bone showing, fetlock knuckle, dewclaws, a sloping pastern and the
   cloven horn capsule. Drawn in SOLID grays + hard contour into the offscreen
   ctx; the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B20-S04):
     board    — the hoof lying on the carving plank among the feast meat, with
                the declared-scale caliper beside it. Its neutral, isolated state.
     seized   — taken by the shank, tipped back; grip ticks + lift arrow.
     aimed    — cocked, sight line running out to a reticle across the hall.
     flight   — tumbling along a parabola, spin ticks around it.
     dodge    — the near miss: the hoof past the mark, a ducked-head arc under
                it and a caliper measuring the clearance. Brackets, never figures.
     struck   — the wall: contact bracket on a broken masonry edge, burst rays,
                grease spatter thrown off the horn.
     fallen   — dropping to the boards with two motion ghosts and floor dust.
     evidence — come to rest: grease pool, scuff, marker peg on a dashed leader.
                The thing stays in the hall as the insult made physical.

   THE LOOK: the hide is a LIGHT plane (level 2) and almost the whole object;
   the horn capsule is the one dark mass and it is small; the coronet band and
   the sawn bone are the lightest notes, so the object reads light-with-dark-
   accents and plenty of paper shows. Nothing spans the frame: the plank, the
   wall joints and the horn growth rings are all broken runs. The declared
   length is drawn as seven-segment GEOMETRY, never as type. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp } from "../../engine/halfworld-engine.mjs";

/* the source frame the module is authored against, and the plank line in it */
const SRC_W = 660, SRC_H = 880, FLOOR_Y = 0.688;

const params = {
  // declared physical scale of the object (a bull's foreleg below the carpus)
  scale:{ unit:"cm", length:45, hoofWidth:12, mass_g:3200 },
  hornLen:0.36,     // horn capsule as a fraction of the total local length
  pastern:0.42,     // how far forward the pastern breaks (0 = a straight post)
  dewclaws:2,       // vestigial toes behind the fetlock
  tufts:3,          // hair tufts breaking the silhouette per site
  collision:"box",
};

/* ---- ink levels: light planes, dark accents, plenty of paper ---------- */
const HIDE    = 2;   // the hide of the shank — the object's body, the light plane
const SHADE   = 4;   // shading strip down the back of the leg (BROKEN runs)
const HORN_L  = 4;   // the horn capsule: the darkest broad plane, and it is small
const HORN_FAR= 6;   // the far claw, a sliver behind the near one
const CORONET = 1;   // the light band where hair meets horn
const RING    = 1;   // the sole lip: keeps the horn from printing as one solid mass
const CUT     = 3;   // sawn meat face
const BONE    = 1;   // the cannon bone in section — the lightest note
const MARROW  = 5;   // the marrow eye
const DEW     = 4;   // dewclaws
const PLANK   = 1;   // carving board top face
const PLANKED = 2;   // its front edge
const GREASE  = 1;   // grease pool / spatter fill
const STONE   = 2;   // wall face at the impact
const NUMERAL = 6;   // seven-segment bars

/* ---- the side profile, in local units ---------------------------------
   Local frame: origin at the centre of the sawn face, x forward (toward the
   toe), y down the leg. The object stands on its sole at y = +0.60 with
   rot = 0, so every pose is a rigid rotation of one honest silhouette. */
const OUTLINE = [
  // front (dorsal) edge: cut lip -> shank -> fetlock -> pastern break -> toe
  [ 0.20,-1.00],[ 0.17,-0.56],[ 0.20,-0.18],[ 0.27, 0.02],[ 0.37, 0.21],[ 0.42, 0.26],
  [ 0.66, 0.56],[ 0.62, 0.62],
  // sole, then back (palmar) edge: heel bulb -> knuckle -> shank -> cut lip
  [ 0.16, 0.62],[ 0.06, 0.46],[ 0.00, 0.14],[-0.10,-0.02],[-0.30,-0.20],
  [-0.14,-0.56],[-0.16,-1.00],
];
/* the horn capsule below the coronet — the hoof proper */
const HORN = [[0.42,0.26],[0.66,0.56],[0.62,0.62],[0.16,0.62],[0.06,0.46],[0.03,0.26]];
/* the sawn face, an oblique parallelogram (near lip -> far lip) */
const FACE = [[0.20,-1.00],[-0.16,-1.00],[-0.08,-1.13],[0.28,-1.13]];
/* the light band between hide and horn */
const BAND = [[0.03,0.26],[0.42,0.26],[0.345,0.180],[0.020,0.180]];
/* the sole seen edge-on: the light lip along the bottom of the horn */
const SOLE = [[0.17,0.585],[0.615,0.585],[0.62,0.62],[0.16,0.62]];
/* the back shading, BROKEN into two runs so it never reads as one long bar */
const SHADE_A = [[-0.158,-0.96],[-0.140,-0.56],[-0.278,-0.25],[-0.200,-0.25],[-0.070,-0.56],[-0.088,-0.96]];
const SHADE_B = [[-0.0875,0.00],[0.000,0.14],[0.019,0.24],[0.085,0.235],[0.068,0.13],[-0.020,-0.005]];

const poly = (g,T,pts)=>{ pts.forEach(([x,y],i)=>{ const p=T(x,y); i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y); }); g.closePath(); };
const shift = (pts,dx,dy)=> pts.map(([x,y])=>[x+dx,y+dy]);
function ellipsePts(cx,cy,rx,ry,n=14){
  const out=[]; for(let i=0;i<n;i++){ const a=i/n*Math.PI*2; out.push([cx+Math.cos(a)*rx, cy+Math.sin(a)*ry]); } return out;
}
function makeT(cx,cy,s,rot){
  const c=Math.cos(rot), si=Math.sin(rot);
  return (x,y)=>({ x: cx+(x*c-y*si)*s, y: cy+(x*si+y*c)*s });
}

/* ---- per-state rigid-body pose + which diagram overlays are live -------
   cx/cy are fractions of W/H, s is the local unit in fractions of W,
   rot is radians about the sawn-face centre. */
const POSE = {
  board:    { cx:0.485, cy:0.508, s:0.320, rot: 0.10, status:"ON THE BOARD", progress:0.10, plank:true, shadow:true, caliper:true },
  seized:   { cx:0.545, cy:0.470, s:0.272, rot:-0.62, status:"SEIZED",       progress:0.24, grip:true, lift:true },
  aimed:    { cx:0.345, cy:0.400, s:0.250, rot:-1.24, status:"AIMED",        progress:0.38, grip:true, aim:true },
  flight:   { cx:0.470, cy:0.420, s:0.248, rot: 1.42, status:"IN FLIGHT",    progress:0.54, arc:true, spin:true },
  dodge:    { cx:0.600, cy:0.360, s:0.248, rot: 2.34, status:"DODGED",       progress:0.68, spin:true, duck:true, miss:true },
  struck:   { cx:0.488, cy:0.427, s:0.246, rot:-0.75, status:"WALL STRUCK",  progress:0.82, wall:true, burst:true, splat:true },
  fallen:   { cx:0.455, cy:0.430, s:0.248, rot: 4.10, status:"FALLING",      progress:0.92, ghosts:true, floor:true, dust:true },
  evidence: { cx:0.436, cy:0.577, s:0.280, rot: 1.72, status:"EVIDENCE",     progress:1.00, floor:true, grease:true, peg:true },
};

/* ================= the object ================= */
function drawHoof(g, pen, T){
  /* far claw — a sliver of the second toe behind the near one */
  pen.paint(()=>poly(g,T,shift(HORN,-0.058,-0.032)), toneSolid(inkLevel(HORN_FAR)), 4);
  /* dewclaws behind the fetlock */
  [[-0.300,-0.105,0.058,0.046],[-0.320, 0.005,0.052,0.042]].forEach(([dx,dy,rx,ry])=>{
    pen.paint(()=>poly(g,T,ellipsePts(dx,dy,rx,ry,10)), toneSolid(inkLevel(DEW)), 4);
  });
  /* the hide — the light plane that is most of the object */
  pen.paint(()=>poly(g,T,OUTLINE), toneSolid(inkLevel(HIDE)), 5);
  /* back shading, two broken runs */
  pen.paint(()=>poly(g,T,SHADE_A), toneSolid(inkLevel(SHADE)), 0);
  pen.paint(()=>poly(g,T,SHADE_B), toneSolid(inkLevel(SHADE)), 0);
  /* tendon groove: two broken seams, never one full run */
  [[[0.03,-0.86],[0.04,-0.58]],[[0.05,-0.50],[0.07,-0.28]]].forEach(([a,b])=>{
    pen.seam(()=>{ const p=T(...a), q=T(...b); g.moveTo(p.x,p.y); g.lineTo(q.x,q.y); }, 4);
  });
  /* fetlock knuckle creases */
  [[[-0.22,-0.14],[-0.04,-0.07]],[[-0.08,-0.02],[ 0.12, 0.05]]].forEach(([a,b])=>{
    pen.seam(()=>{ const p=T(...a), q=T(...b); g.moveTo(p.x,p.y); g.lineTo(q.x,q.y); }, 4);
  });
  /* coronet: the light band that separates hide from horn */
  pen.paint(()=>poly(g,T,BAND), toneSolid(inkLevel(CORONET)), 4);
  /* the horn capsule — the one dark mass, and it is small */
  pen.paint(()=>poly(g,T,HORN), toneSolid(inkLevel(HORN_L)), 5);
  /* the sole, edge-on: a light lip that stops the horn going solid */
  pen.paint(()=>poly(g,T,SOLE), toneSolid(inkLevel(RING)), 4);
  /* the cleft between the two claws, running down the front wall */
  pen.ink(()=>{ const p=T(0.505,0.375), q=T(0.600,0.575); g.moveTo(p.x,p.y); g.lineTo(q.x,q.y); }, 6);
  /* the sawn face: meat ring, bone in section, marrow eye */
  pen.paint(()=>poly(g,T,FACE), toneSolid(inkLevel(CUT)), 5);
  pen.paint(()=>poly(g,T,ellipsePts(0.055,-1.065,0.115,0.048,14)), toneSolid(inkLevel(BONE)), 4);
  pen.paint(()=>poly(g,T,ellipsePts(0.055,-1.065,0.040,0.019,8)),  toneSolid(inkLevel(MARROW)), 3);
  /* hair tufts — short ticks that break the carpentered silhouette */
  g.strokeStyle=INK; g.lineWidth=6; g.lineCap="round";
  const tuft=(x,y,ax,ay)=>{ for(let i=0;i<params.tufts;i++){
    const k=(i-(params.tufts-1)/2)*0.075, p=T(x-k*ay, y+k*ax),
          q=T(x+ax*0.135-k*ay*1.35, y+ay*0.135+k*ax*1.35);
    g.beginPath(); g.moveTo(p.x,p.y); g.lineTo(q.x,q.y); g.stroke(); } };
  tuft(-0.168,-0.80,-0.92,-0.38); tuft(0.185,-0.78,0.92,-0.38); tuft(-0.245,-0.32,-0.95,0.28);
}

/* outline-only silhouette for the motion ghosts */
function drawGhost(g, pen, T){
  pen.ink(()=>poly(g,T,OUTLINE), 5);
  pen.ink(()=>poly(g,T,HORN), 5);
  pen.ink(()=>poly(g,T,FACE), 5);
}

/* ================= seven-segment numerals (GEOMETRY, never type) ======= */
const SEG = { 0:"abcdef",1:"bc",2:"abged",3:"abgcd",4:"fgbc",5:"afgcd",
              6:"afgedc",7:"abc",8:"abcdefg",9:"abcfgd" };
function drawDigit(g, x, y, h, d, color){
  const w=h*0.60, t=h*0.155, on=SEG[d]||"";
  const bar=(bx,by,bw,bh)=>{ g.fillStyle=color; g.fillRect(bx,by,bw,bh);
                             g.strokeStyle=INK; g.lineWidth=3; g.strokeRect(bx,by,bw,bh); };
  if(on.includes("a")) bar(x+t*0.5, y,             w-t,   t);
  if(on.includes("b")) bar(x+w-t,   y+t*0.5,       t,     h/2-t*0.75);
  if(on.includes("c")) bar(x+w-t,   y+h/2+t*0.25,  t,     h/2-t*0.75);
  if(on.includes("d")) bar(x+t*0.5, y+h-t,         w-t,   t);
  if(on.includes("e")) bar(x,       y+h/2+t*0.25,  t,     h/2-t*0.75);
  if(on.includes("f")) bar(x,       y+t*0.5,       t,     h/2-t*0.75);
  if(on.includes("g")) bar(x+t*0.5, y+h/2-t/2,     w-t,   t);
}
function drawNumber(g, n, x, y, h, color){
  const w=h*0.60, gap=h*0.20;
  String(n).split("").forEach((c,i)=> drawDigit(g, x+i*(w+gap), y, h, +c, color));
  return String(n).length*(w+gap)-gap;
}

/* ================= diagram overlays ================= */
/* the carving plank: ONE bounded board with clear ends, seen slightly from
   above. Never a full-width bar — it stops well inside both margins, and its
   grain is two broken runs. */
function drawPlank(g, pen, W, gy){
  const nl=W*0.185, nr=W*0.800, fl=W*0.255, fr=W*0.870, d=50, th=18;
  pen.paint(()=>{ g.moveTo(fl,gy-d); g.lineTo(fr,gy-d); g.lineTo(nr,gy); g.lineTo(nl,gy); g.closePath(); },
            toneSolid(inkLevel(PLANK)), 5);
  pen.paint(()=>{ g.moveTo(nl,gy); g.lineTo(nr,gy); g.lineTo(nr,gy+th); g.lineTo(nl,gy+th); g.closePath(); },
            toneSolid(inkLevel(PLANKED)), 5);
  // grain: two BROKEN runs across the top face, never one span
  [[0.30,0.48],[0.60,0.79]].forEach(([a,b])=>{
    pen.seam(()=>{ g.moveTo(W*a,gy-d*0.56); g.lineTo(W*b,gy-d*0.56); }, 4);
  });
}
/* the hall floor: three BROKEN runs and a few joint ticks, never one bar */
function drawFloor(g, pen, W, gy){
  [[0.09,0.30],[0.38,0.60],[0.70,0.92]].forEach(([a,b])=>
    pen.ink(()=>{ g.moveTo(W*a,gy); g.lineTo(W*b,gy); }, 5));
  g.strokeStyle="rgba(0,0,0,0.42)"; g.lineWidth=5; g.lineCap="round";
  for(let i=0;i<5;i++){ const x=W*(0.16+i*0.17);
    g.beginPath(); g.moveTo(x,gy+10); g.lineTo(x-W*0.032,gy+36); g.stroke(); }
}
function softShadow(g,x,y,rx,ry,a=0.13){
  g.fillStyle=`rgba(0,0,0,${a})`; g.beginPath(); g.ellipse(x,y,rx,ry,0,0,7); g.fill();
}

function drawHoofPiece(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "board";
  const P = POSE[mode] || POSE.board;
  const rot = (typeof st.rot === "number") ? st.rot : P.rot;
  const cx = W*P.cx, cy = H*P.cy, s = W*P.s, gy = H*FLOOR_Y;
  const T = makeT(cx, cy, s, rot);

  /* ---------------- ground / wall ---------------- */
  if (P.plank) drawPlank(g, pen, W, gy);
  if (P.floor) drawFloor(g, pen, W, gy);
  if (P.shadow) softShadow(g, cx+s*0.30, gy-20, s*0.58, s*0.10, 0.16);

  /* ---- declared scale: a slim caliper + a seven-segment length ---- */
  if (P.caliper){
    const bx = W*0.125, y0 = cy - s*1.15, y1 = gy - 22;
    g.strokeStyle="rgba(0,0,0,0.72)"; g.lineWidth=5; g.lineCap="butt";
    g.beginPath(); g.moveTo(bx,y0+30); g.lineTo(bx,y1-30); g.stroke();
    [y0,y1].forEach(y=>{ g.beginPath(); g.moveTo(bx-26,y); g.lineTo(bx+26,y); g.stroke(); });
    // arrowheads inward, so it reads as a measurement and not a post
    g.fillStyle=INK;
    [[y0,1],[y1,-1]].forEach(([y,d])=>{ g.beginPath();
      g.moveTo(bx, y+d*32); g.lineTo(bx-12, y+d*6); g.lineTo(bx+12, y+d*6); g.closePath(); g.fill(); });
    const h = 68, midY = (y0+y1)/2 - h/2;
    drawNumber(g, params.scale.length, bx+30, midY, h, inkLevel(NUMERAL));
  }

  /* ---- AIM: sight line out to a reticle ---- */
  if (P.aim){
    const tx=W*0.845, ty=H*0.455;
    g.strokeStyle="rgba(0,0,0,0.55)"; g.lineWidth=7; g.setLineDash([22,17]);
    g.beginPath(); g.moveTo(cx+s*0.55, cy+s*0.25); g.lineTo(tx-s*0.62, ty); g.stroke();
    g.setLineDash([]);
    const r=s*0.52, k=r*0.42;
    g.strokeStyle=INK; g.lineWidth=8; g.lineCap="butt";
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy])=>{ g.beginPath();
      g.moveTo(tx+sx*r, ty+sy*r-sy*k); g.lineTo(tx+sx*r, ty+sy*r);
      g.lineTo(tx+sx*r-sx*k, ty+sy*r); g.stroke(); });
    g.lineWidth=6;
    g.beginPath(); g.moveTo(tx-r*0.34,ty); g.lineTo(tx+r*0.34,ty);
    g.moveTo(tx,ty-r*0.34); g.lineTo(tx,ty+r*0.34); g.stroke();
    g.fillStyle=ACCENT; g.beginPath(); g.arc(tx,ty,r*0.15,0,7); g.fill();
  }

  /* ---- FLIGHT: the parabola from the suitors' bench to the wall ---- */
  if (P.arc){
    const p0={x:W*0.115,y:H*0.560}, p1={x:W*0.895,y:H*0.470}, cp={x:W*0.50,y:H*0.085};
    g.strokeStyle="rgba(0,0,0,0.55)"; g.lineWidth=7; g.setLineDash([22,16]);
    g.beginPath(); g.moveTo(p0.x,p0.y); g.quadraticCurveTo(cp.x,cp.y,p1.x,p1.y); g.stroke();
    g.setLineDash([]);
    g.fillStyle=INK; g.beginPath(); g.arc(p0.x,p0.y,9,0,7); g.fill();
    g.strokeStyle=INK; g.lineWidth=8; g.lineCap="round";
    g.beginPath(); g.moveTo(p1.x-34,p1.y-26); g.lineTo(p1.x,p1.y); g.lineTo(p1.x-34,p1.y+26); g.stroke();
  }
  /* ---- SPIN: tumble ticks ---- */
  if (P.spin){
    g.strokeStyle="rgba(0,0,0,0.50)"; g.lineWidth=8; g.lineCap="round";
    for(let i=0;i<3;i++){ const a0=-0.8+i*2.15;
      g.beginPath(); g.arc(cx, cy+s*0.05, s*(0.92+i*0.20), a0, a0+0.56); g.stroke(); }
  }

  /* ---- DODGE: the ducked head as an arc + the clearance caliper ---- */
  if (P.duck){
    const hx=W*0.300, hy=H*0.560;
    g.strokeStyle="rgba(0,0,0,0.55)"; g.lineWidth=8; g.lineCap="round"; g.setLineDash([20,15]);
    g.beginPath(); g.arc(hx, hy+s*0.55, s*0.80, -Math.PI*0.92, -Math.PI*0.08); g.stroke();
    g.setLineDash([]);
    // the mark that was missed: an abstract bracket, never a figure
    g.strokeStyle=INK; g.lineWidth=7; g.lineCap="butt";
    g.beginPath();
    g.moveTo(hx+s*0.34, hy-s*0.30); g.lineTo(hx+s*0.34, hy+s*0.62);
    g.moveTo(hx+s*0.34, hy-s*0.30); g.lineTo(hx+s*0.10, hy-s*0.30);
    g.moveTo(hx+s*0.34, hy+s*0.62); g.lineTo(hx+s*0.10, hy+s*0.62); g.stroke();
    // motion chevrons showing which way the head went
    g.lineCap="round";
    for(let i=0;i<2;i++){ const yy=hy-s*0.10+i*s*0.24;
      g.beginPath(); g.moveTo(hx-s*0.30, yy-s*0.16); g.lineTo(hx-s*0.52, yy); g.lineTo(hx-s*0.30, yy+s*0.16); g.stroke(); }
  }
  if (P.miss){
    const y = cy + s*0.10, x0 = W*0.352, x1 = cx - s*0.42;
    g.strokeStyle=INK; g.lineWidth=6;
    g.beginPath(); g.moveTo(x0,y); g.lineTo(x1,y); g.stroke();
    [x0,x1].forEach(x=>{ g.beginPath(); g.moveTo(x,y-22); g.lineTo(x,y+22); g.stroke(); });
    drawNumber(g, 1, (x0+x1)/2-17, y-104, 56, inkLevel(NUMERAL));
  }

  /* ---- STRUCK: broken masonry edge + burst + grease spatter ---- */
  if (P.wall){
    const wx = W*0.700, ww = W*0.170;
    // the struck wall: staggered light courses, BROKEN — never one dark slab
    [[0.180,0.320,0.000],[0.320,0.460,0.052],[0.460,0.600,0.000],[0.600,0.740,0.052]]
      .forEach(([a,b,off])=>{
        pen.paint(()=>{ g.moveTo(wx+W*off,H*a); g.lineTo(wx+ww,H*a);
                        g.lineTo(wx+ww,H*b);    g.lineTo(wx+W*off,H*b); g.closePath(); },
                  toneSolid(inkLevel(STONE)), 5);
      });
  }
  if (P.burst){
    const p = T(0.66,0.56);              // the toe — the leading contact point
    g.strokeStyle=INK; g.lineWidth=8; g.lineCap="round";
    for(let i=0;i<7;i++){ const a=Math.PI*0.38+i*(Math.PI*1.24/6);
      const r0=s*0.42, r1=s*(0.86+(i%2?0.30:0));
      g.beginPath(); g.moveTo(p.x+Math.cos(a)*r0, p.y+Math.sin(a)*r0);
      g.lineTo(p.x+Math.cos(a)*r1, p.y+Math.sin(a)*r1); g.stroke(); }
    g.strokeStyle="rgba(0,0,0,0.46)"; g.lineWidth=7;
    for(let i=0;i<2;i++){ g.beginPath(); g.arc(p.x,p.y,s*(1.28+i*0.32),Math.PI*0.50,Math.PI*1.50); g.stroke(); }
  }
  if (P.splat){
    const p = T(0.66,0.56);
    for(let i=0;i<9;i++){
      const a=Math.PI*0.45+i*(Math.PI*1.10/8), r=s*(1.06+((i*7)%5)*0.11);
      const x=p.x+Math.cos(a)*r, y=p.y+Math.sin(a)*r, rr=s*(0.05+((i*3)%4)*0.022);
      pen.paint(()=>poly(g,(u,v)=>({x:x+u*rr*8,y:y+v*rr*8}), ellipsePts(0,0,0.125,0.100,8)),
                toneSolid(inkLevel(GREASE)), 4);
    }
  }

  /* ---- FALL: motion ghosts + dust ---- */
  if (P.ghosts){
    g.save(); g.globalAlpha=0.32;
    for(let i=2;i>=1;i--) drawGhost(g, pen, makeT(cx+s*0.70*i, cy-s*0.86*i, s*(1-0.06*i), rot-0.62*i));
    g.restore();
  }
  if (P.dust){
    g.strokeStyle="rgba(0,0,0,0.48)"; g.lineWidth=7; g.lineCap="round";
    for(let i=0;i<6;i++){ const x=cx+s*(-0.9+i*0.38), y=gy-12-(i%2)*18;
      g.beginPath(); g.moveTo(x,y); g.lineTo(x-s*0.22,y-s*0.22); g.stroke(); }
  }

  /* ---- EVIDENCE: grease pool, scuff, marker peg ---- */
  if (P.grease){
    pen.paint(()=>poly(g,(u,v)=>({x:cx+u*s*0.95,y:gy-4+v*s*0.17}), ellipsePts(0.12,0,1.0,1.0,16)),
              toneSolid(inkLevel(GREASE)), 5);
    g.strokeStyle="rgba(0,0,0,0.50)"; g.lineWidth=7; g.lineCap="round";
    for(let i=0;i<4;i++){ const x=cx-s*0.75+i*s*0.50;
      g.beginPath(); g.moveTo(x,gy-s*0.22); g.lineTo(x+s*0.26,gy-s*0.02); g.stroke(); }
  }
  if (P.peg){
    const px=W*0.862, top=gy-s*1.10;
    pen.ink(()=>{ g.moveTo(px,gy+6); g.lineTo(px,top); }, 7);
    g.fillStyle=ACCENT; g.beginPath();
    g.moveTo(px,top); g.lineTo(px+s*0.40,top+s*0.18); g.lineTo(px,top+s*0.36); g.closePath(); g.fill();
    g.strokeStyle="rgba(0,0,0,0.52)"; g.lineWidth=7; g.setLineDash([16,13]);
    g.beginPath(); g.moveTo(cx+s*0.90, gy-s*0.42); g.lineTo(px-10, gy-s*0.42); g.stroke();
    g.setLineDash([]);
  }

  /* ---------------- THE HOOF ---------------- */
  drawHoof(g, pen, T);

  /* ---- GRIP: finger ticks on the seized shank + lift arrow ---- */
  if (P.grip){
    g.strokeStyle=INK; g.lineWidth=8; g.lineCap="round";
    for(let i=0;i<4;i++){ const u=-0.86+i*0.17;
      const a=T(-0.11,u), b=T(0.13,u);
      g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke(); }
    const t0=T(-0.17,-0.50), t1=T(-0.40,-0.60);
    g.beginPath(); g.moveTo(t0.x,t0.y); g.lineTo(t1.x,t1.y); g.stroke();
  }
  if (P.lift){
    const ax=cx-s*0.40, y0=cy-s*1.30, y1=cy-s*1.78;
    g.strokeStyle=INK; g.lineWidth=9; g.lineCap="round";
    g.beginPath(); g.moveTo(ax,y0); g.lineTo(ax,y1); g.stroke();
    g.fillStyle=INK; g.beginPath();
    g.moveTo(ax,y1-s*0.24); g.lineTo(ax-s*0.16,y1+s*0.02); g.lineTo(ax+s*0.16,y1+s*0.02); g.closePath(); g.fill();
  }
}

/* ---- anchors + collision, COMPUTED from the neutral pose --------------
   Read straight off the same transform the draw uses, so they cannot drift
   when the proportions are tuned. */
const NEUTRAL = POSE.board;
const NT = makeT(SRC_W*NEUTRAL.cx, SRC_H*NEUTRAL.cy, SRC_W*NEUTRAL.s, NEUTRAL.rot);
const nrm = p => ({ x:+clamp(p.x/SRC_W,0,1).toFixed(3), y:+clamp(p.y/SRC_H,0,1).toFixed(3) });

const ANCHORS = {
  center:            nrm(NT( 0.00,-0.14)),  // the fetlock: centre of mass / tumble pivot
  "grip:shank":      nrm(NT( 0.01,-0.62)),  // where a hand closes to throw it
  "grip:cut":        nrm(NT( 0.02,-0.94)),  // taken by the sawn end instead
  "grip:pastern":    nrm(NT( 0.15, 0.10)),  // a butcher's hold, hoof downward
  "support:sole":    nrm(NT( 0.39, 0.62)),  // stands on the plank here
  "contact:plank":   nrm(NT( 0.39, 0.62)),
  "contact:toe":     nrm(NT( 0.66, 0.56)),  // the leading point that strikes
  "contact:wall":    nrm(NT( 0.66, 0.56)),
  "contact:floor":   nrm(NT(-0.02, 0.30)),  // the flank it comes to rest on
  "mark:landing":    { x:0.436, y:FLOOR_Y-0.010 },
};

const BOUNDS = (()=>{
  const pts = [...OUTLINE, ...FACE, [-0.37,-0.10], [-0.37,0.01]].map(([x,y])=>NT(x,y));
  const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
  return { x0:+(Math.min(...xs)/SRC_W).toFixed(3), y0:+(Math.min(...ys)/SRC_H).toFixed(3),
           x1:+(Math.max(...xs)/SRC_W).toFixed(3), y1:+(Math.max(...ys)/SRC_H).toFixed(3) };
})();

export const asset = {
  id:"prop.ox-hoof",
  type:"PROP",
  name:"Ox Hoof",
  statusWord:"ON THE BOARD",
  scene:"OD-B20-S04",

  params,
  // back -> front draw order the module honors
  layers:["plank","shadow","caliper","sight-line","flight-arc","duck-arc","miss-caliper",
          "wall","impact-burst","grease-spatter","motion-ghosts","dust","grease-pool","peg",
          "far-claw","dewclaws","hide","back-shading","seams","coronet-band","horn",
          "growth-rings","cleft","cut-face","bone","marrow","hair-tufts","grip-ticks","lift-arrow"],

  // normalized 0..1 grip / support / contact anchors, measured in the neutral
  // `board` pose; the runtime re-derives them under rot from `center`.
  anchors: ANCHORS,
  collision:{ kind:"box", bounds:BOUNDS },
  zones:{
    bounds: BOUNDS,
    // the shank: the only part of the object a hand can actually close around
    graspable:{ x0:BOUNDS.x0, y0:BOUNDS.y0, x1:BOUNDS.x1, y1:ANCHORS["center"].y },
  },
  ownership:"megaron-hall · feast board (seized and thrown by Ctesippus)",

  states:{
    initial:"board",
    nodes:{
      board:    { preview:{ mode:"board",    status:"ON THE BOARD", progress:0.10 } },
      seized:   { preview:{ mode:"seized",   status:"SEIZED",       progress:0.24 } },
      aimed:    { preview:{ mode:"aimed",    status:"AIMED",        progress:0.38 } },
      flight:   { preview:{ mode:"flight",   status:"IN FLIGHT",    progress:0.54 } },
      dodge:    { preview:{ mode:"dodge",    status:"DODGED",       progress:0.68 } },
      struck:   { preview:{ mode:"struck",   status:"WALL STRUCK",  progress:0.82 } },
      fallen:   { preview:{ mode:"fallen",   status:"FALLING",      progress:0.92 } },
      evidence: { preview:{ mode:"evidence", status:"EVIDENCE",     progress:1.00 } },
    },
    edges:[
      ["board","seized"],["seized","aimed"],["aimed","flight"],["flight","dodge"],
      ["dodge","struck"],["struck","fallen"],["fallen","evidence"],
      ["seized","board"],["aimed","seized"],["evidence","board"],
    ],
  },
  channels:["mode","rot","t"],

  preview:()=>({ mode:"board", status:"ON THE BOARD", progress:0.10, t:0 }),
  draw(ctx,W,H,state){
    drawHoofPiece(ctx,W,H,state||{});
    return { anchors:asset.anchors, collision:asset.collision, zones:asset.zones };
  },
};
export default asset;
