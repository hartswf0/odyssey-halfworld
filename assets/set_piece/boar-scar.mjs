/* set_piece.boar-scar — the tusk-wound on Odysseus's right thigh, above the knee.
   SET_PIECE. Not a room and not a prop: a SEPARABLE BODY COMPONENT that attaches
   to a figure's right thigh and carries the plot. Drawn as a CLOSE-UP registration
   plate — the limb fills the frame as a light cylinder (hip cut to calf cut) with a
   hard contour and shaded outer/inner rims, crossed by the scar itself: a raised
   WELT ribbon with a dark SEAM core and pucker ticks stepping off it.
   A vertical measure rule on the right and seven-segment index numerals give the
   plate its diagrammatic frame; the CLOTH flap is the occluder that hides the
   marker until the leg is bared. States: hidden / bared / touched / fresh —
   `touched` adds the touch reticle and three fingertip contact pads laid across
   the ridge (Eurycleia's hand as an addressable target, never a baked-in figure),
   `fresh` reverts the welt to the open Parnassus gash with binding stitches, which
   is what makes the marker continuity-validating across the memory cut.
   The engine dotify pass supplies the halftone; nothing here is pre-dithered.
   Atlas: OD-B19-S04 — persistent body marker, addressable by touch, close-up,
   recognition trigger, continuity validation. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth, rnd } from "../../engine/halfworld-engine.mjs";

/* ---- normalized layout (anchors + draw share these fractions of W,H) ---- */
const L = {
  limbX:   0.470,   // limb axis at the hip cut
  lean:    0.048,   // *W  the axis drifts this far right by the calf cut
  topY:    0.088,   // hip cut (top of the plate)
  botY:    0.938,   // calf cut (bottom of the plate)
  limbW:   0.250,   // *W  half-width of the thigh at its widest
  scarU0:  0.235,   // scar entry, as u along the limb (0 top .. 1 bottom)
  scarU1:  0.585,   // scar exit
  scarK0:  0.115,   // entry, as a fraction across the limb (0 outer .. 1 inner)
  scarK1:  0.845,   // exit
  ruleX:   0.905,   // vertical measure rule
  markX:   0.078,   // left-margin registration crosses
  indexX:   0.072,   // seven-segment index, bottom-left
  indexY:  0.792,
  clothY0: 0.205,   // garment flap covers this band of the limb when hidden
  clothY1: 0.632,
};

const params = {
  weltW:    0.076,  // *W  half-width of the raised welt ribbon at its fattest
  seamW:    0.015,  // *W  half-width of the dark seam core
  puckers:  9,      // pucker ticks along the welt
  stitches: 6,      // binding stitches in the `fresh` state
  rimShade: true,   // outer/inner rim bands that make the limb a cylinder
  muscle:   true,   // long muscle seams + kneecap plane
  rule:     true,   // vertical measure rule + span bracket
  index:    true,   // seven-segment plate index
};

/* ---------- geometry helpers ---------- */
// smooth piecewise profile: keys are [u, value] sorted by u
function profile(keys, u){
  u = clamp(u, 0, 1);
  for (let i=0;i<keys.length-1;i++){
    const [u0,v0]=keys[i], [u1,v1]=keys[i+1];
    if (u<=u1) return lerp(v0, v1, smooth((u-u0)/Math.max(1e-6,u1-u0)));
  }
  return keys[keys.length-1][1];
}
// outer (left) and inner (right) silhouette, in half-width units — a real leg:
// full at the hip, thin above the knee, a kneecap bulge, then the calf.
const OUTER = [[0,0.93],[0.10,1.00],[0.30,0.90],[0.50,0.71],[0.64,0.57],
               [0.74,0.66],[0.82,0.59],[0.90,0.45],[1,0.49]];
const INNER = [[0,0.74],[0.12,0.85],[0.32,0.77],[0.52,0.59],[0.66,0.49],
               [0.75,0.57],[0.83,0.51],[0.91,0.39],[1,0.42]];

function limbGeom(W,H){
  const y0 = L.topY*H, y1 = L.botY*H, hw = L.limbW*W;
  const cAt = u => L.limbX*W + L.lean*W*smooth(clamp(u,0,1));
  return {
    y0, y1, hw, cAt,
    yAt: u => lerp(y0, y1, clamp(u,0,1)),
    lAt: u => cAt(u) - hw*profile(OUTER, u),
    rAt: u => cAt(u) + hw*profile(INNER, u),
    across: (u,k) => lerp(cAt(u)-hw*profile(OUTER,u), cAt(u)+hw*profile(INNER,u), k),
  };
}
// a vertical band of the limb between two across-fractions, as a closed path
function limbBand(g, G, k0, k1, u0=0, u1=1, N=36){
  g.moveTo(G.across(u0,k0), G.yAt(u0));
  for (let i=1;i<=N;i++){ const u=lerp(u0,u1,i/N); g.lineTo(G.across(u,k0), G.yAt(u)); }
  for (let i=N;i>=0;i--){ const u=lerp(u0,u1,i/N); g.lineTo(G.across(u,k1), G.yAt(u)); }
  g.closePath();
}

// quadratic bezier point
function qb(p0,p1,p2,t){
  const m=1-t;
  return { x: m*m*p0.x + 2*m*t*p1.x + t*t*p2.x, y: m*m*p0.y + 2*m*t*p1.y + t*t*p2.y };
}
// sample the scar centreline — a shallow arc kept wholly INSIDE the limb.
// Curvature is deliberately gentle: a tight bow makes the offset ribbon
// self-intersect and the wound turns into a knot of ink.
function scarLine(G, N=34){
  const a = { x: G.across(L.scarU0, L.scarK0), y: G.yAt(L.scarU0) };
  const c = { x: G.across(L.scarU1, L.scarK1), y: G.yAt(L.scarU1) };
  const um = (L.scarU0+L.scarU1)/2;
  const b = { x: G.across(um, 0.40), y: G.yAt(um) };
  const pts=[];
  for (let i=0;i<=N;i++){
    const t=i/N, p=qb(a,b,c,t);
    const q=qb(a,b,c,Math.min(1,t+0.005));
    let dx=q.x-p.x, dy=q.y-p.y; const m=Math.hypot(dx,dy)||1; dx/=m; dy/=m;
    pts.push({ x:p.x, y:p.y, nx:-dy, ny:dx, t });
  }
  return pts;
}
// taper: pinched at the ends, broad through the belly (a tusk enters shallow,
// tears deep, and lets go). sqrt keeps the ends from pinching to a cusp.
const taper = t => Math.pow(Math.sin(Math.PI*clamp(t,0,1)), 0.5);

// build a ribbon polygon around a sampled line
function ribbon(g, pts, widthAt){
  const up=[], dn=[];
  for (const p of pts){ const w=widthAt(p.t);
    up.push({ x:p.x+p.nx*w, y:p.y+p.ny*w }); dn.push({ x:p.x-p.nx*w, y:p.y-p.ny*w }); }
  g.moveTo(up[0].x, up[0].y);
  for (let i=1;i<up.length;i++) g.lineTo(up[i].x, up[i].y);
  for (let i=dn.length-1;i>=0;i--) g.lineTo(dn[i].x, dn[i].y);
  g.closePath();
}
// offset a sampled line along its normal, keeping the normals
const shift = (pts,d) => pts.map(p=>({ ...p, x:p.x+p.nx*d, y:p.y+p.ny*d }));

// seven-segment numeral drawn as GEOMETRY (never small type)
const SEG = { // a b c d e f g
  0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
  4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1], 6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
  8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1],
};
function sevenSeg(pen, g, x, y, w, h, d, th, tone){
  const s = SEG[d] || SEG[8], hh = h/2, gp = th*0.6;
  const bar=(bx,by,bw,bh)=> pen.paint(()=>{ g.rect(bx,by,bw,bh); }, toneSolid(inkLevel(tone)), 3);
  if(s[0]) bar(x+gp,     y,            w-gp*2, th);            // a top
  if(s[1]) bar(x+w-th,   y+gp,         th,     hh-gp*1.7);     // b upper right
  if(s[2]) bar(x+w-th,   y+hh+gp*0.7,  th,     hh-gp*1.7);     // c lower right
  if(s[3]) bar(x+gp,     y+h-th,       w-gp*2, th);            // d bottom
  if(s[4]) bar(x,        y+hh+gp*0.7,  th,     hh-gp*1.7);     // e lower left
  if(s[5]) bar(x,        y+gp,         th,     hh-gp*1.7);     // f upper left
  if(s[6]) bar(x+gp,     y+hh-th*0.5,  w-gp*2, th);            // g middle
}

/* ---------- the plate ---------- */
function drawScar(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx, t = st.t||0;
  const mode = st.mode || "bared";                 // hidden | bared | touched | fresh
  const DEF = {
    hidden:  ["limb","rim","muscle","cloth","rule","index"],
    bared:   ["limb","rim","muscle","welt","seam","pucker","rule","marks","index"],
    touched: ["limb","rim","muscle","welt","seam","pucker","reticle","touch","rule","marks","index"],
    fresh:   ["limb","rim","muscle","gash","stitch","rule","marks","index"],
  };
  const layers = st.layers || DEF[mode] || DEF.bared;
  const has = l => layers.includes(l);

  const G = limbGeom(W,H);
  const pts = scarLine(G);
  const mid = pts[Math.round(pts.length/2)];
  const RET = W*0.205;                              // reticle radius

  /* ---- LIMB: the thigh cylinder. Very light plane, hard contour. ---- */
  if (has("limb")){
    const N=48;
    pen.paint(()=>{
      g.moveTo(G.lAt(0), G.y0);
      for (let i=1;i<=N;i++) g.lineTo(G.lAt(i/N), G.yAt(i/N));
      g.lineTo(G.rAt(1), G.y1);
      for (let i=N-1;i>=0;i--) g.lineTo(G.rAt(i/N), G.yAt(i/N));
      g.closePath();
    }, toneSolid(inkLevel(1)), 5);

    // hip cut + calf cut: short section hatches, so the limb reads as an excerpt
    g.save(); g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.50; g.lineCap="round";
    for (const [u,dir] of [[0,1],[1,-1]]){
      const yy=G.yAt(u)+dir*H*0.014, l=G.lAt(u), r=G.rAt(u);
      for (let x=l+W*0.034; x<r-W*0.026; x+=W*0.082){
        g.beginPath(); g.moveTo(x, yy); g.lineTo(x+W*0.034, yy+dir*H*0.030); g.stroke();
      }
    }
    g.restore();
  }

  /* ---- RIM: shaded bands down each edge — the limb becomes a cylinder and the
          middle of it stays paper. No horizontal bar anywhere. ---- */
  if (has("rim") && params.rimShade){
    pen.fillPath(()=>{ limbBand(g, G, 0.00, 0.14); }, inkLevel(3));   // outer rim, in shadow
    pen.fillPath(()=>{ limbBand(g, G, 0.14, 0.27); }, inkLevel(2));   // its soft step
    pen.fillPath(()=>{ limbBand(g, G, 0.88, 1.00); }, inkLevel(2));   // inner rim
  }

  /* ---- MUSCLE: long seams + the kneecap plane, thin ink only ---- */
  if (has("muscle") && params.muscle){
    g.save(); g.strokeStyle=INK; g.lineWidth=3.2; g.globalAlpha=0.42; g.lineCap="round";
    for (const [k,u0,u1] of [[0.36,0.05,0.62],[0.68,0.09,0.60],[0.50,0.70,0.97]]){
      g.beginPath();
      for (let i=0;i<=26;i++){ const u=lerp(u0,u1,i/26);
        const x = G.across(u,k) + Math.sin(u*3.4)*W*0.008, y = G.yAt(u);
        i?g.lineTo(x,y):g.moveTo(x,y);
      }
      g.stroke();
    }
    g.restore();
    // kneecap: a low plate on the bulge, plus the crease below it
    const ku=0.742, ryk=H*0.040;
    pen.paint(()=>{
      const cxk=G.across(ku,0.46), rxk=(G.rAt(ku)-G.lAt(ku))*0.22;
      g.moveTo(cxk-rxk, G.yAt(ku)-ryk*0.2);
      g.quadraticCurveTo(cxk, G.yAt(ku)-ryk*1.6, cxk+rxk, G.yAt(ku)-ryk*0.2);
      g.quadraticCurveTo(cxk+rxk*0.8, G.yAt(ku)+ryk*1.3, cxk, G.yAt(ku)+ryk*1.2);
      g.quadraticCurveTo(cxk-rxk*0.8, G.yAt(ku)+ryk*1.3, cxk-rxk, G.yAt(ku)-ryk*0.2);
      g.closePath();
    }, toneSolid(inkLevel(2)), 4);
    g.save(); g.strokeStyle=INK; g.lineWidth=3.2; g.globalAlpha=0.45; g.lineCap="round";
    for (const [k0,k1] of [[0.14,0.36],[0.60,0.84]]){          // crease, broken at the middle
      g.beginPath();
      g.moveTo(G.across(0.806,k0), G.yAt(0.806));
      g.quadraticCurveTo(G.across(0.822,(k0+k1)/2), G.yAt(0.826), G.across(0.806,k1), G.yAt(0.806));
      g.stroke();
    }
    g.restore();
  }

  /* ---- WELT: the raised, healed ridge — a light plane, so the seam on it reads dark ---- */
  if (has("welt")){
    pen.paint(()=>{ ribbon(g, pts, tt => params.weltW*W*taper(tt)); }, toneSolid(inkLevel(2)), 5);
    // the ridge catches light on its upper side: a thin bright crest
    pen.fillPath(()=>{ ribbon(g, shift(pts, params.weltW*W*0.52),
      tt => params.weltW*W*0.11*taper(tt)); }, inkLevel(0));
  }

  /* ---- SEAM: the closed line of the wound — the one really dark mass on the plate ---- */
  if (has("seam")){
    pen.paint(()=>{ ribbon(g, pts, tt => params.seamW*W*taper(tt)); }, toneSolid(inkLevel(6)), 3);
  }

  /* ---- PUCKER: short ticks stepping off the seam, alternating sides ---- */
  if (has("pucker")){
    g.save(); g.strokeStyle=INK; g.lineWidth=3.4; g.lineCap="round";
    for (let i=0;i<params.puckers;i++){
      const tt = 0.12 + 0.76*(i/(params.puckers-1));
      const p = pts[Math.round(tt*(pts.length-1))];
      const s = (i%2===0)?1:-1;
      const a = params.seamW*W*taper(tt)*1.2, b = params.weltW*W*taper(tt)*0.90;
      if (b<=a) continue;
      g.beginPath(); g.moveTo(p.x+p.nx*a*s, p.y+p.ny*a*s); g.lineTo(p.x+p.nx*b*s, p.y+p.ny*b*s); g.stroke();
    }
    g.restore();
  }

  /* ---- GASH (fresh state): the wound still open — two raw LIPS pushed apart,
          with a narrow dark trough between them. Light / dark / light, so it
          reads as an opening and not as a black diagonal slab. ---- */
  if (has("gash")){
    for (const s of [1,-1]){
      pen.paint(()=>{ ribbon(g, shift(pts, s*params.weltW*W*0.82),
        tt => params.weltW*W*0.28*taper(tt)); }, toneSolid(inkLevel(2)), 5);
    }
    pen.paint(()=>{ ribbon(g, pts, tt => params.weltW*W*0.20*taper(tt)); }, toneSolid(inkLevel(6)), 3);
  }

  /* ---- STITCH: the binding — single bars drawn ACROSS the lips ---- */
  if (has("stitch")){
    g.save(); g.strokeStyle=INK; g.lineWidth=4.4; g.lineCap="round";
    for (let i=0;i<params.stitches;i++){
      const tt = 0.16 + 0.68*(i/(params.stitches-1));
      const p = pts[Math.round(tt*(pts.length-1))];
      const r = params.weltW*W*(0.95+0.45*taper(tt));
      g.beginPath();
      g.moveTo(p.x + p.nx*r, p.y + p.ny*r);
      g.lineTo(p.x - p.nx*r, p.y - p.ny*r);
      g.stroke();
    }
    g.restore();
  }

  /* ---- CLOTH: the garment flap that occludes the marker (hidden state) ---- */
  if (has("cloth")){
    const y0=L.clothY0*H, y1=L.clothY1*H;
    const uOf = y => clamp((y-G.y0)/(G.y1-G.y0), 0, 1);
    const N=22, over=W*0.024;
    // one path, reused for the fill and for clipping the weave
    const clothPath = ()=>{
      g.moveTo(G.lAt(uOf(y0))-over, y0);
      for (let i=1;i<=N;i++){ const y=lerp(y0,y1,i/N); g.lineTo(G.lAt(uOf(y))-over+Math.sin(i*0.9)*W*0.010, y); }
      // torn lower hem: a zigzag, deliberately not a straight bar
      const rr=rnd(4211);
      for (let i=0;i<=8;i++){
        const x=lerp(G.lAt(uOf(y1))-over, G.rAt(uOf(y1))+over, i/8);
        g.lineTo(x, y1 + (i%2?H*0.030:-H*0.006) + rr()*H*0.014);
      }
      for (let i=N;i>=0;i--){ const y=lerp(y0,y1,i/N); g.lineTo(G.rAt(uOf(y))+over-Math.sin(i*0.7)*W*0.008, y); }
      // gathered top hem: scalloped right-to-left, so the flap never lays a
      // straight black bar across the limb
      for (let i=7;i>=0;i--){
        const xa=lerp(G.lAt(uOf(y0))-over, G.rAt(uOf(y0))+over, (i+1)/8);
        const xb=lerp(G.lAt(uOf(y0))-over, G.rAt(uOf(y0))+over, i/8);
        g.quadraticCurveTo((xa+xb)/2, y0 - (i%2?H*0.022:H*0.008), xb, y0);
      }
      g.closePath();
    };
    pen.paint(clothPath, toneSolid(inkLevel(2)), 5);
    // weave: sparse hatch, clipped to the flap and running counter to the seam
    g.save();
    g.beginPath(); clothPath(); g.clip();
    g.strokeStyle=INK; g.globalAlpha=0.26; g.lineWidth=2.6; g.lineCap="butt";
    for (let i=-8;i<26;i++){
      const yy=y0+i*H*0.030;
      g.beginPath(); g.moveTo(G.lAt(uOf(yy+H*0.10))-over, yy+H*0.10);
      g.lineTo(G.rAt(uOf(yy))+over, yy); g.stroke();
    }
    g.restore();
    // fold seams — vertical, broken
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.55; g.lineWidth=3.4; g.lineCap="round";
    for (let i=0;i<5;i++){
      const k=(i+0.7)/5.6, ya=lerp(y0,y1,0.06+0.16*(i%3)), yb=lerp(y0,y1,0.60+0.32*((i+1)%3)/2);
      g.beginPath();
      for (let j=0;j<=12;j++){ const y=lerp(ya,yb,j/12), u=uOf(y);
        const x=G.across(u,k)+Math.sin(j*0.8+i)*W*0.007; j?g.lineTo(x,y):g.moveTo(x,y); }
      g.stroke();
    }
    g.restore();
    // the marker is under there: a dashed ghost of the seam
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.80; g.lineWidth=6; g.setLineDash([W*0.026,W*0.022]);
    g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
    for (const p of pts) g.lineTo(p.x, p.y);
    g.stroke(); g.restore();
  }

  /* ---- RETICLE: the touch target over the scar belly ---- */
  if (has("reticle")){
    g.save(); g.strokeStyle=INK; g.lineWidth=4.2;
    g.beginPath(); g.arc(mid.x, mid.y, RET, 0, 7); g.stroke();
    for (const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){       // corner brackets
      const bx=mid.x+sx*RET*1.22, by=mid.y+sy*RET*1.22, a=RET*0.30;
      g.beginPath(); g.moveTo(bx, by-sy*a); g.lineTo(bx, by); g.lineTo(bx-sx*a, by); g.stroke();
    }
    g.restore();
  }

  /* ---- TOUCH: three fingertip contact pads laid ACROSS the ridge ---- */
  if (has("touch")){
    const pulse = 0.5+0.5*Math.sin(t*2.4);
    for (let i=0;i<3;i++){
      const tt = 0.30 + i*0.17;
      const p = pts[Math.round(tt*(pts.length-1))];
      const rot = Math.atan2(p.ny, p.nx);            // long axis crosses the seam
      pen.paint(()=>{ g.ellipse(p.x, p.y, W*0.060, W*0.023, rot, 0, 7); },
        toneSolid(inkLevel(3)), 5);
      pen.seam(()=>{                                   // nail crease across the pad
        g.moveTo(p.x - p.ny*W*0.014 + p.nx*W*0.034, p.y + p.nx*W*0.014 + p.ny*W*0.034);
        g.lineTo(p.x + p.ny*W*0.014 + p.nx*W*0.034, p.y - p.nx*W*0.014 + p.ny*W*0.034);
      }, 3);
    }
    // the contact ring pulses: one clean extra circle, no scatter
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.55; g.lineWidth=3.4; g.setLineDash([W*0.020,W*0.024]);
    g.beginPath(); g.arc(mid.x, mid.y, RET*(1.10+0.06*pulse), 0, 7); g.stroke();
    g.restore();
  }

  /* ---- RULE: vertical measure + span bracket for the scar (never a horizontal bar) ---- */
  if (has("rule") && params.rule){
    const rx=L.ruleX*W, ya=H*0.130, yb=H*0.900;
    g.save(); g.strokeStyle=INK; g.lineWidth=3.6; g.lineCap="butt";
    g.beginPath(); g.moveTo(rx, ya); g.lineTo(rx, yb); g.stroke();
    for (let i=0;i<=16;i++){
      const y=lerp(ya,yb,i/16), len = (i%4===0)? W*0.048 : W*0.026;
      g.beginPath(); g.moveTo(rx, y); g.lineTo(rx-len, y); g.stroke();
    }
    // span bracket across the scar's vertical extent
    const s0=Math.min(pts[0].y, pts[pts.length-1].y), s1=Math.max(pts[0].y, pts[pts.length-1].y);
    const bx=rx+W*0.042;
    g.lineWidth=5;
    g.beginPath(); g.moveTo(bx, s0); g.lineTo(bx, s1); g.stroke();
    g.beginPath(); g.moveTo(bx-W*0.026, s0); g.lineTo(bx+W*0.012, s0); g.stroke();
    g.beginPath(); g.moveTo(bx-W*0.026, s1); g.lineTo(bx+W*0.012, s1); g.stroke();
    g.restore();
  }

  /* ---- MARKS: three registration crosses keyed to entry / belly / exit ---- */
  if (has("marks")){
    const key=[pts[0], mid, pts[pts.length-1]];
    g.save(); g.lineCap="butt";
    key.forEach((p,i)=>{
      const mx=L.markX*W, my=p.y, a=W*0.036;
      g.strokeStyle=INK; g.globalAlpha=1; g.lineWidth=5; g.setLineDash([]);
      g.beginPath(); g.moveTo(mx-a,my); g.lineTo(mx+a,my); g.stroke();
      g.beginPath(); g.moveTo(mx,my-a); g.lineTo(mx,my+a); g.stroke();
      g.globalAlpha=0.32; g.setLineDash([W*0.016,W*0.024]); g.lineWidth=2.8;
      const stop = (i===1) ? mid.x-RET*1.30 : G.lAt(i?L.scarU1:L.scarU0)-W*0.012;
      g.beginPath(); g.moveTo(mx+a*1.5, my); g.lineTo(Math.max(mx+a*2.2, stop), my); g.stroke();
    });
    g.restore();
    // the semantic ACCENT: a solid mark keyed to the belly (prints black — that is fine)
    g.save(); g.fillStyle=ACCENT;
    g.fillRect(L.markX*W-W*0.015, mid.y+H*0.030, W*0.030, H*0.010);
    g.restore();
  }

  /* ---- INDEX: seven-segment plate number, drawn as bars not type ---- */
  if (has("index") && params.index){
    const x=L.indexX*W, y=L.indexY*H, dh=H*0.076, dw=W*0.062, th=W*0.016, gap=W*0.030;
    const digits = (mode==="fresh") ? [0,1] : [1,9];    // fresh = the Parnassus wound, plate 01
    digits.forEach((d,i)=> sevenSeg(pen, g, x+i*(dw+gap), y, dw, dh, d, th, 6));
    // short underline — deliberately short, so no bar stripes the frame
    g.save(); g.fillStyle=INK;
    g.fillRect(x, y+dh+H*0.020, dw*2+gap, H*0.008);
    g.restore();
  }
}

/* ---- anchors computed from the SAME geometry, in normalized 0..1 space ---- */
const NG = limbGeom(1,1), NP = scarLine(NG), NM = NP[Math.round(NP.length/2)];
const r3 = v => Math.round(v*1000)/1000;

export const asset = {
  id:"set_piece.boar-scar",
  type:"SET_PIECE",
  name:"Boar Scar",
  statusWord:"BARED",
  scene:"OD-B19-S04",

  params,
  // back -> front depth layers; scene state can pass a subset
  layers:["limb","rim","muscle","welt","seam","pucker","gash","stitch","cloth","reticle","touch","rule","marks","index"],

  // where this component attaches to a body, and what can address it
  attach:{ to:"character.odysseus-b16", bone:"thigh.right", above:"knee.right", side:"outer" },
  depth:"body-surface",     // it rides ON a figure; occluded by garment layers

  anchors:{
    "attach:thigh-right": { x:r3(NG.cAt(0.35)), y:0.400 },
    "scar:entry":         { x:r3(NP[0].x),      y:r3(NP[0].y) },
    "scar:belly":         { x:r3(NM.x),         y:r3(NM.y) },
    "scar:exit":          { x:r3(NP[NP.length-1].x), y:r3(NP[NP.length-1].y) },
    "touch:target":       { x:r3(NM.x),         y:r3(NM.y) },
    "knee:cap":           { x:r3(NG.across(0.760,0.46)), y:r3(NG.yAt(0.760)) },
    "cloth:hem":          { x:r3(NG.cAt(0.72)), y:L.clothY1 },
    "measure:rule":       { x:L.ruleX,          y:0.515 },
    "camera:closeup":     { x:r3(NM.x),         y:r3(NM.y) },
    "camera:plate":       { x:0.500,            y:0.500 },
  },
  // collision boundaries + the addressable touch box (normalized)
  zones:{
    footprint: { x0:r3(L.limbX-L.limbW), y0:L.topY, x1:r3(L.limbX+L.lean+L.limbW), y1:L.botY },
    touch:     { x0:r3(NM.x-0.205), y0:r3(NM.y-0.154), x1:r3(NM.x+0.205), y1:r3(NM.y+0.154) },
    occluder:  { x0:r3(L.limbX-L.limbW-0.03), y0:L.clothY0, x1:r3(L.limbX+L.lean+L.limbW+0.03), y1:L.clothY1 },
    margin:    { x0:0.840, y0:0.120, x1:0.960, y1:0.910 },
  },
  states:{
    initial:"bared",
    nodes:{
      // covered by the beggar's rag — the marker exists but cannot be read
      hidden:{ preview:{ mode:"hidden", t:0, status:"HIDDEN", progress:.12 } },
      // the leg bared for washing: the welt visible, measurable, close-up
      bared:{ preview:{ mode:"bared", t:0, status:"BARED", progress:.46 } },
      // Eurycleia's hand on the ridge — the recognition trigger fires
      touched:{ preview:{ mode:"touched", t:0.7, status:"KNOWN", progress:.92 } },
      // the Parnassus wound, still open and bound — continuity source
      fresh:{ preview:{ mode:"fresh", t:0, status:"FRESH", progress:.22 } },
    },
    edges:[["hidden","bared"],["bared","touched"],["touched","bared"],
           ["bared","hidden"],["fresh","bared"],["bared","fresh"]],
  },
  channels:["reveal","touch","pulse","age","occlusion"],

  preview:()=>({ mode:"bared", t:0, status:"BARED", progress:.46 }),
  draw(ctx,W,H,state){ drawScar(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
