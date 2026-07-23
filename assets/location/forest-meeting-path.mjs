/* location.forest-meeting-path — narrow forest route between the ship camp
   and Circe's palace, with a marked hidden divine-arrival spot.
   LOCATION asset (empty navigable set). Built to the exemplar look: SOLID
   grays + hard black contour into the offscreen ctx; the engine dotify pass
   supplies the halftone. NO baked characters.
   Atlas OD-B10-S05 — a narrow transitional path; fg walkable path / mid trees
   framing it / bg treeline; walkable path, an arrival anchor, thresholds at
   both ends (down to the ship camp, up to the palace). */
import { makePen, toneSolid, inkLevel, INK, ACCENT } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.30,        // treeline / vanishing band as fraction of H
  vanishX:0.52,        // path vanishing point x (fraction of W)
  pathBottomW:0.30,    // path half-width at the bottom (camp end), fraction of W
  treeRows:5,          // depth ranks of flanking trees per side
  arrivalT:0.46,       // divine-arrival spot position along the path (0 far .. 1 near)
  arrivalSide:-0.62,   // lateral offset of the hidden spot from path center (path-half units)
};

/* deterministic jitter so the forest is stable across renders */
function jig(i, a=1){ const s=Math.sin(i*12.9898)*43758.5453; return (s-Math.floor(s)-0.5)*2*a; }

/* path half-width at depth d (0 = far/horizon, 1 = near/bottom) */
function halfW(W, d){ return W*0.012 + (params.pathBottomW*W - W*0.012)*d*d; }
/* screen y for a depth d */
function depthY(H, d){ const hy=H*params.horizon; return hy + (H - hy)*d; }
/* path center x at depth d (straight, toward vanishing point) */
function pathX(W, d){ return W*params.vanishX + (W*0.5 - W*params.vanishX)*d; }

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const hy = H*params.horizon;
  const vx = W*params.vanishX;
  const layers = st.layers || ["sky","treeline","understory","path","trees","arrival","anchors"];
  const has = l => layers.includes(l);

  // ================= BACKGROUND: sky gap above the treeline ==============
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hy);
  }

  // ================= BACKGROUND: continuous treeline mass ================
  // A dark band of distant forest with a bright gap at the vanishing point —
  // the far threshold that reads as "the way on to the palace".
  if (has("treeline")){
    g.fillStyle = inkLevel(4);
    g.beginPath();
    g.moveTo(0, hy);
    for(let x=0;x<=W;x+=W*0.03){
      const k = x/W;
      const ridge = hy - H*(0.10 + 0.05*Math.abs(Math.sin(k*8.3)) + 0.03*Math.abs(jig(k*30,1)));
      g.lineTo(x, ridge);
    }
    g.lineTo(W, hy); g.closePath(); g.fill();
    // FAR THRESHOLD: a lit notch in the treeline where the path exits (palace)
    const gw = W*0.05;
    g.fillStyle = inkLevel(1);
    g.beginPath();
    g.moveTo(vx-gw, hy);
    g.lineTo(vx-gw*0.5, hy-H*0.10);
    g.lineTo(vx+gw*0.5, hy-H*0.10);
    g.lineTo(vx+gw, hy);
    g.closePath(); g.fill();
    // a faint post/marker each side of the far gap (a way-marker)
    g.strokeStyle=INK; g.lineWidth=2;
    g.beginPath(); g.moveTo(vx-gw, hy); g.lineTo(vx-gw*0.5, hy-H*0.09); g.stroke();
    g.beginPath(); g.moveTo(vx+gw, hy); g.lineTo(vx+gw*0.5, hy-H*0.09); g.stroke();
  }

  // ================= UNDERSTORY: forest floor either side of the path =====
  // Draw the whole ground below the horizon as a mid-dark floor, then the
  // path itself is carved lighter on top (in the "path" layer).
  if (has("understory")){
    g.fillStyle=inkLevel(3); g.fillRect(0,hy,W,H-hy);
    // scattered low brush marks to break the floor (deterministic)
    g.fillStyle=inkLevel(4);
    for(let i=0;i<26;i++){
      const d = 0.2 + (i%13)/13*0.8;
      const side = (i%2)?1:-1;
      const off = (0.9 + Math.abs(jig(i*1.7,1))*1.4);
      const cx = pathX(W,d) + side*(halfW(W,d) + off*halfW(W,d)*0.5 + jig(i,0.02)*W);
      const cy = depthY(H,d) + jig(i*2.1,0.01)*H;
      const r = (H*0.008)*(0.6+d);
      if (cx>0 && cx<W){ g.beginPath(); g.ellipse(cx,cy,r*1.6,r,0,0,7); g.fill(); }
    }
  }

  // ================= FOREGROUND GROUND: the walkable path ================
  if (has("path")){
    // path body — lightest tone so it reads as open ground
    pen.paint(()=>{
      g.moveTo(pathX(W,1)-halfW(W,1), depthY(H,1));   // bottom-left (camp end)
      g.lineTo(vx-halfW(W,0),          hy);           // far-left at horizon
      g.lineTo(vx+halfW(W,0),          hy);           // far-right at horizon
      g.lineTo(pathX(W,1)+halfW(W,1), depthY(H,1));   // bottom-right (camp end)
      g.closePath();
    }, toneSolid(inkLevel(2)), 4);
    // worn tread furrows converging to the vanishing point
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(const f of [-0.55,-0.2,0.2,0.55]){
      g.beginPath();
      g.moveTo(vx + f*halfW(W,0), hy);
      g.lineTo(pathX(W,1) + f*halfW(W,1), depthY(H,1));
      g.stroke();
    }
    g.globalAlpha=1;
    // NEAR THRESHOLD: a rutted stone step across the path at the camp end
    const by=depthY(H,0.985);
    pen.paint(()=>{ g.rect(pathX(W,1)-halfW(W,1)*0.9, by, halfW(W,1)*1.8, H*0.02); }, toneSolid(inkLevel(4)), 3);
  }

  // ================= MID: trees flanking the path (receding ranks) =======
  if (has("trees")){
    const rows = params.treeRows;
    // draw far rows first (painter's order) so near trees occlude far ones
    for(let r=0;r<rows;r++){
      const d = 0.14 + (r/(rows-1))*0.82;              // depth 0..1 near
      for(const side of [-1,1]){
        // stand the trunk clear of the path edge, with a little jitter
        const edgeOff = 1.45 + Math.abs(jig(r*3+side*7,1))*0.6;
        const tx = pathX(W,d) + side*(halfW(W,d)*edgeOff);
        const ty = depthY(H,d);
        if (tx< -W*0.04 || tx> W*1.04) continue;
        const scale = 0.35 + d*d*0.82;                 // trees loom toward camera
        const th = H*0.15*scale;                        // trunk length (kept short)
        const tw = W*0.016*scale;
        const canopyR = W*0.05*scale;
        // trunk (darkest) — from canopy base down to the ground contact
        pen.paint(()=>{ g.rect(tx-tw/2, ty-th, tw, th); }, toneSolid(inkLevel(6)), 3);
        // canopy (mid tone) — two stacked blobs for a conifer/oak read
        pen.paint(()=>{ g.ellipse(tx, ty-th-canopyR*0.55, canopyR, H*0.075*scale, 0,0,7); }, toneSolid(inkLevel(5)), 4);
        pen.paint(()=>{ g.ellipse(tx, ty-th-canopyR*1.35, canopyR*0.72, H*0.052*scale, 0,0,7); }, toneSolid(inkLevel(5)), 4);
      }
    }
  }

  // ================= THE MARKED HIDDEN DIVINE-ARRIVAL SPOT ================
  // A small clearing just off the path, ringed and glyphed — the anchor where
  // the divine traveller appears. Rendered as a diagram mark, not a figure.
  if (has("arrival")){
    const d = params.arrivalT;
    const ax = pathX(W,d) + params.arrivalSide*halfW(W,d);
    const ay = depthY(H,d);
    const rx = halfW(W,d)*0.78, ry = rx*0.42;
    // cleared ground disc (a touch lighter than the floor)
    pen.paint(()=>{ g.ellipse(ax, ay, rx, ry, 0,0,7); }, toneSolid(inkLevel(2)), 4);
    // inner ring
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.75;
    g.beginPath(); g.ellipse(ax, ay, rx*0.6, ry*0.6, 0,0,7); g.stroke();
    // radiating arrival glyph (thin spokes)
    for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; g.beginPath(); g.moveTo(ax,ay); g.lineTo(ax+Math.cos(a)*rx*0.9, ay+Math.sin(a)*ry*0.9); g.stroke(); }
    g.globalAlpha=1;
    // a single blue survey tick marks it as the ADDRESSED arrival anchor
    g.fillStyle=ACCENT; g.fillRect(ax-2, ay-ry-H*0.028, 4, H*0.028);
    g.fillStyle=ACCENT; g.beginPath(); g.arc(ax, ay-ry-H*0.030, W*0.007, 0,7); g.fill();
  }
}

export const asset = {
  id:"location.forest-meeting-path",
  type:"LOCATION",
  name:"Forest Meeting Path",
  statusWord:"LIMINAL",
  scene:"OD-B10-S05",

  params,
  // back -> front draw order; scene state can pass a subset to reveal/occlude
  layers:["sky","treeline","understory","path","trees","arrival","anchors"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "spot:divine-arrival":{x:.44,y:.62},
    "threshold:to-ship-camp":{x:.50,y:.97},
    "threshold:to-palace":{x:.52,y:.30},
    "path:near":{x:.50,y:.88},
    "path:mid":{x:.51,y:.60},
    "path:far":{x:.52,y:.36},
    "entrance:camp":{x:.50,y:.98},
    "exit:palace":{x:.52,y:.30},
    "camera:wide":{x:.50,y:.50},
    "camera:arrival":{x:.44,y:.60},
    "camera:far-gap":{x:.52,y:.40},
  },
  // walkable path corridor + the off-path arrival clearing (for pathing)
  zones:{
    walkable:{ x0:.22,y0:.30,x1:.82,y1:.98 },
    "path-corridor":{ x0:.30,y0:.31,x1:.74,y1:.98 },
    "arrival-clearing":{ x0:.30,y0:.55,x1:.50,y1:.70 },
    "far-threshold":{ x0:.46,y0:.20,x1:.58,y1:.32 },
    "near-threshold":{ x0:.20,y0:.92,x1:.80,y1:.99 },
  },
  states:{
    initial:"empty",
    nodes:{
      empty:{ preview:{ layers:["sky","treeline","understory","path","trees","arrival"] } },
      "arrival-primed":{ preview:{ layers:["sky","treeline","understory","path","trees","arrival"] } },
      "no-mark":{ preview:{ layers:["sky","treeline","understory","path","trees"] } },
    },
    edges:[["empty","arrival-primed"],["empty","no-mark"],["arrival-primed","empty"]],
  },
  channels:["reveal","camera","light"],

  preview:()=>({ layers:["sky","treeline","understory","path","trees","arrival"], status:"LIMINAL", progress:.18 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
