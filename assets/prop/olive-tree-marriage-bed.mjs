/* prop.olive-tree-marriage-bed — the bed Odysseus built with his own hands
   around a living long-leaved olive that grew inside the courtyard: he lopped
   the crown, trimmed the trunk from the root up, dressed it true with the adze,
   bored it, and joined the whole frame to that ONE post — which is still rooted
   in the ground. PROP asset. Drawn in SOLID grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B23-S04, The Bed Test): the object that decides the plot.
   It has to carry, as visible procedural structure and not as caption:
     · the ROOTED POST — one corner is a stump, knobbly, lop-scarred, and it
       continues DOWN through a cut-away floor into a root mass.
     · the CARVED FRAME — three ordinary squared posts, rails bored with square
       mortises, headboard and footboard with inlay lozenges (gold/silver/ivory
       read as ink levels, since colour cannot survive the quantizer).
     · the STRAPS — ox-hide thongs woven taut across the frame, over-and-under.
     · the BEDDING — fleeces and a coverlet with a scalloped hem and a pillow.
     · the SECRET CONSTRUCTION HISTORY — the ghost of the lopped crown dashed in
       above the post, the growth-ring section, the mortise-and-tenon marks.
     · the FALSE-MOVE TEST — a dashed ghost of the bed displaced, a heavy push
       vector, a blocked bar with an X, and a root anchor pin. The move fails.

   States: MADE · STRIPPED · IMMOVABLE · ROOTED · REUNION
   No figures are baked in; every diagram mark is procedural overlay.
   Atlas: isolated reusable object; declared scale, grip/support/contact anchors,
   ownership, collision shape, all scene-required states. */
import { makePen, toneSolid, inkLevel, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  owner:"odysseus-and-penelope", // built by his own hands; the marriage token
  rootedPost:"head-near",        // WHICH corner is the living olive stump
  movable:false,                 // the whole point: it cannot be carried out
  lenUnits:2.0,                  // bed length, in half-length units
  widUnits:1.24,                 // bed width, same units (a 2 : 1.24 couch)
  bedH:0.44,                     // frame top above the floor
  railTh:0.13,                   // side-rail depth
  mortises:7,                    // bored square holes along the near rail
  strapsAcross:8,                // ox-hide thongs, head-to-foot count
  strapsAlong:4,                 // ox-hide thongs, side-to-side count
  frameLvl:2,                    // ink: carpentered oak
  faceLvl:3,                     // ink: rail outer faces
  planeLvl:1,                    // ink: the big light planes (boards, coverlet)
  trunkLvl:2,                    // ink: the olive stump body
  rootLvl:3,                     // ink: the root mass under the floor
  collision:"box",
  scaleRef:"mattress top to floor",
};

/* ---------------- oblique projection ----------------
   plan coords (a,b): a runs head(-1) -> foot(+1), b runs far(+) -> near(-).
   z runs UP from the floor plane. The two plan axes are deliberately
   non-parallel to the frame edges so no rail can stripe the picture flat. */
const AX = 1.00, AY = 0.10;      // length axis: right and slightly down
const BX = 0.30, BY = -0.30;     // width axis: right and up, into the picture

function geom(W, H, T){
  const s = T.s * W, cx = T.cx * W, cy = T.cy * H;
  const L = (a,b,z=0)=>({ x: cx + (a*AX + b*BX)*s, y: cy + (a*AY + b*BY)*s - z*s });
  return { s, cx, cy, L };
}
const quad = (g,a,b,c,d)=>{ g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.lineTo(d.x,d.y); g.closePath(); };
const add  = (p,dx,dy)=>({ x:p.x+dx, y:p.y+dy });

const A_END = 1.00, B_END = 0.62;          // frame footprint
const BED_H = params.bedH, RAIL = params.railTh;

/* ---------------- a squared post ----------------
   Only three faces can be seen under this projection: the -b face (toward the
   viewer), the +a face (toward the foot end) and the top. */
function sqPost(g, pen, G, a, b, z0, z1, hw, fLvl, sLvl, tLvl){
  const L = G.L;
  pen.paint(()=>quad(g, L(a+hw,b-hw,z1), L(a+hw,b+hw,z1), L(a+hw,b+hw,z0), L(a+hw,b-hw,z0)),
            toneSolid(inkLevel(sLvl)), 5);
  pen.paint(()=>quad(g, L(a-hw,b-hw,z1), L(a+hw,b-hw,z1), L(a+hw,b-hw,z0), L(a-hw,b-hw,z0)),
            toneSolid(inkLevel(fLvl)), 5);
  pen.paint(()=>quad(g, L(a-hw,b-hw,z1), L(a+hw,b-hw,z1), L(a+hw,b+hw,z1), L(a-hw,b+hw,z1)),
            toneSolid(inkLevel(tLvl)), 5);
}

/* ---------------- a rail: a long box along one plan axis ----------------
   `along` = "a" (head-to-foot) or "b" (side-to-side). Drawn as outer face +
   top face. Never a bare span: the caller punches mortises through it. */
function rail(g, pen, G, along, fixed, from, to, zTop, th, w, fLvl, tLvl){
  const L = G.L;
  const P = along==="a" ? (t,o=0,z=0)=>L(t, fixed+o, z) : (t,o=0,z=0)=>L(fixed+o, t, z);
  pen.paint(()=>quad(g, P(from,0,zTop), P(to,0,zTop), P(to,0,zTop-th), P(from,0,zTop-th)),
            toneSolid(inkLevel(fLvl)), 5);
  pen.paint(()=>quad(g, P(from,0,zTop), P(to,0,zTop), P(to,w,zTop), P(from,w,zTop)),
            toneSolid(inkLevel(tLvl)), 5);
}

/* square bored mortises through the near rail: they let the thongs through,
   they are the auger-work of the story, and they break the rail's span. */
function mortises(g, pen, G, n){
  const L = G.L, zc = BED_H - RAIL*0.50, hz = RAIL*0.24, ha = 0.045;
  for (let i=0;i<n;i++){
    const a = lerp(-0.84, 0.84, n===1?0.5:i/(n-1));
    pen.paint(()=>quad(g, L(a-ha,-B_END,zc+hz), L(a+ha,-B_END,zc+hz),
                          L(a+ha,-B_END,zc-hz), L(a-ha,-B_END,zc-hz)),
              toneSolid(inkLevel(0)), 3);
  }
}

/* ---------------- the woven ox-hide straps ----------------
   Longitudinal bands laid first, transverse bands over them, then the
   longitudinal band redrawn inside every other crossing — a real over-and-under
   weave, and the paper between the thongs keeps the whole plane light. */
function straps(g, pen, G){
  const L = G.L, z = BED_H + 0.005;
  const A0=-0.86, A1=0.86, B0=-0.50, B1=0.50;
  const NT = params.strapsAcross, NL = params.strapsAlong;
  const ha = (A1-A0)/NT*0.32, hb = (B1-B0)/NL*0.32;
  const aOf = i=> lerp(A0,A1,(i+0.5)/NT), bOf = j=> lerp(B0,B1,(j+0.5)/NL);

  for (let j=0;j<NL;j++){ const b=bOf(j);
    pen.paint(()=>quad(g, L(A0,b-hb,z), L(A1,b-hb,z), L(A1,b+hb,z), L(A0,b+hb,z)),
              toneSolid(inkLevel(2)), 3);
  }
  for (let i=0;i<NT;i++){ const a=aOf(i);
    pen.paint(()=>quad(g, L(a-ha,B0,z), L(a+ha,B0,z), L(a+ha,B1,z), L(a-ha,B1,z)),
              toneSolid(inkLevel(1)), 3);
  }
  for (let i=0;i<NT;i++) for (let j=0;j<NL;j++){
    if ((i+j)%2) continue;
    const a=aOf(i), b=bOf(j);
    pen.paint(()=>quad(g, L(a-ha*1.5,b-hb,z), L(a+ha*1.5,b-hb,z), L(a+ha*1.5,b+hb,z), L(a-ha*1.5,b+hb,z)),
              toneSolid(inkLevel(2)), 2.5);
  }
}

/* ---------------- bedding: fleeces, coverlet, pillow ---------------- */
function bedding(g, pen, G, soft){
  const L = G.L, z = BED_H + 0.055;
  const A0 = -0.52, A1 = 0.96, HB = 0.60;
  // the big light plane
  pen.paint(()=>quad(g, L(A0,-HB,z), L(A1,-HB,z), L(A1,HB,z), L(A0,HB,z)),
            toneSolid(inkLevel(params.planeLvl)), 5);
  // near-side drape with a SCALLOPED hem, so the overhang is never one flat bar
  const zLo = BED_H - 0.30, n = 6;
  pen.paint(()=>{
    g.moveTo(L(A0,-HB,z).x, L(A0,-HB,z).y);
    g.lineTo(L(A1,-HB,z).x, L(A1,-HB,z).y);
    for (let i=n;i>=0;i--){
      const a = lerp(A0,A1,i/n), zz = zLo + (i%2 ? 0.055 : 0);
      const p = L(a,-HB,zz); g.lineTo(p.x,p.y);
    }
    g.closePath();
  }, toneSolid(inkLevel(3)), 5);
  // foot-end drape
  pen.paint(()=>quad(g, L(A1,-HB,z), L(A1,HB,z), L(A1,HB,BED_H-0.16), L(A1,-HB,BED_H-0.16)),
            toneSolid(inkLevel(2)), 5);
  // folds — broken, never edge to edge
  for (const a of [-0.16, 0.30, 0.72]){
    pen.seam(()=>{ const p=L(a,-0.50,z), q=L(a+0.05,0.02,z); g.moveTo(p.x,p.y); g.lineTo(q.x,q.y); }, 4);
    pen.seam(()=>{ const p=L(a+0.07,0.16,z), q=L(a+0.11,0.55,z); g.moveTo(p.x,p.y); g.lineTo(q.x,q.y); }, 4);
  }
  if (soft){ // the second coverlet thrown back at the reunion: one turned corner
    pen.paint(()=>quad(g, L(-0.52,-0.60,z+0.03), L(-0.10,-0.60,z+0.03),
                          L(-0.02,0.10,z+0.03), L(-0.44,0.10,z+0.03)),
              toneSolid(inkLevel(0)), 4.5);
  }
  // pillow at the head end
  const pz = z + 0.16;
  pen.paint(()=>quad(g, L(-0.90,-0.36,z), L(-0.58,-0.36,z), L(-0.58,-0.36,pz), L(-0.90,-0.36,pz)),
            toneSolid(inkLevel(2)), 5);
  pen.paint(()=>quad(g, L(-0.90,-0.36,pz), L(-0.58,-0.36,pz), L(-0.58,0.36,pz), L(-0.90,0.36,pz)),
            toneSolid(inkLevel(0)), 5);
  pen.seam(()=>{ const p=L(-0.74,-0.30,pz), q=L(-0.74,0.30,pz); g.moveTo(p.x,p.y); g.lineTo(q.x,q.y); }, 3.5);
}

/* ---------------- inlay lozenges: gold, silver, ivory ----------------
   Colour cannot survive the quantizer, so the three materials are three ink
   levels in a fixed order. Kept large — anything small dissolves in the dots. */
function inlay(g, pen, G, a, b0, b1, z, n){
  const L = G.L, lv = [5,3,0];
  for (let i=0;i<n;i++){
    const b = lerp(b0,b1,(i+0.5)/n), hb = (b1-b0)/n*0.30, hz = 0.075;
    pen.paint(()=>{ const c=L(a,b,z);
      g.moveTo(c.x, c.y-hz*G.s); g.lineTo(L(a,b+hb,z).x, L(a,b+hb,z).y);
      g.lineTo(c.x, c.y+hz*G.s); g.lineTo(L(a,b-hb,z).x, L(a,b-hb,z).y); g.closePath();
    }, toneSolid(inkLevel(lv[i%3])), 4);
  }
}

/* ---------------- THE ROOTED OLIVE POST ----------------
   Not a carpentered prism: a stump. Stacked segments of unequal girth, adze
   facets down the front, and lop scars where limbs were taken off. */
const GIRTH = [0.185, 0.168, 0.176, 0.155, 0.163, 0.140, 0.150];

function lopScar(g, pen, G, p, dx, dy, len, ht){
  const n = Math.hypot(dx,dy)||1, ux=dx/n, uy=dy/n, nx=-uy, ny=ux;
  const A = add(p, nx*ht, ny*ht), B = add(p, -nx*ht, -ny*ht);
  const C = add(B, ux*len, uy*len), D = add(A, ux*len, uy*len);
  pen.paint(()=>quad(g,A,B,C,D), toneSolid(inkLevel(3)), 5);
  // the cut face: light, with one ring inside it
  const C2 = add(C, ux*ht*0.55, uy*ht*0.55), D2 = add(D, ux*ht*0.55, uy*ht*0.55);
  pen.paint(()=>quad(g,C,D,D2,C2), toneSolid(inkLevel(1)), 4);
  pen.seam(()=>{ const m=add(C, (D.x-C.x)*0.5+ux*ht*0.28, (D.y-C.y)*0.5+uy*ht*0.28);
                 g.moveTo(m.x-nx*ht*0.42, m.y-ny*ht*0.42); g.lineTo(m.x+nx*ht*0.42, m.y+ny*ht*0.42); }, 3);
}

function olivePost(g, pen, G, a, b, z0, z1){
  const L = G.L, N = GIRTH.length;
  for (let k=0;k<N;k++){
    const za = lerp(z0,z1,k/N), zb = lerp(z0,z1,(k+1)/N), hw = GIRTH[k];
    pen.paint(()=>quad(g, L(a+hw,b-hw,zb), L(a+hw,b+hw,zb), L(a+hw,b+hw,za), L(a+hw,b-hw,za)),
              toneSolid(inkLevel(params.trunkLvl+1)), 5);
    pen.paint(()=>quad(g, L(a-hw,b-hw,zb), L(a+hw,b-hw,zb), L(a+hw,b-hw,za), L(a-hw,b-hw,za)),
              toneSolid(inkLevel(params.trunkLvl)), 5);
    // adze facet: one flat chip down the front of every second segment
    if (k%2===0){
      pen.paint(()=>quad(g, L(a-hw*0.55,b-hw,zb-0.02), L(a+hw*0.10,b-hw,zb-0.02),
                            L(a+hw*0.10,b-hw,za+0.02), L(a-hw*0.55,b-hw,za+0.02)),
                toneSolid(inkLevel(1)), 3);
    }
  }
  const hwTop = GIRTH[N-1];
  pen.paint(()=>quad(g, L(a-hwTop,b-hwTop,z1), L(a+hwTop,b-hwTop,z1),
                        L(a+hwTop,b+hwTop,z1), L(a-hwTop,b+hwTop,z1)),
            toneSolid(inkLevel(1)), 5);
  // three lop scars: the limbs Odysseus took off before he made it a post
  lopScar(g, pen, G, L(a-GIRTH[4],b-GIRTH[4],lerp(z0,z1,0.70)), -0.92, -0.38, G.s*0.20, G.s*0.052);
  lopScar(g, pen, G, L(a+GIRTH[2],b+0.02,lerp(z0,z1,0.42)),      0.86, -0.50, G.s*0.16, G.s*0.044);
  lopScar(g, pen, G, L(a-GIRTH[6],b-GIRTH[6],lerp(z0,z1,0.94)), -0.62, -0.78, G.s*0.14, G.s*0.038);
}

/* the root mass below a cut-away floor: the reason the bed cannot travel */
function roots(g, pen, G, a, b, zFloor){
  const L = G.L, base = L(a, b, zFloor), u = G.s;
  const prong = (dx,dy,len,ht)=>{
    const n=Math.hypot(dx,dy)||1, ux=dx/n, uy=dy/n, nx=-uy, ny=ux;
    const A=add(base, nx*ht, ny*ht), B=add(base,-nx*ht,-ny*ht);
    const T=add(base, ux*len, uy*len);
    const C=add(T, -nx*ht*0.22, -ny*ht*0.22), D=add(T, nx*ht*0.22, ny*ht*0.22);
    pen.paint(()=>quad(g,A,B,C,D), toneSolid(inkLevel(params.rootLvl)), 5);
  };
  prong(-0.86, 0.52, u*0.44, u*0.052);
  prong(-0.34, 0.94, u*0.40, u*0.046);
  prong( 0.42, 0.90, u*0.34, u*0.042);
  prong( 0.92, 0.44, u*0.30, u*0.038);
  prong(-0.06, 1.00, u*0.52, u*0.062);   // the taproot
  // hair roots: short broken ticks, never a continuous fringe
  for (let i=0;i<7;i++){
    const ang = 1.05 + i*0.22, r0 = u*(0.20+((i*7)%5)*0.045);
    const p = add(base, Math.cos(ang)*r0, Math.sin(ang)*r0);
    pen.ink(()=>{ g.moveTo(p.x,p.y); g.lineTo(p.x+Math.cos(ang)*u*0.10, p.y+Math.sin(ang)*u*0.10); }, 3.2);
  }
}

/* the cut-away in the chamber floor, drawn as two broken hatched edges with a
   jagged bite taken out between them */
function floorCut(g, pen, G, a, b, W){
  const L = G.L, u = G.s, y = L(a,b,0).y, x = L(a,b,0).x;
  const band = (x0,x1)=>{
    pen.paint(()=>{ g.rect(x0, y, x1-x0, u*0.055); }, toneSolid(inkLevel(2)), 4);
    for (let t=x0+10; t<x1-6; t+=18){
      pen.ink(()=>{ g.moveTo(t, y+u*0.055); g.lineTo(t-9, y+u*0.115); }, 3);
    }
  };
  band(Math.max(W*0.045, x-u*0.86), x-u*0.34);
  band(x+u*0.40, x+u*1.02);
  // the jagged broken edge on both sides of the bite
  pen.ink(()=>{ let px=x-u*0.34, py=y;
    g.moveTo(px,py);
    for (let i=0;i<3;i++){ px+=u*0.045; py+=u*0.055*(i%2?-1:1); g.lineTo(px,py); } }, 4);
  pen.ink(()=>{ let px=x+u*0.40, py=y;
    g.moveTo(px,py);
    for (let i=0;i<3;i++){ px-=u*0.045; py+=u*0.055*(i%2?-1:1); g.lineTo(px,py); } }, 4);
}

/* the crown that was lopped away, dashed in above the post: the history */
function lostCrown(g, pen, G, a, b, zTop){
  const L = G.L, u = G.s, o = L(a,b,zTop);
  const seg = (x0,y0,x1,y1,lw)=> pen.ink(()=>{ g.moveTo(o.x+x0*u,o.y+y0*u); g.lineTo(o.x+x1*u,o.y+y1*u); }, lw);
  g.save(); g.setLineDash([13,10]);
  seg(0,-0.02, -0.10,-0.34, 4.5);  seg(-0.10,-0.34, -0.34,-0.56, 4);
  seg(-0.10,-0.34,  0.06,-0.62, 4);
  seg(0,-0.02,  0.16,-0.30, 4.5);  seg(0.16,-0.30,  0.42,-0.44, 4);
  seg(0.16,-0.30,  0.26,-0.62, 4);
  seg(-0.34,-0.56, -0.44,-0.74, 3.5); seg(0.26,-0.62, 0.40,-0.76, 3.5);
  g.restore();
  // the double chevron of the cut itself, solid
  pen.ink(()=>{ g.moveTo(o.x-u*0.16,o.y-u*0.10); g.lineTo(o.x,o.y-u*0.02); g.lineTo(o.x+u*0.16,o.y-u*0.10); }, 5.5);
  pen.ink(()=>{ g.moveTo(o.x-u*0.16,o.y-u*0.20); g.lineTo(o.x,o.y-u*0.12); g.lineTo(o.x+u*0.16,o.y-u*0.20); }, 5.5);
}

/* growth-ring section: proof it is one living body, not joinery */
function ringSection(g, pen, cx, cy, r){
  pen.paint(()=>{ g.ellipse(cx, cy, r, r*0.86, 0, 0, 7); }, toneSolid(inkLevel(1)), 5);
  for (let i=3;i>=1;i--){
    const f = i/4;
    pen.ink(()=>{ g.ellipse(cx, cy, r*f, r*0.86*f, 0, 0, 7); }, 3.4);
  }
  pen.paint(()=>{ g.ellipse(cx, cy, r*0.12, r*0.11, 0, 0, 7); }, toneSolid(inkLevel(6)), 3);
}

/* ---------------- diagram overlays ---------------- */
function pushVector(g, pen, p, ang, len, u){
  const dx=Math.cos(ang), dy=Math.sin(ang), nx=-dy, ny=dx;
  pen.ink(()=>{ g.moveTo(p.x,p.y); g.lineTo(p.x+dx*len, p.y+dy*len); }, Math.max(6, u*0.038));
  for (let i=0;i<3;i++){
    const f = 0.60 + i*0.12, q = { x:p.x+dx*len*f, y:p.y+dy*len*f };
    pen.ink(()=>{ g.moveTo(q.x-nx*u*0.07, q.y-ny*u*0.07); g.lineTo(q.x+nx*u*0.07, q.y+ny*u*0.07); }, 5);
  }
  pen.paint(()=>{ g.moveTo(p.x, p.y-u*0.055); g.lineTo(p.x+u*0.055, p.y);
                  g.lineTo(p.x, p.y+u*0.055); g.lineTo(p.x-u*0.055, p.y); g.closePath(); },
            toneSolid(inkLevel(6)), 4);
  // the block: a bar dead across the vector, crossed out
  const t = { x:p.x+dx*len, y:p.y+dy*len };
  pen.paint(()=>{ g.moveTo(t.x+nx*u*0.20, t.y+ny*u*0.20); g.lineTo(t.x-nx*u*0.20, t.y-ny*u*0.20);
                  g.lineTo(t.x-nx*u*0.20+dx*u*0.075, t.y-ny*u*0.20+dy*u*0.075);
                  g.lineTo(t.x+nx*u*0.20+dx*u*0.075, t.y+ny*u*0.20+dy*u*0.075); g.closePath(); },
            toneSolid(inkLevel(6)), 4);
  const X = { x:t.x+dx*u*0.24, y:t.y+dy*u*0.24 }, r = u*0.14;
  pen.ink(()=>{ g.moveTo(X.x-r,X.y-r); g.lineTo(X.x+r,X.y+r); }, 6);
  pen.ink(()=>{ g.moveTo(X.x+r,X.y-r); g.lineTo(X.x-r,X.y+r); }, 6);
}
function anchorPin(g, pen, p, u){
  pen.paint(()=>{ g.moveTo(p.x-u*0.085, p.y-u*0.11); g.lineTo(p.x+u*0.085, p.y-u*0.11);
                  g.lineTo(p.x, p.y+u*0.09); g.closePath(); }, toneSolid(inkLevel(6)), 4);
  for (let i=0;i<4;i++){
    const x = p.x - u*0.24 + i*u*0.16;
    pen.ink(()=>{ g.moveTo(x, p.y+u*0.13); g.lineTo(x-u*0.07, p.y+u*0.23); }, 3.6);
  }
}
function ghostBed(g, pen, G, dx, dy){
  const L = G.L, o=(a,b,z)=>add(L(a,b,z), dx, dy);
  g.save(); g.setLineDash([15,12]);
  pen.ink(()=>quad(g, o(-1,-B_END,BED_H), o(1,-B_END,BED_H), o(1,B_END,BED_H), o(-1,B_END,BED_H)), 5);
  for (const [a,b,z] of [[-1,-B_END,1.08],[-1,B_END,1.00],[1,-B_END,0.70],[1,B_END,0.70]]){
    const t=o(a,b,z), f=o(a,b,0);
    pen.ink(()=>{ g.moveTo(t.x,t.y); g.lineTo(f.x,f.y); }, 5);
  }
  pen.ink(()=>quad(g, o(-1,-B_END,0), o(1,-B_END,0), o(1,B_END,0), o(-1,B_END,0)), 4);
  g.restore();
}
function joinery(g, pen, G){   // dashed tenon running into the bored post
  const L = G.L, u = G.s;
  const p = L(-0.90,-B_END,BED_H-RAIL*0.5), q = L(-1.14,-B_END,BED_H-RAIL*0.5);
  g.save(); g.setLineDash([9,8]);
  pen.ink(()=>{ g.moveTo(p.x,p.y); g.lineTo(q.x,q.y); }, 4);
  g.restore();
  pen.paint(()=>{ g.rect(q.x-u*0.045, q.y-u*0.045, u*0.09, u*0.09); }, toneSolid(inkLevel(0)), 4);
}
function scaleBar(g, pen, G, W){
  const L = G.L, u = G.s;
  const x = Math.max(W*0.052, L(-1,-B_END,0).x - u*0.30);
  const yTop = L(0,0,BED_H).y, yBot = L(0,0,0).y;
  pen.ink(()=>{ g.moveTo(x,yTop); g.lineTo(x,yBot); }, 6);
  pen.ink(()=>{ g.moveTo(x-u*0.055,yTop); g.lineTo(x+u*0.055,yTop); }, 6);
  pen.ink(()=>{ g.moveTo(x-u*0.055,yBot); g.lineTo(x+u*0.055,yBot); }, 6);
  pen.paint(()=>{ g.rect(x-u*0.026,(yTop+yBot)/2-u*0.026, u*0.052, u*0.052); }, toneSolid(inkLevel(6)), 3);
}
function floorTicks(g, pen, G){
  const L = G.L, u = G.s;
  for (const [a,b] of [[-1,-B_END],[-1,B_END],[1,-B_END],[1,B_END]]){
    const p = L(a,b,0);
    pen.ink(()=>{ g.moveTo(p.x-u*0.10, p.y+u*0.022); g.lineTo(p.x+u*0.10, p.y+u*0.022); }, 5);
  }
}

/* ---------------- the five states of the one bed ---------------- */
const CONFIG = {
  made:       { status:"MADE",      progress:.20, bedding:1, soft:0, cut:0, ghost:0, push:0, crown:0, rings:0, scale:1 },
  stripped:   { status:"STRIPPED",  progress:.38, bedding:0, soft:0, cut:0, ghost:0, push:0, crown:0, rings:0, scale:1, joint:1 },
  "false-move":{status:"IMMOVABLE", progress:.66, bedding:0, soft:0, cut:1, ghost:1, push:1, crown:0, rings:0, scale:1 },
  secret:     { status:"ROOTED",    progress:.84, bedding:0, soft:0, cut:1, ghost:0, push:0, crown:1, rings:1, scale:1, joint:1 },
  reunion:    { status:"REUNION",   progress:1.0, bedding:1, soft:1, cut:0, ghost:0, push:0, crown:0, rings:0, scale:0 },
};

function drawProp(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const C = CONFIG[st && st.config] || CONFIG.made;
  const T = { cx:0.50, cy:0.615, s:0.300 };
  const G = geom(W,H,T), L = G.L, u = G.s;
  const cut = clamp(st && st.cutaway!=null ? st.cutaway : C.cut, 0, 1);

  /* ground shadow */
  g.fillStyle = "rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(L(0,0,0).x, L(0,0,0).y + u*0.06, u*1.16, u*0.20, 0, 0, 7); g.fill();

  /* the displaced bed that never happens */
  if (C.ghost) ghostBed(g, pen, G, u*0.30, u*0.10);
  /* the crown that was cut away, before the post so it sits behind it */
  if (C.crown) lostCrown(g, pen, G, -1, -B_END, 1.08);

  /* --- FAR side: posts, rail --- */
  sqPost(g, pen, G,  1, B_END, 0, 0.70, 0.070, params.frameLvl, params.frameLvl+1, params.planeLvl);
  sqPost(g, pen, G, -1, B_END, 0, 1.00, 0.078, params.frameLvl, params.frameLvl+1, params.planeLvl);
  rail(g, pen, G, "a", B_END, -A_END, A_END, BED_H, RAIL, -0.10, params.frameLvl, params.planeLvl);

  /* --- HEADBOARD between the two head posts --- */
  rail(g, pen, G, "b", -A_END, -B_END, B_END, 0.96, 0.30, 0.10, params.planeLvl, params.frameLvl);
  inlay(g, pen, G, -A_END, -0.44, 0.44, 0.81, 3);

  /* --- the woven straps --- */
  straps(g, pen, G);

  /* --- bedding --- */
  if (C.bedding) bedding(g, pen, G, C.soft);

  /* --- FOOT board + foot post (front-right) --- */
  rail(g, pen, G, "b", A_END, -B_END, B_END, 0.68, 0.20, -0.10, params.faceLvl, params.planeLvl);
  inlay(g, pen, G, A_END, -0.34, 0.34, 0.58, 2);
  sqPost(g, pen, G, 1, -B_END, 0, 0.72, 0.074, params.faceLvl, params.frameLvl, params.planeLvl);

  /* --- NEAR rail, bored --- */
  rail(g, pen, G, "a", -B_END, -A_END, A_END, BED_H, RAIL, 0.10, params.faceLvl, params.planeLvl);
  mortises(g, pen, G, params.mortises);

  /* --- THE ROOTED OLIVE POST (front-left) --- */
  olivePost(g, pen, G, -1, -B_END, 0, 1.08);

  /* --- what is under the floor --- */
  if (cut > 0.05){
    floorCut(g, pen, G, -1, -B_END, W);
    roots(g, pen, G, -1, -B_END, -0.02);
  }

  /* --- diagram overlays --- */
  if (C.joint) joinery(g, pen, G);
  if (C.rings) ringSection(g, pen, W*0.775, H*0.775, u*0.20);
  if (C.push){
    anchorPin(g, pen, add(L(-1,-B_END,0), 0, u*0.07), u);
    pushVector(g, pen, L(0.60,-0.78,0.20), 0.30, u*0.62, u);
  }
  if (!C.ghost) floorTicks(g, pen, G);
  if (C.scale) scaleBar(g, pen, G, W);
}

export const asset = {
  id:"prop.olive-tree-marriage-bed",
  type:"PROP",
  name:"Olive-Tree Marriage Bed",
  statusWord:"MADE",
  scene:"OD-B23-S04",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","ghost-bed","lost-crown","far-posts","far-rail","headboard",
          "inlay","straps","bedding","footboard","foot-post","near-rail",
          "mortises","olive-post","floor-cut","roots","joinery","ring-section",
          "push-vector","floor-ticks","scale-bar"],
  // normalized 0..1 anchors — grip / support / contact, stable across states
  anchors:{
    "support:mattress": { x:.500, y:.516 },  // the strap plane, centre
    "lie:near":         { x:.473, y:.523 },  // one sleeper — paired, never shared
    "lie:far":          { x:.590, y:.482 },  // the other sleeper
    "rest:head":        { x:.278, y:.481 },  // pillow end
    "rest:foot":        { x:.740, y:.520 },  // foot end of the couch
    "sit:edge":         { x:.444, y:.558 },  // where a body sits down on the rail
    "grip:post-rooted": { x:.144, y:.472 },  // the living olive post — the proof
    "grip:post-foot":   { x:.744, y:.544 },  // an ordinary post, and it IS movable
    "grip:rail-near":   { x:.444, y:.567 },  // handhold to attempt the lift
    "join:mortise":     { x:.186, y:.548 },  // bored joint, rail into the trunk
    "root:anchor":      { x:.144, y:.702 },  // where the bed is fixed to Ithaca
    "move:vector":      { x:.613, y:.634 },  // where the false move pushes
    "embrace:bedside":  { x:.232, y:.680 },  // floor beside it, where they meet
    "contact:floor":    { x:.500, y:.615 },  // footprint centre
  },
  // collision shape (AABB in 0..1) + named sub-volumes
  zones:{
    bounds:   { x0:.11, y0:.29, x1:.89, y1:.74 },
    mattress: { x0:.20, y0:.42, x1:.80, y1:.58 },
    rootzone: { x0:.04, y0:.60, x1:.32, y1:.75 },
  },
  states:{
    initial:"made",
    nodes:{
      made:        { preview:{ config:"made",        status:"MADE",      progress:.20 } },
      stripped:    { preview:{ config:"stripped",    status:"STRIPPED",  progress:.38 } },
      "false-move":{ preview:{ config:"false-move",  status:"IMMOVABLE", progress:.66 } },
      secret:      { preview:{ config:"secret",      status:"ROOTED",    progress:.84 } },
      reunion:     { preview:{ config:"reunion",     status:"REUNION",   progress:1.0 } },
    },
    edges:[["made","stripped"],["stripped","false-move"],["false-move","secret"],
           ["secret","reunion"],["stripped","made"],["false-move","stripped"],
           ["secret","made"],["reunion","made"]],
  },
  channels:["config","cutaway","bedding","t"],

  preview:()=>({ config:"made", t:0, status:"MADE", progress:.20 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
