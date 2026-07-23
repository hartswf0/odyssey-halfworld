/* location.pylos-to-sparta-road — the two-day overland route Telemachus and
   Peisistratus drive from sandy Pylos to Lacedaemon.
   LOCATION asset (OD-B03-S06). An EMPTY navigable set built as a SCROLLING
   ROUTE read left->right: a Pylos departure GATE, OPEN COUNTRY, the PHERA
   lodging where they break the journey overnight, ripening WHEATLANDS, and a
   MOUNTAIN-RINGED approach where the road funnels through a pass toward Sparta.
   Foreground road / middle fields / background mountains, one walkable path
   with waypoints. Drawn in SOLID grays + hard contour into the offscreen ctx —
   the engine dotify pass supplies the halftone. No characters are baked in;
   only placement / camera / waypoint anchors.
   Atlas: OD-B03-S06 — gates, open country, Phera lodging, wheatlands, mountain-ringed approach. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.50,        // fields/sky meeting line as fraction of H
  gateX:0.17,          // Pylos departure gate straddles the road here
  lodgeX:0.46,         // Phera lodging (overnight halt)
  wheatX0:0.55,        // wheatlands run from here...
  wheatX1:0.78,        // ...to here
  passX:0.86,          // the road funnels into the mountain pass here
  peaks:9,             // back mountain range peaks across the width
};

/* quadratic-bezier route: P0 road-mouth (lower left) -> P1 -> P2 pass (mid right).
   t 0..1 along the road. Returns {x,y} in pixels. */
function roadPt(t, W, H){
  const P0={x:0.03*W, y:0.965*H}, P1={x:0.42*W, y:0.74*H}, P2={x:params.passX*W, y:(params.horizon+0.02)*H};
  const u=1-t;
  return {
    x: u*u*P0.x + 2*u*t*P1.x + t*t*P2.x,
    y: u*u*P0.y + 2*u*t*P1.y + t*t*P2.y,
  };
}
function roadTan(t, W, H){
  const P0={x:0.03*W, y:0.965*H}, P1={x:0.42*W, y:0.74*H}, P2={x:params.passX*W, y:(params.horizon+0.02)*H};
  const dx = 2*(1-t)*(P1.x-P0.x) + 2*t*(P2.x-P1.x);
  const dy = 2*(1-t)*(P1.y-P0.y) + 2*t*(P2.y-P1.y);
  const n = Math.hypot(dx,dy)||1;
  return { x:dx/n, y:dy/n };
}
// half-width of the road at t (wide near-field -> a thread at the pass)
function roadHW(t, W){ return lerp(0.085, 0.010, t)*W; }

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const layers = st.layers || ["sky","mountains","fields","wheat","lodge","road","gate","waypoints","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest tone -> sparse dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    // a couple of thin high cloud banks
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.20+i*0.28), horizon*(0.34+0.12*(i%2)), W*0.12, H*0.020, 0,0,7); g.fill(); }
  }

  // ---- BACKGROUND MOUNTAINS: a range across the back, massing into a ring at
  //      the right that frames the pass toward Sparta ----
  if (has("mountains")){
    // far range: even row of low peaks, light-mid so it reads as distance
    g.fillStyle = inkLevel(3); g.strokeStyle=INK; g.lineWidth=3;
    g.beginPath(); g.moveTo(0,horizon);
    for(let i=0;i<=params.peaks;i++){
      const x=W*i/params.peaks;
      const ph = horizon - H*(0.10 + 0.05*Math.abs(Math.sin(i*1.7)));
      g.lineTo(x - W*0.5/params.peaks, horizon);
      g.lineTo(x, ph);
    }
    g.lineTo(W,horizon); g.closePath(); g.fill(); g.stroke();

    // the RING: a taller, nearer massif on the right flank around the pass,
    // with a V-notch left open for the road to funnel through.
    const px = params.passX*W;
    // left shoulder of the pass
    pen.paint(()=>{
      g.moveTo(px - W*0.05, horizon);
      g.lineTo(px - W*0.12, horizon - H*0.20);
      g.lineTo(px - W*0.19, horizon - H*0.12);
      g.lineTo(px - W*0.25, horizon);
      g.closePath();
    }, toneSolid(inkLevel(3)), 4);
    // right shoulder of the pass (a touch darker/nearer, frames the notch)
    pen.paint(()=>{
      g.moveTo(px + W*0.05, horizon);
      g.lineTo(px + W*0.11, horizon - H*0.23);
      g.lineTo(px + W*0.18, horizon - H*0.11);
      g.lineTo(px + W*0.25, horizon);
      g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    // a faint scree seam on the right shoulder
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    g.beginPath(); g.moveTo(px+W*0.11, horizon-H*0.23);
    g.lineTo(px+W*0.14, horizon-H*0.15); g.lineTo(px+W*0.10, horizon-H*0.12); g.stroke();
    g.globalAlpha=1;
  }

  // ---- FIELDS: the open country between mountains and the near road (ground) ----
  if (has("fields")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    // a mid band of tilled open country just under the horizon (a touch darker)
    g.fillStyle=inkLevel(3); g.fillRect(0,horizon,W,H*0.07);
    // field-division hedges receding to a soft vanishing point near the pass
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    const vx=params.passX*W, vy=horizon;
    for(let i=-4;i<=4;i++){
      const fx = W*0.5 + i*W*0.14;
      g.beginPath(); g.moveTo(fx, H*0.98); g.lineTo(lerp(fx,vx,0.72), lerp(H*0.98,vy,0.72)); g.stroke();
    }
    // a few cross furrows
    for(let j=1;j<=3;j++){ const y=lerp(horizon+H*0.05, H*0.92, j/4);
      g.beginPath(); for(let s=0;s<=24;s++){ const x=W*s/24; const yy=y+Math.sin(s*0.6+j)*H*0.005; s?g.lineTo(x,yy):g.moveTo(x,yy);} g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- WHEATLANDS: ripening rows of sheaves on the right-centre fields ----
  if (has("wheat")){
    g.strokeStyle=INK; g.lineWidth=2;
    const rows=4, perRow=11;
    for(let r=0;r<rows;r++){
      const ry = lerp(horizon+H*0.06, H*0.86, (r+0.5)/rows);
      const scale = lerp(0.55, 1.25, (r+0.5)/rows);           // nearer rows larger
      for(let c=0;c<perRow;c++){
        const wx = lerp(params.wheatX0, params.wheatX1, (c+0.5)/perRow)*W
                   + Math.sin(r*1.3+c)*W*0.004;
        const stalk=H*0.028*scale;
        // a little sheaf: three splayed stalks with grain heads
        for(const a of [-0.35,0,0.35]){
          const tx=wx + a*stalk*0.6, ty=ry-stalk;
          g.beginPath(); g.moveTo(wx,ry); g.lineTo(tx,ty); g.stroke();
          g.beginPath(); g.ellipse(tx, ty-stalk*0.08, stalk*0.10, stalk*0.22, a*0.9, 0,7); g.stroke();
        }
      }
    }
  }

  // ---- PHERA LODGING: the walled house where the journey breaks overnight ----
  if (has("lodge")){
    const lx=params.lodgeX*W, ly=horizon+H*0.02;
    const bw=W*0.11, bh=H*0.11;
    // body of the lodge
    pen.paint(()=>{ g.rect(lx-bw/2, ly-bh, bw, bh); }, toneSolid(inkLevel(4)), 5);
    // pitched roof
    pen.paint(()=>{
      g.moveTo(lx-bw*0.62, ly-bh);
      g.lineTo(lx, ly-bh-H*0.05);
      g.lineTo(lx+bw*0.62, ly-bh);
      g.closePath();
    }, toneSolid(inkLevel(6)), 5);
    // doorway (dark opening) + a small window
    pen.paint(()=>{ g.rect(lx-bw*0.14, ly-bh*0.55, bw*0.28, bh*0.55); }, toneSolid(inkLevel(7)), 4);
    pen.paint(()=>{ g.rect(lx-bw*0.40, ly-bh*0.78, bw*0.18, bh*0.22); }, toneSolid(inkLevel(6)), 3);
    // a low courtyard wall running off toward the road
    pen.paint(()=>{ g.rect(lx-bw*0.5, ly-H*0.02, bw*1.4, H*0.02); }, toneSolid(inkLevel(3)), 3);
  }

  // ---- ROAD: the single walkable route, a light ribbon crossing the fields
  //      and funnelling into the pass ----
  if (has("road")){
    const N=40;
    // filled road surface (light), right edge out then left edge back
    g.beginPath();
    for(let i=0;i<=N;i++){ const t=i/N; const p=roadPt(t,W,H), tan=roadTan(t,W,H), hw=roadHW(t,W);
      const x=p.x - tan.y*hw, y=p.y + tan.x*hw; i?g.lineTo(x,y):g.moveTo(x,y); }
    for(let i=N;i>=0;i--){ const t=i/N; const p=roadPt(t,W,H), tan=roadTan(t,W,H), hw=roadHW(t,W);
      const x=p.x + tan.y*hw, y=p.y - tan.x*hw; g.lineTo(x,y); }
    g.closePath();
    g.fillStyle=inkLevel(2); g.fill();
    // hard ink edges
    g.strokeStyle=INK; g.lineWidth=3; g.lineJoin="round";
    for(const s of [1,-1]){
      g.beginPath();
      for(let i=0;i<=N;i++){ const t=i/N; const p=roadPt(t,W,H), tan=roadTan(t,W,H), hw=roadHW(t,W);
        const x=p.x + s*tan.y*hw, y=p.y - s*tan.x*hw; i?g.lineTo(x,y):g.moveTo(x,y); }
      g.stroke();
    }
    // centre wheel-rut dashes
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.32;
    for(let i=0;i<N;i+=3){ const t=i/N, t2=(i+1.4)/N;
      const a=roadPt(t,W,H), b=roadPt(Math.min(1,t2),W,H);
      g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- GATE: the Pylos departure gate straddling the road at the start ----
  if (has("gate")){
    // find the road at the gate x to seat the posts on either edge
    let gt=0; for(let i=0;i<=60;i++){ const t=i/60; if(roadPt(t,W,H).x>=params.gateX*W){ gt=t; break; } }
    const p=roadPt(gt,W,H), tan=roadTan(gt,W,H), hw=roadHW(gt,W);
    const postH=H*0.135, postW=W*0.024;
    const lft={x:p.x - tan.y*hw*1.12, y:p.y + tan.x*hw*1.12};
    const rgt={x:p.x + tan.y*hw*1.12, y:p.y - tan.x*hw*1.12};
    // two piers
    for(const b of [lft,rgt]){
      pen.paint(()=>{ g.rect(b.x-postW/2, b.y-postH, postW, postH); }, toneSolid(inkLevel(6)), 4);
      pen.paint(()=>{ g.rect(b.x-postW*0.8, b.y-postH, postW*1.6, postH*0.10); }, toneSolid(inkLevel(7)), 3); // cap
    }
    // lintel beam across the top
    pen.paint(()=>{
      g.moveTo(lft.x-postW*0.8, lft.y-postH);
      g.lineTo(rgt.x+postW*0.8, rgt.y-postH);
      g.lineTo(rgt.x+postW*0.8, rgt.y-postH-H*0.03);
      g.lineTo(lft.x-postW*0.8, lft.y-postH-H*0.03);
      g.closePath();
    }, toneSolid(inkLevel(5)), 4);
  }

  // ---- WAYPOINTS: milestone stones marking the route's stages ----
  if (has("waypoints")){
    const marks=[0.30, 0.58, 0.76];   // open-country, past-Phera, wheat-edge
    for(const t of marks){
      const p=roadPt(t,W,H), tan=roadTan(t,W,H), hw=roadHW(t,W);
      const mx=p.x + tan.y*hw*1.25, my=p.y - tan.x*hw*1.25;   // just off the road shoulder
      const s=lerp(0.9,0.45,t);
      pen.paint(()=>{ g.rect(mx-W*0.012*s, my-H*0.045*s, W*0.024*s, H*0.045*s); }, toneSolid(inkLevel(5)), 3);
      pen.paint(()=>{ g.ellipse(mx, my-H*0.045*s, W*0.014*s, H*0.010*s, 0,0,7); }, toneSolid(inkLevel(6)), 2);
    }
  }
}

export const asset = {
  id:"location.pylos-to-sparta-road",
  type:"LOCATION",
  name:"Pylos-to-Sparta Road",
  statusWord:"OVERLAND",
  scene:"OD-B03-S06",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","mountains","fields","wheat","lodge","road","gate","waypoints","anchors"],
  // normalized 0..1 placement / camera / waypoint anchors (NOT baked characters)
  anchors:{
    "gate:pylos":{x:.10,y:.86},          // departure gate straddling the road
    "waypoint:open-country":{x:.24,y:.80},
    "lodge:phera":{x:.46,y:.50},         // Phera lodging (overnight halt)
    "waypoint:phera-gate":{x:.55,y:.66},
    "field:wheatlands":{x:.66,y:.58},    // ripening wheat rows off the road
    "waypoint:wheat-edge":{x:.73,y:.60},
    "pass:sparta":{x:.86,y:.52},         // mouth of the mountain pass toward Sparta
    "entrance:pylos":{x:.03,y:.96},      // walk-on at the near road-mouth
    "exit:sparta":{x:.86,y:.51},         // route leaves through the pass
    "camera:wide":{x:.50,y:.50}, "camera:lodge":{x:.46,y:.52}, "camera:pass":{x:.80,y:.46},
  },
  // walkable / interaction regions for scene placement + pathing along the route
  zones:{
    road:{ x0:.02,y0:.50,x1:.90,y1:.98 },
    openCountry:{ x0:.02,y0:.50,x1:.45,y1:.96 },
    wheatlands:{ x0:.55,y0:.52,x1:.78,y1:.90 },
    approach:{ x0:.74,y0:.50,x1:.98,y1:.90 },
  },
  states:{
    initial:"scroll",
    nodes:{
      scroll:{ preview:{ layers:["sky","mountains","fields","wheat","lodge","road","gate","waypoints"] } },
      "at-phera":{ preview:{ layers:["sky","mountains","fields","lodge","road","waypoints"] } },
      "wheat-run":{ preview:{ layers:["sky","mountains","fields","wheat","road","waypoints"] } },
      approach:{ preview:{ layers:["sky","mountains","fields","road","waypoints"] } },
      bare:{ preview:{ layers:["sky","mountains","fields","road"] } },
    },
    edges:[["scroll","at-phera"],["at-phera","wheat-run"],["wheat-run","approach"],["approach","bare"],["scroll","approach"]],
  },
  channels:["reveal","camera","scroll","light"],

  preview:()=>({ layers:["sky","mountains","fields","wheat","lodge","road","gate","waypoints"], status:"OVERLAND", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
