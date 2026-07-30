/* prop.raised-dining-tables — the low three-legged dining tables of the
   megaron: the same carpentry the feast is served on, and the same carpentry
   the suitors snatch up and hold in front of them when the arrows start.
   PROP asset. Drawn in SOLID grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B22-S02): furniture shifting from feast surface to
   improvised shields and obstacles. THREE identical tables (one per diner,
   Homeric fashion) are posed as rigid bodies so the SAME three objects
   reconfigure through every state instead of being redrawn as new furniture.
   Each table renders in one of two modes:
     STANDING — three-quarter from above: board top, front rail, turned-away
                side, two near legs + one far leg. The feast surface.
     FACED    — the board hauled upright and turned flat toward the camera:
                the big light underside, the thickness band along its lower
                edge, and the three legs foreshortened into splayed stubs
                pointing at the viewer. The shield / the obstacle.

   States:  SET · SHOVED · RAISED · BARRICADE · WRECKED

   Everything around the carpentry — grip ticks, tumble ghost, arrow strikes,
   spill, floor ticks, the blocked-lane mark, the height scale bar — is a
   procedural diagram overlay. No figures are baked in.
   Atlas: isolated reusable object; declared scale, grip/support/contact
   anchors, ownership, collision shape, all scene-required states. */
import { makePen, toneSolid, inkLevel, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const params = {
  owner:"house-of-odysseus",   // hall furniture; any diner may seize one
  count:3,                     // three tables, one per diner
  boardW:2.0,                  // board width, in half-width units
  boardD:1.02,                 // board depth, in half-width units
  slabTh:0.14,                 // board thickness, in half-width units
  legH:0.98,                   // leg length, in half-width units (a LOW table)
  legW:0.082,                  // leg half-width at the board
  notches:3,                   // carved notches in the front rail (few + large:
                               // the dot lattice eats anything finer)
  topLvl:1,                    // ink level: board face (the lightest plane)
  railLvl:3,                   // ink level: front rail
  sideLvl:4,                   // ink level: turned-away side
  legNearLvl:3,                // ink level: near legs
  legFarLvl:2,                 // ink level: far leg
  footLvl:4,                   // ink level: the squared leg ends
  collision:"box",
  scaleRef:"board top to floor",
};

const quad = (g,a,b,c,d)=>{ g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.lineTo(d.x,d.y); g.closePath(); };
const mid  = (a,b,t=0.5)=>({ x:lerp(a.x,b.x,t), y:lerp(a.y,b.y,t) });
const maxY = (pts)=> pts.reduce((m,p)=> p.y>m.y?p:m, pts[0]);

/* ---------------- STANDING: three-quarter-from-above rigid body ----------
   Local frame: origin at the CENTRE of the board's front edge-line, x to the
   right in half-widths, y down. `rot` rolls the whole body about that origin,
   `tilt` collapses the board's depth toward edge-on, `yaw` swings the depth
   direction so the three tables do not sit in one flat parade. */
function standGeom(W, H, T){
  const s = T.s * W, cx = T.cx * W, cy = T.cy * H;
  const rot = T.rot || 0, cos = Math.cos(rot), sin = Math.sin(rot);
  const L = (x,y)=>({ x: cx + (x*cos - y*sin)*s, y: cy + (x*sin + y*cos)*s });

  const dep = clamp(T.tilt ?? 0.9, 0, 1);
  const a   = (T.yaw || 0) + 0.55;
  const bx  =  0.62*Math.sin(a)*dep, by = -0.42*Math.cos(a)*dep;

  const th = params.slabTh, legH = params.legH, lw = params.legW;
  const leg = (x,y)=>({ a:L(x-lw,y), b:L(x+lw,y),
                        c:L(x+lw*0.58, y+legH), d:L(x-lw*0.58, y+legH) });
  const G = {
    mode:"stand", L, s, th, bx, by,
    FLt:L(-1,0),  FRt:L(1,0),  BRt:L(1+bx,by),    BLt:L(-1+bx,by),
    FLb:L(-1,th), FRb:L(1,th), BRb:L(1+bx,by+th), BLb:L(-1+bx,by+th),
    legs:{ fl:leg(-0.74,th), fr:leg(0.74,th), bk:leg(bx, by+th) },
    top:(u,v)=>L(u + bx*v, by*v),
  };
  G.centre = G.top(0, 0.5);
  G.floor  = maxY([G.legs.fl.c,G.legs.fl.d,G.legs.fr.c,G.legs.fr.d,
                   G.legs.bk.c,G.legs.bk.d,G.FLb,G.FRb,G.BRb,G.BLb]).y;
  return G;
}

/* ---------------- FACED: the board hauled upright, flat to the camera ----
   Local frame: origin at the CENTRE of the board's upper edge, x right, y
   down the board face. The depth of the tabletop now maps to screen-down, so
   the board reads at its true 2 : 1 proportion instead of collapsing. */
function faceGeom(W, H, T){
  const s = T.s * W, cx = T.cx * W, cy = T.cy * H;
  const rot = T.rot || 0, cos = Math.cos(rot), sin = Math.sin(rot);
  const L = (x,y)=>({ x: cx + (x*cos - y*sin)*s, y: cy + (x*sin + y*cos)*s });
  const dx = T.skew ?? 0.16, dy = params.boardD, th = params.slabTh;
  const G = {
    mode:"face", L, s, th, dx, dy,
    TL:L(-1,0), TR:L(1,0), BR:L(1+dx,dy), BL:L(-1+dx,dy),
    BLb:L(-1+dx,dy+th), BRb:L(1+dx,dy+th),
    top:(u,v)=>L(u + dx*v, dy*v),
  };
  G.centre = G.top(0, 0.5);
  G.floor  = maxY([G.BLb, G.BRb]).y;
  return G;
}
const geomOf = (W,H,T)=> (T.face ? faceGeom(W,H,T) : standGeom(W,H,T));

/* ---------------- a STANDING table ---------------- */
function drawStanding(g, pen, G, T){
  const P = params, u = G.s;

  pen.paint(()=>quad(g, G.legs.bk.a, G.legs.bk.b, G.legs.bk.c, G.legs.bk.d),
            toneSolid(inkLevel(P.legFarLvl)), 5);
  pen.paint(()=>quad(g, G.FRt, G.BRt, G.BRb, G.FRb), toneSolid(inkLevel(P.sideLvl)), 5);
  pen.paint(()=>quad(g, G.FLt, G.FRt, G.FRb, G.FLb), toneSolid(inkLevel(P.railLvl)), 5);

  // carved notches cut into the rail — light, and they break the rail's span
  for (let i=0;i<P.notches;i++){
    const f  = (i+1)/(P.notches+1);
    const c0 = mid(G.FLt,G.FRt,f-0.055), c1 = mid(G.FLt,G.FRt,f+0.055);
    const d0 = mid(G.FLb,G.FRb,f-0.055), d1 = mid(G.FLb,G.FRb,f+0.055);
    pen.paint(()=>quad(g, mid(c0,d0,0.28), mid(c1,d1,0.28), mid(c1,d1,0.76), mid(c0,d0,0.76)),
              toneSolid(inkLevel(0)), 3);
  }

  pen.paint(()=>quad(g, G.FLt, G.FRt, G.BRt, G.BLt), toneSolid(inkLevel(P.topLvl)), 5);
  grain(g, pen, G);

  for (const k of ["fl","fr"]){
    const l = G.legs[k];
    pen.paint(()=>quad(g, l.a, l.b, l.c, l.d), toneSolid(inkLevel(P.legNearLvl)), 5);
  }

  // split boards (WRECKED)
  splinters(g, pen, G, T.splinter||0);
  if (T.legBreak){
    const l = G.legs.fr, bA = mid(l.a,l.d,0.52), bB = mid(l.b,l.c,0.40);
    pen.ink(()=>{ g.moveTo(bA.x,bA.y);
                  g.lineTo(lerp(bA.x,bB.x,0.35), lerp(bA.y,bB.y,0.35)+u*0.11);
                  g.lineTo(lerp(bA.x,bB.x,0.70), lerp(bA.y,bB.y,0.70)-u*0.08);
                  g.lineTo(bB.x,bB.y); }, 4);
  }
}

/* ---------------- a FACED table (shield / obstacle) ----------------
   The board is hauled upright and its underside turned to the camera, so the
   three legs rake up and back over its far edge — the same silhouette the
   overturned tables make in the aftermath, which keeps the family readable. */
function drawFaced(g, pen, G, T){
  const P = params, u = G.s;

  // three legs raking up-and-back behind the board's far (upper) edge
  const rake = T.rake ?? 0.42;
  const n  = Math.hypot(rake, -0.94);
  const ex = rake/n * P.legH * u, ey = -0.94/n * P.legH * u;
  const px = -ey/Math.hypot(ex,ey) * P.legW*1.25*u;
  const py =  ex/Math.hypot(ex,ey) * P.legW*1.25*u;
  for (const lu of [-0.66, 0.02, 0.68]){
    const a0 = G.top(lu, 0.10);
    const A={x:a0.x+px,y:a0.y+py}, B={x:a0.x-px,y:a0.y-py};
    const C={x:B.x+ex*0.86,y:B.y+ey*0.86}, D={x:A.x+ex*0.86,y:A.y+ey*0.86};
    pen.paint(()=>quad(g,A,B,C,D), toneSolid(inkLevel(P.legNearLvl)), 5);
    // squared foot at the far end — leg width, one level darker, no blob
    const el = Math.hypot(ex,ey) || 1, fx = ex/el*0.17*u, fy = ey/el*0.17*u;
    pen.paint(()=>quad(g, C, D, {x:D.x+fx,y:D.y+fy}, {x:C.x+fx,y:C.y+fy}),
              toneSolid(inkLevel(P.footLvl)), 5);
  }

  // the board: one big light plane, the whole point of the shield
  pen.paint(()=>quad(g, G.TL, G.TR, G.BR, G.BL), toneSolid(inkLevel(P.topLvl)), 6);
  // thickness band along the lower edge — broken by notches so it cannot
  // stripe the frame as one solid bar
  pen.paint(()=>quad(g, G.BL, G.BR, G.BRb, G.BLb), toneSolid(inkLevel(P.sideLvl)), 5);
  for (let i=0;i<2;i++){
    const f = (i+1)/3;
    const c0=mid(G.BL,G.BR,f-0.06), c1=mid(G.BL,G.BR,f+0.06);
    const d0=mid(G.BLb,G.BRb,f-0.06), d1=mid(G.BLb,G.BRb,f+0.06);
    pen.paint(()=>quad(g, mid(c0,d0,0.24), mid(c1,d1,0.24), mid(c1,d1,0.80), mid(c0,d0,0.80)),
              toneSolid(inkLevel(0)), 3);
  }
  grain(g, pen, G);
  splinters(g, pen, G, T.splinter||0);
}

/* grain seams, BROKEN in two so nothing spans the board edge to edge.
   Kept at >=4.5px: anything thinner falls between the dot lattice samples
   and simply disappears in the POST pass. */
function grain(g, pen, G){
  for (const v of [0.36, 0.72]){
    const A=G.top(-0.84,v), B=G.top(-0.18,v), C=G.top(0.16,v), D=G.top(0.84,v);
    pen.seam(()=>{ g.moveTo(A.x,A.y); g.lineTo(B.x,B.y); }, 4.5);
    pen.seam(()=>{ g.moveTo(C.x,C.y); g.lineTo(D.x,D.y); }, 4.5);
  }
}
function splinters(g, pen, G, n){
  for (let i=0;i<n;i++){
    const u0 = -0.62 + i*0.74;
    const a0=G.top(u0,0.04), a1=G.top(u0+0.16,0.34), a2=G.top(u0-0.06,0.62), a3=G.top(u0+0.18,0.94);
    pen.ink(()=>{ g.moveTo(a0.x,a0.y); g.lineTo(a1.x,a1.y); g.lineTo(a2.x,a2.y); g.lineTo(a3.x,a3.y); }, 5.5);
  }
}

/* ---------------- things that sit ON a standing board ---------------- */
function drawCup(g, pen, p, u){
  const w = 0.24*u, h = 0.34*u;
  pen.paint(()=>{ g.rect(p.x-w*0.62, p.y-0.045*u, w*1.24, 0.062*u); }, toneSolid(inkLevel(3)), 4);
  pen.paint(()=>{ g.rect(p.x-w*0.17, p.y-h*0.56, w*0.34, h*0.56); }, toneSolid(inkLevel(2)), 4);
  pen.paint(()=>{ g.moveTo(p.x-w,p.y-h); g.lineTo(p.x+w,p.y-h);
                  g.lineTo(p.x+w*0.40,p.y-h*0.52); g.lineTo(p.x-w*0.40,p.y-h*0.52); g.closePath(); },
            toneSolid(inkLevel(1)), 4);
  pen.ink(()=>{ g.moveTo(p.x-w,p.y-h*0.95); g.lineTo(p.x-w*1.36,p.y-h*0.74); g.lineTo(p.x-w*0.98,p.y-h*0.54); }, 3.2);
  pen.ink(()=>{ g.moveTo(p.x+w,p.y-h*0.95); g.lineTo(p.x+w*1.36,p.y-h*0.74); g.lineTo(p.x+w*0.98,p.y-h*0.54); }, 3.2);
}
function drawLoaf(g, pen, p, u, tipped=false){
  const r = 0.30*u, k = tipped ? -0.34 : 0;
  pen.paint(()=>{ g.moveTo(p.x-r,p.y); g.lineTo(p.x-r*0.92,p.y-r*0.58+k*r);
                  g.lineTo(p.x-r*0.42,p.y-r*0.92+k*r); g.lineTo(p.x+r*0.42,p.y-r*0.92+k*r);
                  g.lineTo(p.x+r*0.92,p.y-r*0.58+k*r); g.lineTo(p.x+r,p.y); g.closePath(); },
            toneSolid(inkLevel(2)), 5);
  pen.seam(()=>{ g.moveTo(p.x-r*0.46,p.y-r*0.34+k*r); g.lineTo(p.x+r*0.46,p.y-r*0.34+k*r); }, 2.8);
  pen.seam(()=>{ g.moveTo(p.x,p.y-r*0.86+k*r); g.lineTo(p.x,p.y-r*0.46+k*r); }, 2.8);
}

/* ---------------- diagram overlays ---------------- */
function drawArrow(g, pen, p, ang, u){
  const Ln = 0.74*u, dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
  pen.ink(()=>{ g.moveTo(p.x,p.y); g.lineTo(p.x+dx*Ln, p.y+dy*Ln); }, Math.max(6, 0.075*u));
  for (let i=0;i<3;i++){
    const f = 0.68 + i*0.11, q = { x:p.x+dx*Ln*f, y:p.y+dy*Ln*f };
    pen.ink(()=>{ g.moveTo(q.x-nx*0.13*u, q.y-ny*0.13*u); g.lineTo(q.x+nx*0.13*u, q.y+ny*0.13*u); }, 5);
  }
  pen.paint(()=>{ g.moveTo(p.x, p.y-0.10*u); g.lineTo(p.x+0.10*u, p.y);
                  g.lineTo(p.x, p.y+0.10*u); g.lineTo(p.x-0.10*u, p.y); g.closePath(); },
            toneSolid(inkLevel(6)), 4);
  for (const a of [0.8, 2.3, 4.0]){
    pen.ink(()=>{ g.moveTo(p.x,p.y); g.lineTo(p.x+Math.cos(ang+a)*0.24*u, p.y+Math.sin(ang+a)*0.24*u); }, 4.5);
  }
}
/* right-angle tick where a hand has hold of an edge */
function drawGripTick(g, pen, p, u, sx=-1){
  pen.ink(()=>{ g.moveTo(p.x+sx*0.19*u, p.y-0.22*u);
                g.lineTo(p.x+sx*0.19*u, p.y+0.02*u);
                g.lineTo(p.x+sx*0.02*u, p.y+0.02*u); }, 5.5);
}
function drawGhost(g, pen, W, H, T){
  const G = standGeom(W, H, { ...T, face:false, rot:(T.ghostRot ?? 0),
                              tilt:Math.min(0.95,(T.tilt??0.8)+0.18) });
  g.save(); g.setLineDash([14,12]);
  pen.ink(()=>quad(g, G.FLt, G.FRt, G.BRt, G.BLt), 5);
  pen.ink(()=>{ g.moveTo(G.legs.fl.a.x,G.legs.fl.a.y); g.lineTo(G.legs.fl.d.x,G.legs.fl.d.y); }, 5);
  pen.ink(()=>{ g.moveTo(G.legs.fr.b.x,G.legs.fr.b.y); g.lineTo(G.legs.fr.c.x,G.legs.fr.c.y); }, 5);
  g.restore();
}
function drawFloorTicks(g, pen, G){
  const u = G.s;
  const pts = G.mode==="stand"
    ? ["fl","fr","bk"].map(k=>mid(G.legs[k].c, G.legs[k].d, 0.5))
    : [mid(G.BLb,G.BRb,0.16), mid(G.BLb,G.BRb,0.52), mid(G.BLb,G.BRb,0.88)];
  for (const p of pts){
    pen.ink(()=>{ g.moveTo(p.x-0.26*u, p.y+0.06*u); g.lineTo(p.x+0.26*u, p.y+0.06*u); }, 5);
  }
}
function drawSpill(g, pen, cx, cy, rw, rh, seed){
  const R = rnd(seed), n = 11;
  pen.paint(()=>{
    for (let i=0;i<n;i++){
      const a = (i/n)*Math.PI*2, k = 0.60 + R()*0.58;
      const x = cx + Math.cos(a)*rw*k, y = cy + Math.sin(a)*rh*k;
      if (i===0) g.moveTo(x,y); else g.lineTo(x,y);
    }
    g.closePath();
  }, toneSolid(inkLevel(2)), 4);
}
/* declared scale: a capped bar measuring board-top to floor */
function drawScaleBar(g, pen, W, G){
  const u = G.s;
  const x = Math.max(W*0.070, (G.mode==="stand"?G.FLt.x:G.TL.x) - 0.42*u);
  const yTop = (G.mode==="stand"?G.FLt.y:G.TL.y), yBot = G.floor;
  pen.ink(()=>{ g.moveTo(x, yTop); g.lineTo(x, yBot); }, 6);
  pen.ink(()=>{ g.moveTo(x-0.17*u, yTop); g.lineTo(x+0.17*u, yTop); }, 6);
  pen.ink(()=>{ g.moveTo(x-0.17*u, yBot); g.lineTo(x+0.17*u, yBot); }, 6);
  pen.paint(()=>{ g.rect(x-0.075*u, (yTop+yBot)/2-0.075*u, 0.15*u, 0.15*u); }, toneSolid(inkLevel(6)), 3);
}
/* the blocked-lane mark: a run of chevrons stopped dead by the barricade */
function drawLane(g, pen, W, H){
  const u = W*0.062, y = H*0.845;
  for (let i=0;i<3;i++){
    const x = W*(0.16 + i*0.090);
    pen.ink(()=>{ g.moveTo(x, y-u*0.46); g.lineTo(x+u*0.46, y); g.lineTo(x, y+u*0.46); }, 6);
  }
  const bx = W*0.462;
  pen.paint(()=>{ g.rect(bx, y-u*0.70, u*0.20, u*1.40); }, toneSolid(inkLevel(6)), 4);
  pen.ink(()=>{ g.moveTo(bx+u*0.50, y-u*0.48); g.lineTo(bx+u*1.00, y+u*0.48); }, 6);
  pen.ink(()=>{ g.moveTo(bx+u*1.00, y-u*0.48); g.lineTo(bx+u*0.50, y+u*0.48); }, 6);
}

/* ---------------- the five configurations of the same three tables ------- */
const CONFIG = {
  set: {
    status:"SET", progress:0.12, scaleRef:2,
    tables:[
      { cx:0.256, cy:0.322, s:0.150, rot: 0.00, tilt:0.94, yaw:-0.32, laden:2, floor:true, shadow:true },
      { cx:0.716, cy:0.410, s:0.162, rot:-0.02, tilt:0.88, yaw: 0.44, laden:1, floor:true, shadow:true },
      { cx:0.426, cy:0.590, s:0.205, rot: 0.02, tilt:0.86, yaw: 0.04, laden:2, floor:true, shadow:true },
    ],
  },
  shoved: {
    status:"SHOVED", progress:0.34, spill:1, scaleRef:2,
    tables:[
      { cx:0.248, cy:0.334, s:0.150, rot:-0.12, tilt:0.92, yaw:-0.36, laden:1, floor:true, shadow:true },
      { cx:0.688, cy:0.372, s:0.154, rot: 0.66, tilt:0.68, yaw: 0.40, ghost:true, ghostRot:-0.02 },
      { cx:0.402, cy:0.602, s:0.205, rot:-0.18, tilt:0.82, yaw: 0.02, floor:true, shadow:true, grip:true },
    ],
  },
  raised: {
    status:"RAISED", progress:0.62, spill:1, scaleRef:2,
    tables:[
      { cx:0.252, cy:0.300, s:0.146, rot:-0.10, face:true, skew: 0.20, rake:-0.46, arrows:1, grip:true, shadow:true },
      { cx:0.752, cy:0.368, s:0.150, rot: 0.11, face:true, skew:-0.18, rake: 0.50, arrows:0, shadow:true },
      { cx:0.454, cy:0.552, s:0.208, rot:-0.03, face:true, skew: 0.12, rake: 0.40, arrows:2, grip:true, floor:true, shadow:true },
    ],
  },
  barricade: {
    status:"BARRICADE", progress:0.80, lane:true, scaleRef:0,
    tables:[
      { cx:0.348, cy:0.256, s:0.140, rot: 0.04, tilt:0.90, yaw:-0.30, floor:true, shadow:true },
      { cx:0.292, cy:0.512, s:0.176, rot:-0.07, face:true, skew: 0.20, rake:-0.52, arrows:1, grip:true, floor:true, shadow:true },
      { cx:0.716, cy:0.586, s:0.190, rot: 0.06, face:true, skew:-0.16, rake: 0.52, arrows:1, floor:true, shadow:true },
    ],
  },
  wrecked: {
    status:"WRECKED", progress:1.00, spill:1, scuff:true, scaleRef:-1,
    tables:[
      { cx:0.264, cy:0.398, s:0.148, rot: 2.88, tilt:0.54, yaw:-0.22, splinter:1, legBreak:true },
      { cx:0.730, cy:0.512, s:0.156, rot:-2.46, tilt:0.44, yaw: 0.30, splinter:1 },
      { cx:0.442, cy:0.664, s:0.206, rot: 3.06, tilt:0.62, yaw: 0.06, splinter:2, legBreak:true, arrows:1 },
    ],
  },
};

/* ---------------- the draw ---------------- */
function drawProp(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g   = ctx;
  const cfg = CONFIG[st && st.config] || CONFIG.set;
  const spill  = clamp(st && st.spill  != null ? st.spill  : (cfg.spill || 0), 0, 1);
  const strike = clamp(st && st.strike != null ? st.strike : 1, 0, 1);

  // back -> front by centre height
  const order = cfg.tables.map(T=>({ T, G: geomOf(W,H,T) })).sort((a,b)=> a.T.cy - b.T.cy);

  // ground shadows first, so nothing sits on top of its own shadow
  for (const { T, G } of order){
    if (!T.shadow) continue;
    g.fillStyle = "rgba(0,0,0,0.10)";
    g.beginPath();
    g.ellipse(G.centre.x, G.floor + G.s*(T.face?0.30:0.05), G.s*1.16, G.s*0.11, 0, 0, 7);
    g.fill();
  }

  // the spill of the interrupted feast, trodden across the floor. Kept below
  // the deepest table foot so it never hides behind a leg.
  if (spill > 0.05){
    drawSpill(g, pen, W*0.622, H*0.812, W*0.094*spill, H*0.029*spill, 20223);
    drawSpill(g, pen, W*0.288, H*0.842, W*0.062*spill, H*0.022*spill, 771);
    drawLoaf(g, pen, { x:W*0.676, y:H*0.816 }, W*0.150, true);
    drawCup (g, pen, { x:W*0.264, y:H*0.846 }, W*0.108);
  }

  // the three tables
  for (const { T, G } of order){
    if (T.ghost) drawGhost(g, pen, W, H, T);
    if (T.face) drawFaced(g, pen, G, T); else drawStanding(g, pen, G, T);

    // laden: what the board carries while it is still a feast surface
    if (T.laden){
      drawLoaf(g, pen, G.top(-0.44, 0.44), G.s);
      if (T.laden > 1) drawCup(g, pen, G.top(0.42, 0.36), G.s);
    }
    // arrows and spear points buried in the boards
    const n = Math.round((T.arrows || 0) * (0.4 + 0.6*strike));
    for (let k=0;k<n;k++){
      const p = G.top(-0.34 + k*0.70, 0.34 + k*0.30);
      drawArrow(g, pen, p, -2.58 + k*0.50, G.s);
    }
    if (T.grip){
      const e = G.mode==="face" ? mid(G.TL,G.BL,0.45) : mid(G.FLt,G.FLb,0.5);
      drawGripTick(g, pen, e, G.s, -1);
      drawGripTick(g, pen, G.mode==="face" ? mid(G.TR,G.BR,0.45) : mid(G.FLt,G.FRt,0.20), G.s, +1);
    }
    if (T.floor) drawFloorTicks(g, pen, G);
  }

  // trodden scuff marks in the aftermath — short broken strokes, no long span
  if (cfg.scuff){
    for (let i=0;i<5;i++){
      const x = W*(0.24 + i*0.118), y = H*(0.792 + (i%2)*0.022);
      pen.ink(()=>{ g.moveTo(x, y); g.lineTo(x + W*0.050, y - H*0.011); }, 3);
    }
  }
  if (cfg.lane) drawLane(g, pen, W, H);

  // declared scale, measured off one named table
  if (cfg.scaleRef >= 0) drawScaleBar(g, pen, W, geomOf(W,H,cfg.tables[cfg.scaleRef]));
}

export const asset = {
  id:"prop.raised-dining-tables",
  type:"PROP",
  name:"Raised Dining Tables",
  statusWord:"SET",
  scene:"OD-B22-S02",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","spill","ghost","far-leg","side-face","front-rail","board",
          "near-legs","foot-caps","service","strikes","grip-marks","floor-ticks",
          "lane","scale-bar"],
  // normalized 0..1 anchors — grip / support / contact, valid across configs
  anchors:{
    "support:surface":{ x:.440, y:.556 },   // board top of the front table (dishes)
    "rest:cup":       { x:.498, y:.548 },   // where a kylix stands
    "grip:edge":      { x:.296, y:.606 },   // hand on the front edge, to raise it
    "grip:leg":       { x:.356, y:.700 },   // hand round a leg, to swing it
    "lift:pivot":     { x:.426, y:.590 },   // the roll axis when it comes up on edge
    "cover:body":     { x:.462, y:.620 },   // where a defender crouches behind it
    "strike:face":    { x:.430, y:.596 },   // where arrows and spears land
    "block:lane":     { x:.462, y:.812 },   // the point the obstacle closes
    "stack:top":      { x:.462, y:.470 },   // where a second table stacks
    "contact:floor":  { x:.436, y:.742 },   // floor footprint centre
  },
  // collision shape (AABB in 0..1) + named sub-volumes
  zones:{
    bounds:   { x0:.12, y0:.24, x1:.90, y1:.82 },
    surface:  { x0:.30, y0:.53, x1:.60, y1:.62 },
    barricade:{ x0:.24, y0:.42, x1:.80, y1:.78 },
  },
  states:{
    initial:"set",
    nodes:{
      set:      { preview:{ config:"set",       status:"SET",       progress:.12 } },
      shoved:   { preview:{ config:"shoved",    status:"SHOVED",    progress:.34 } },
      raised:   { preview:{ config:"raised",    status:"RAISED",    progress:.62 } },
      barricade:{ preview:{ config:"barricade", status:"BARRICADE", progress:.80 } },
      wrecked:  { preview:{ config:"wrecked",   status:"WRECKED",   progress:1.0 } },
    },
    edges:[["set","shoved"],["shoved","raised"],["raised","barricade"],
           ["barricade","wrecked"],["raised","wrecked"],["shoved","wrecked"],
           ["wrecked","set"]],
  },
  channels:["config","spill","strike","t"],

  // neutral preview: the tables as the feast leaves them. `spill` is left
  // unset so each config's own value drives it; pass a number to override.
  preview:()=>({ config:"set", strike:1, t:0, status:"SET", progress:.12 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
