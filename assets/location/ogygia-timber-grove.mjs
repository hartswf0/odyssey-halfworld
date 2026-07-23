/* location.ogygia-timber-grove — harvestable tall-tree stand on Calypso's isle.
   LOCATION asset. An EMPTY navigable set drawn in SOLID grays + hard contour
   into the offscreen ctx (the engine dotify pass supplies the halftone).
   Back-to-front depth: sky / distant treeline / the standing STAND of tall
   trees (alder · poplar · fir) rooted at the ridge / a foreground CUT-ZONE of
   sawn stumps / worn DRAG-ROUTES sweeping off to the SHORE (left, water) and
   the WORKSITE (right, stacked logs + trimming frame). No baked characters.
   Atlas: OD-B05-S04 — harvestable tree zone linked to worksite and shore. */
import { makePen, toneSolid, inkLevel, INK, ACCENT } from "/engine/halfworld-engine.mjs";

const params = {
  ridgeLevel:0.585,     // ground horizon as a fraction of H
  firs:3, poplars:2, alders:2,
  stumps:6,             // sawn stumps in the foreground cut-zone
  dragRoutes:2,         // worn paths: one to shore, one to worksite
};

/* ---- tree species (rooted at baseY, growing UP toward smaller y) ---- */
function drawFir(pen,g,cx,baseY,h,w){
  // trunk
  pen.paint(()=>{ g.rect(cx-w*0.05, baseY-h*0.20, w*0.10, h*0.22); }, toneSolid(inkLevel(6)), 3);
  // stacked conifer skirts, darkest at the crown
  const tiers=4;
  for(let i=0;i<tiers;i++){
    const t=i/(tiers-1);
    const ty=baseY-h*0.14 - t*h*0.80;         // tier apex rises
    const tw=w*(0.62-0.42*t);                  // narrows upward
    const drop=h*0.26;
    pen.paint(()=>{ g.moveTo(cx,ty); g.lineTo(cx+tw,ty+drop); g.lineTo(cx-tw,ty+drop); g.closePath(); },
      toneSolid(inkLevel(4+ (i>1?1:0))), 3);
  }
}
function drawPoplar(pen,g,cx,baseY,h,w){
  pen.paint(()=>{ g.rect(cx-w*0.055, baseY-h*0.55, w*0.11, h*0.55); }, toneSolid(inkLevel(6)), 3);
  // tall narrow flame canopy
  pen.paint(()=>{ g.ellipse(cx, baseY-h*0.62, w*0.34, h*0.44, 0,0,7); }, toneSolid(inkLevel(4)), 4);
  pen.paint(()=>{ g.ellipse(cx, baseY-h*0.86, w*0.20, h*0.20, 0,0,7); }, toneSolid(inkLevel(5)), 3);
}
function drawAlder(pen,g,cx,baseY,h,w){
  pen.paint(()=>{ g.rect(cx-w*0.06, baseY-h*0.40, w*0.12, h*0.40); }, toneSolid(inkLevel(6)), 3);
  // broad rounded canopy from overlapping lobes
  pen.paint(()=>{ g.ellipse(cx, baseY-h*0.66, w*0.52, h*0.34, 0,0,7); }, toneSolid(inkLevel(4)), 4);
  pen.paint(()=>{ g.ellipse(cx-w*0.30, baseY-h*0.56, w*0.26, h*0.20, 0,0,7); }, toneSolid(inkLevel(3)), 3);
  pen.paint(()=>{ g.ellipse(cx+w*0.30, baseY-h*0.58, w*0.24, h*0.20, 0,0,7); }, toneSolid(inkLevel(5)), 3);
}
function drawStump(pen,g,cx,cy,r){
  const et=r*0.42;          // top ellipse minor radius
  const hh=r*0.70;          // stump height (short)
  // side body (dark bark drum)
  pen.paint(()=>{ g.moveTo(cx-r,cy); g.lineTo(cx-r,cy+hh);
                  g.ellipse(cx,cy+hh,r,et,0,Math.PI,0,true); g.lineTo(cx+r,cy);
                  g.ellipse(cx,cy,r,et,0,0,Math.PI,false); g.closePath(); },
    toneSolid(inkLevel(6)), 3);
  // sawn top face (light) with growth rings
  pen.paint(()=>{ g.ellipse(cx,cy,r,et,0,0,7); }, toneSolid(inkLevel(2)), 3);
  pen.ink(()=>{ g.ellipse(cx,cy,r*0.66,et*0.66,0,0,7); }, 2);
  pen.ink(()=>{ g.ellipse(cx,cy,r*0.32,et*0.32,0,0,7); }, 2);
}

function drawSet(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const ridge = H*params.ridgeLevel;
  const layers = st.layers || ["sky","treeline","shore","stand","dragpaths","cutzone","worksite","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest) ----
  if (has("sky")){
    g.fillStyle=inkLevel(1); g.fillRect(0,0,W,ridge);
    g.fillStyle=inkLevel(2);
    for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(W*(0.20+i*0.22), H*(0.14+0.05*(i%2)), W*0.12, H*0.028,0,0,7); g.fill(); }
  }

  // ---- GROUND clearing (below ridge, light so it reads as walkable earth) ----
  if (has("sky")){ g.fillStyle=inkLevel(2); g.fillRect(0,ridge,W,H-ridge); }

  // ---- distant TREELINE band at the ridge (dark forest wall) ----
  if (has("treeline")){
    pen.paint(()=>{ g.rect(0, ridge-H*0.075, W, H*0.075); }, toneSolid(inkLevel(4)), 0);
    g.fillStyle=inkLevel(5);
    for(let x=-10;x<W+10;x+=26){ g.beginPath(); g.moveTo(x,ridge-H*0.075); g.lineTo(x+13,ridge-H*0.135); g.lineTo(x+26,ridge-H*0.075); g.closePath(); g.fill(); }
    pen.ink(()=>{ g.moveTo(0,ridge); g.lineTo(W,ridge); }, 3);
  }

  // ---- SHORE (lower-left): water patch the drag-route delivers timber to ----
  if (has("shore")){
    pen.paint(()=>{ g.moveTo(0,H); g.lineTo(0,H*0.80); g.quadraticCurveTo(W*0.16,H*0.83, W*0.30,H); g.closePath(); },
      toneSolid(inkLevel(3)), 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.55;
    for(let i=0;i<3;i++){ const y=H*(0.86+i*0.045); g.beginPath(); g.moveTo(W*0.02,y); g.quadraticCurveTo(W*0.10,y-6,W*0.20,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- the STAND of harvestable tall trees, rooted along the ridge ----
  if (has("stand")){
    // deterministic placement across the ridge, mixed species, back->front
    const rows = [
      { fn:drawAlder,  cx:0.20, h:0.34, w:0.15, dy:-0.010 },
      { fn:drawFir,    cx:0.36, h:0.44, w:0.13, dy:-0.004 },
      { fn:drawPoplar, cx:0.50, h:0.50, w:0.11, dy: 0.000 },
      { fn:drawFir,    cx:0.63, h:0.46, w:0.13, dy:-0.004 },
      { fn:drawAlder,  cx:0.78, h:0.36, w:0.15, dy:-0.008 },
      { fn:drawPoplar, cx:0.88, h:0.42, w:0.10, dy:-0.006 },
      { fn:drawFir,    cx:0.10, h:0.38, w:0.12, dy:-0.012 },
    ];
    for(const r of rows){ r.fn(pen,g, W*r.cx, ridge+H*r.dy, H*r.h, W*r.w); }
  }

  // ---- DRAG-ROUTES: worn swaths from the cut-zone to shore + worksite ----
  if (has("dragpaths")){
    const routes = [
      // to shore (lower-left)
      { a:[0.50,0.70], b:[0.14,0.98], wid:0.11 },
      // to worksite (lower-right)
      { a:[0.50,0.70], b:[0.86,0.96], wid:0.11 },
    ];
    for(const rt of routes){
      const ax=W*rt.a[0], ay=H*rt.a[1], bx=W*rt.b[0], by=H*rt.b[1], ww=W*rt.wid;
      pen.paint(()=>{
        g.moveTo(ax-ww*0.4, ay); g.lineTo(bx-ww*0.5, by);
        g.lineTo(bx+ww*0.5, by); g.lineTo(ax+ww*0.4, ay); g.closePath();
      }, toneSolid(inkLevel(3)), 2);
      // drag furrows down the middle
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
      for(const off of [-0.22,0,0.22]){
        g.beginPath(); g.moveTo(ax+ww*off, ay); g.lineTo(bx+ww*off, by); g.stroke();
      }
      g.globalAlpha=1;
    }
  }

  // ---- CUT-ZONE: sawn stumps in the foreground (already-harvested apron) ----
  if (has("cutzone")){
    const sp = [
      [0.34,0.72,0.050],[0.60,0.74,0.052],[0.24,0.80,0.058],
      [0.70,0.82,0.058],[0.44,0.85,0.064],[0.16,0.90,0.066],
    ];
    for(let i=0;i<Math.min(params.stumps,sp.length);i++){
      const [x,y,r]=sp[i]; drawStump(pen,g, W*x, H*y, W*r);
    }
    // a felled log lying in the apron (clear cylinder with end-grain)
    const lx=W*0.50, ly=H*0.92, lw=W*0.22, lr=H*0.024;
    pen.paint(()=>{ g.moveTo(lx-lw,ly-lr); g.lineTo(lx+lw,ly-lr);
                    g.ellipse(lx+lw,ly,lr*0.5,lr,0,-Math.PI/2,Math.PI/2,false);
                    g.lineTo(lx-lw,ly+lr);
                    g.ellipse(lx-lw,ly,lr*0.5,lr,0,Math.PI/2,-Math.PI/2,false); g.closePath(); },
      toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.ellipse(lx+lw,ly,lr*0.5,lr,0,0,7); }, toneSolid(inkLevel(2)), 2);
    pen.ink(()=>{ g.ellipse(lx+lw,ly,lr*0.28,lr*0.55,0,0,7); }, 2);
  }

  // ---- WORKSITE (lower-right): stacked trimmed logs + a trimming frame ----
  if (has("worksite")){
    const bx=W*0.82, by=H*0.90;
    // stacked log ends (pyramid)
    const stack=[ [-0.06,0],[0.06,0],[0,-0.055] ];
    for(const s of stack){
      pen.paint(()=>{ g.ellipse(bx+W*s[0], by+H*s[1], W*0.045, H*0.035,0,0,7); }, toneSolid(inkLevel(5)), 3);
      pen.ink(()=>{ g.ellipse(bx+W*s[0], by+H*s[1], W*0.020, H*0.016,0,0,7); }, 2);
    }
    // simple A-frame trimming rack behind the stack
    pen.ink(()=>{ g.moveTo(bx-W*0.10, by-H*0.02); g.lineTo(bx-W*0.03, by-H*0.11);
                  g.moveTo(bx+W*0.02, by-H*0.02); g.lineTo(bx-W*0.03, by-H*0.11);
                  g.moveTo(bx-W*0.12, by-H*0.075); g.lineTo(bx+W*0.03, by-H*0.075); }, 3);
  }

  // ---- ANCHOR / camera marks (faint blue, non-halftone hints) ----
  if (has("anchors")){
    g.save(); g.globalAlpha=0.9; g.fillStyle=ACCENT;
    const marks=[[0.50,0.70],[0.14,0.90],[0.82,0.90]];
    for(const m of marks){ g.beginPath(); g.arc(W*m[0],H*m[1],3.2,0,7); g.fill(); }
    g.restore();
  }
}

export const asset = {
  id:"location.ogygia-timber-grove",
  type:"LOCATION",
  name:"Ogygia Timber Grove",
  statusWord:"HARVESTABLE",
  scene:"OD-B05-S04",

  params,
  layers:["sky","treeline","shore","stand","dragpaths","cutzone","worksite","anchors"],
  // normalized 0..1 placement / camera anchors — NO baked characters
  anchors:{
    "zone:stand":{x:.50,y:.55},        // standing harvestable trees
    "zone:cut":{x:.48,y:.80},          // foreground cut-zone / stumps
    "route:shore":{x:.14,y:.90},       // drag-route terminus at the water
    "route:worksite":{x:.82,y:.90},    // drag-route terminus at the worksite
    "site:shore":{x:.12,y:.94},
    "site:worksite":{x:.84,y:.92},
    "entrance:grove":{x:.50,y:.70},    // mouth of the cut-zone
    "exit:ridge":{x:.50,y:.58},        // into the deeper forest
    "camera:wide":{x:.50,y:.50},
    "camera:cut":{x:.48,y:.72},
  },
  // walkable ground regions + the two drag corridors (for scene pathing)
  zones:{
    walkable:{ x0:.04,y0:.60,x1:.96,y1:.98 },
    cutzone:{ x0:.18,y0:.66,x1:.78,y1:.94 },
    "drag:shore":{ x0:.06,y0:.68,x1:.52,y1:.98 },
    "drag:worksite":{ x0:.48,y0:.68,x1:.94,y1:.98 },
  },
  states:{
    initial:"standing",
    nodes:{
      standing:{ preview:{ layers:["sky","treeline","shore","stand","dragpaths","cutzone","worksite","anchors"] } },
      felling:{ preview:{ layers:["sky","treeline","shore","stand","dragpaths","cutzone","worksite"] } },
      cleared:{ preview:{ layers:["sky","treeline","shore","dragpaths","cutzone","worksite"] } },
    },
    edges:[["standing","felling"],["felling","cleared"],["standing","cleared"]],
  },
  channels:["reveal","camera","light","harvest"],

  preview:()=>({
    layers:["sky","treeline","shore","stand","dragpaths","cutzone","worksite","anchors"],
    status:"HARVESTABLE", progress:.34,
  }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
