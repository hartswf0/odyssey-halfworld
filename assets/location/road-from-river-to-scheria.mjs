/* location.road-from-river-to-scheria — the cart road that runs up from the
   washing-river to the Phaeacian city. LOCATION asset (OD-B06-S04). An EMPTY
   navigable ROUTE read foreground->distance: a near FOLLOWER-DISTANCE lane
   where Odysseus trails on foot, a WAGON-LEAD lane ahead where Nausicaa's mule
   cart rolls on, a marked ATHENA POPLAR GROVE waiting-point off the shoulder,
   and on the horizon the CITY — ringed WALLS with a gate, the PALACE massing to
   one flank, the HARBOR opening to the other. Foreground road / middle grove /
   background city. Drawn in SOLID grays + hard contour into the offscreen ctx —
   the engine dotify pass supplies the halftone. No characters baked in; only
   placement / camera / waypoint anchors.
   Atlas: OD-B06-S04 — wagon-lead lane, follower-distance lane, Athena grove
   waiting point, walls, harbor, palace direction. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.44,        // city/sky meeting line as fraction of H
  gateX:0.55,          // the road funnels into the city gate here
  palaceX:0.40,        // palace direction (massing left of the gate)
  harborX:0.83,        // harbor opening (right of the walls)
  groveX:0.235,        // Athena poplar grove waiting-point (off the left shoulder)
  poplars:5,           // tall narrow trees in the grove
  followerT:0.26,      // where the follower keeps his distance along the road
  leadT:0.70,          // where the wagon leads on ahead
};

/* quadratic-bezier route: P0 near road-mouth (lower centre) -> P1 -> P2 gate. */
function ctrl(W,H){
  return {
    P0:{x:0.47*W, y:0.975*H},
    P1:{x:0.505*W, y:0.72*H},
    P2:{x:params.gateX*W, y:(params.horizon+0.015)*H},
  };
}
function roadPt(t, W, H){
  const {P0,P1,P2}=ctrl(W,H), u=1-t;
  return { x:u*u*P0.x+2*u*t*P1.x+t*t*P2.x, y:u*u*P0.y+2*u*t*P1.y+t*t*P2.y };
}
function roadTan(t, W, H){
  const {P0,P1,P2}=ctrl(W,H);
  const dx=2*(1-t)*(P1.x-P0.x)+2*t*(P2.x-P1.x);
  const dy=2*(1-t)*(P1.y-P0.y)+2*t*(P2.y-P1.y);
  const n=Math.hypot(dx,dy)||1; return { x:dx/n, y:dy/n };
}
// half-width of the road: wide near-field foot -> a thread at the gate
function roadHW(t, W){ return lerp(0.125, 0.010, t)*W; }
// a point offset off the road shoulder at parameter t (s=+1 right, -1 left)
function shoulderPt(t, W, H, s, k=1.25){
  const p=roadPt(t,W,H), tan=roadTan(t,W,H), hw=roadHW(t,W);
  return { x:p.x + s*tan.y*hw*k, y:p.y - s*tan.x*hw*k };
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const layers = st.layers || ["sky","harbor","walls","palace","grove","fields","road","lanes","waypoints","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest tone -> sparse dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.22+i*0.26), horizon*(0.30+0.12*(i%2)), W*0.12, H*0.018, 0,0,7); g.fill(); }
  }

  // ---- HARBOR: sheltered water opening to the right of the walls, with masts ----
  if (has("harbor")){
    const hx=params.harborX*W;
    pen.paint(()=>{ g.rect(hx-W*0.15, horizon-H*0.045, W*0.34, H*0.06); }, toneSolid(inkLevel(3)), 3);
    // calm ripple rules across the basin
    g.strokeStyle=INK; g.globalAlpha=0.4; g.lineWidth=2;
    for(let j=1;j<=2;j++){ const y=horizon-H*0.045+j*H*0.02;
      g.beginPath(); g.moveTo(hx-W*0.14,y); g.lineTo(hx+W*0.18,y); g.stroke(); }
    g.globalAlpha=1;
    // a couple of moored masts (a harbor town by its ships)
    g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
    for(const mx of [hx-W*0.04, hx+W*0.05, hx+W*0.12]){
      g.beginPath(); g.moveTo(mx, horizon-H*0.04); g.lineTo(mx, horizon-H*0.115); g.stroke();
      g.beginPath(); g.moveTo(mx-W*0.018, horizon-H*0.10); g.lineTo(mx+W*0.018, horizon-H*0.10); g.stroke();
    }
  }

  // ---- WALLS: the ringed city wall band across the back, gate straddling road ----
  if (has("walls")){
    const wx0=W*0.30, wx1=W*0.78, wtop=horizon-H*0.10, wbot=horizon+H*0.005;
    pen.paint(()=>{ g.rect(wx0, wtop, wx1-wx0, wbot-wtop); }, toneSolid(inkLevel(4)), 5);
    // crenellations along the parapet
    g.fillStyle=inkLevel(5);
    const merlons=13, span=(wx1-wx0)/merlons;
    for(let i=0;i<merlons;i++){ if(i%2) continue; g.fillRect(wx0+i*span, wtop-H*0.018, span, H*0.018); }
    // a flanking tower at each end
    for(const tx of [wx0, wx1-W*0.045]){
      pen.paint(()=>{ g.rect(tx-W*0.006, wtop-H*0.045, W*0.05, wbot-(wtop-H*0.045)); }, toneSolid(inkLevel(5)), 4);
    }
    // the GATE arch where the road meets the wall (dark opening)
    const gx=params.gateX*W;
    pen.paint(()=>{
      g.moveTo(gx-W*0.028, wbot);
      g.lineTo(gx-W*0.028, wtop+H*0.03);
      g.quadraticCurveTo(gx, wtop-H*0.005, gx+W*0.028, wtop+H*0.03);
      g.lineTo(gx+W*0.028, wbot);
      g.closePath();
    }, toneSolid(inkLevel(7)), 4);
  }

  // ---- PALACE: the direction of Alcinous' palace — a taller massing left of gate ----
  if (has("palace")){
    const px=params.palaceX*W, pbot=horizon-H*0.02;
    // stepped keep rising above the wall line
    pen.paint(()=>{ g.rect(px-W*0.055, pbot-H*0.16, W*0.11, H*0.16); }, toneSolid(inkLevel(5)), 5);
    pen.paint(()=>{ g.rect(px-W*0.030, pbot-H*0.215, W*0.06, H*0.055); }, toneSolid(inkLevel(6)), 4);
    // low-pitch cap on the upper block
    pen.paint(()=>{
      g.moveTo(px-W*0.036, pbot-H*0.215);
      g.lineTo(px, pbot-H*0.245);
      g.lineTo(px+W*0.036, pbot-H*0.215);
      g.closePath();
    }, toneSolid(inkLevel(7)), 3);
    // window slots
    g.fillStyle=inkLevel(7);
    for(let i=0;i<3;i++) g.fillRect(px-W*0.032+i*W*0.028, pbot-H*0.10, W*0.012, H*0.03);
  }

  // ---- FIELDS: open ground between city and the near road (mid-light ground) ----
  if (has("fields")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    // a darker tilled band just under the horizon
    g.fillStyle=inkLevel(3); g.fillRect(0,horizon,W,H*0.05);
    // faint field-division lines receding toward the gate
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.32;
    const vx=params.gateX*W, vy=horizon;
    for(let i=-3;i<=3;i++){ const fx=W*0.5+i*W*0.17;
      g.beginPath(); g.moveTo(fx, H*0.99); g.lineTo(lerp(fx,vx,0.68), lerp(H*0.99,vy,0.68)); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- ATHENA POPLAR GROVE: the waiting-point off the left shoulder ----
  if (has("grove")){
    const gxp=params.groveX*W, base=horizon+H*0.20;
    // a low altar stone / spring basin at the grove foot (the marked waiting-point)
    pen.paint(()=>{ g.rect(gxp-W*0.05, base+H*0.005, W*0.10, H*0.028); }, toneSolid(inkLevel(5)), 4);
    pen.paint(()=>{ g.ellipse(gxp, base+H*0.005, W*0.028, H*0.012, 0,0,7); }, toneSolid(inkLevel(6)), 3);
    // tall narrow poplars sacred to Athena
    const n=params.poplars;
    for(let i=0;i<n;i++){
      const t=(i-(n-1)/2)/n;
      const tx=gxp + t*W*0.14 + (i%2?W*0.01:0);
      const th=H*(0.20 - Math.abs(t)*0.03) - (i%2?H*0.015:0);
      const ty=base;
      // trunk
      pen.paint(()=>{ g.rect(tx-W*0.006, ty-th*0.32, W*0.012, th*0.32); }, toneSolid(inkLevel(6)), 3);
      // tall flame-like crown
      const cw=W*0.030+ (i%2?W*0.004:0);
      pen.paint(()=>{
        g.moveTo(tx, ty-th);
        g.quadraticCurveTo(tx+cw, ty-th*0.55, tx+cw*0.7, ty-th*0.30);
        g.quadraticCurveTo(tx+cw*0.4, ty-th*0.30, tx, ty-th*0.30);
        g.quadraticCurveTo(tx-cw*0.4, ty-th*0.30, tx-cw*0.7, ty-th*0.30);
        g.quadraticCurveTo(tx-cw, ty-th*0.55, tx, ty-th);
        g.closePath();
      }, toneSolid(i%2?inkLevel(5):inkLevel(4)), 4);
    }
  }

  // ---- ROAD: the single walkable route, a light ribbon up to the gate ----
  if (has("road")){
    const N=40;
    g.beginPath();
    for(let i=0;i<=N;i++){ const t=i/N,p=roadPt(t,W,H),tan=roadTan(t,W,H),hw=roadHW(t,W);
      const x=p.x - tan.y*hw, y=p.y + tan.x*hw; i?g.lineTo(x,y):g.moveTo(x,y); }
    for(let i=N;i>=0;i--){ const t=i/N,p=roadPt(t,W,H),tan=roadTan(t,W,H),hw=roadHW(t,W);
      const x=p.x + tan.y*hw, y=p.y - tan.x*hw; g.lineTo(x,y); }
    g.closePath();
    g.fillStyle=inkLevel(1); g.fill();   // pale ribbon so the ink edges frame it
    // hard ink edges
    g.strokeStyle=INK; g.lineWidth=3.5; g.lineJoin="round";
    for(const s of [1,-1]){
      g.beginPath();
      for(let i=0;i<=N;i++){ const t=i/N,p=roadPt(t,W,H),tan=roadTan(t,W,H),hw=roadHW(t,W);
        const x=p.x + s*tan.y*hw, y=p.y - s*tan.x*hw; i?g.lineTo(x,y):g.moveTo(x,y); }
      g.stroke();
    }
  }

  // ---- LANES: the two wheel-ruts (the cart track) + the divider between the
  //      near FOLLOWER-DISTANCE segment and the far WAGON-LEAD segment ----
  if (has("lanes")){
    const N=40;
    // twin wheel ruts, offset either side of the road centre = the wagon track
    g.strokeStyle=INK; g.lineWidth=2.5; g.globalAlpha=0.55;
    for(const s of [0.5,-0.5]){
      g.beginPath();
      for(let i=0;i<=N;i++){ const t=i/N,p=roadPt(t,W,H),tan=roadTan(t,W,H),hw=roadHW(t,W);
        const x=p.x + s*tan.y*hw, y=p.y - s*tan.x*hw; i?g.lineTo(x,y):g.moveTo(x,y); }
      g.stroke();
    }
    g.globalAlpha=1;
    // divider crossbar between follower-distance (near) and wagon-lead (far) segments
    const dm=(params.followerT+params.leadT)/2;
    const l=shoulderPt(dm,W,H,-1,1.0), r=shoulderPt(dm,W,H, 1,1.0);
    g.strokeStyle=INK; g.lineWidth=2.5; g.globalAlpha=0.6; g.setLineDash([6,5]);
    g.beginPath(); g.moveTo(l.x,l.y); g.lineTo(r.x,r.y); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
  }

  // ---- WAYPOINTS: the follower hold, the wagon-lead position, and the gate mark ----
  if (has("waypoints")){
    // follower-distance stone (near, off right shoulder)
    const fp=shoulderPt(params.followerT,W,H, 1,1.5), fs=lerp(0.95,0.6,params.followerT);
    pen.paint(()=>{ g.rect(fp.x-W*0.013*fs, fp.y-H*0.046*fs, W*0.026*fs, H*0.046*fs); }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.ellipse(fp.x, fp.y-H*0.046*fs, W*0.015*fs, H*0.010*fs, 0,0,7); }, toneSolid(inkLevel(6)), 2);
    // wagon-lead position ring on the road (far, small — a scuffed halt mark)
    const lp=roadPt(params.leadT,W,H), ls=lerp(0.95,0.55,params.leadT);
    pen.paint(()=>{ g.ellipse(lp.x, lp.y, W*0.020*ls, H*0.010*ls, 0,0,7); }, toneSolid(inkLevel(4)), 3);
    g.fillStyle=inkLevel(6);
    g.beginPath(); g.ellipse(lp.x, lp.y, W*0.010*ls, H*0.005*ls, 0,0,7); g.fill();
  }
}

export const asset = {
  id:"location.road-from-river-to-scheria",
  type:"LOCATION",
  name:"Road from River to Scheria",
  statusWord:"CITYWARD",
  scene:"OD-B06-S04",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","harbor","walls","palace","grove","fields","road","lanes","waypoints","anchors"],
  // normalized 0..1 placement / camera / waypoint anchors (NOT baked characters)
  anchors:{
    "lane:follower-distance":{x:.44,y:.86},   // near: Odysseus trails on foot
    "lane:wagon-lead":{x:.52,y:.60},          // ahead: Nausicaa's cart rolls on
    "waypoint:grove-athena":{x:.235,y:.64},   // marked poplar-grove waiting point
    "grove:spring":{x:.235,y:.67},            // the spring/altar at the grove foot
    "gate:scheria":{x:.55,y:.46},             // the city gate the road funnels to
    "direction:palace":{x:.40,y:.40},         // palace massing (way to Alcinous' hall)
    "direction:harbor":{x:.83,y:.40},         // harbor opening off the wall's flank
    "entrance:river":{x:.47,y:.98},           // walk-on from the washing-river (near)
    "exit:gate":{x:.55,y:.45},                // route leaves through the gate
    "camera:wide":{x:.50,y:.50},
    "camera:grove":{x:.30,y:.60},
    "camera:gate":{x:.55,y:.48},
  },
  // walkable / interaction regions for scene placement + pathing along the route
  zones:{
    road:{ x0:.34,y0:.46,x1:.66,y1:.99 },
    followerLane:{ x0:.36,y0:.72,x1:.62,y1:.99 },   // near segment (follower distance)
    leadLane:{ x0:.44,y0:.50,x1:.60,y1:.72 },        // far segment (wagon lead)
    grove:{ x0:.12,y0:.56,x1:.36,y1:.86 },           // Athena poplar grove waiting point
    cityfront:{ x0:.28,y0:.34,x1:.86,y1:.46 },       // wall / gate / harbor frontage
  },
  states:{
    initial:"approach",
    nodes:{
      approach:{ preview:{ layers:["sky","harbor","walls","palace","grove","fields","road","lanes","waypoints"] } },
      "wagon-ahead":{ preview:{ layers:["sky","harbor","walls","palace","grove","fields","road","lanes","waypoints"] } },
      "at-grove":{ preview:{ layers:["sky","harbor","walls","palace","grove","fields","road","waypoints"] } },
      "gate-near":{ preview:{ layers:["sky","harbor","walls","palace","fields","road","lanes"] } },
      bare:{ preview:{ layers:["sky","walls","fields","road"] } },
    },
    edges:[["approach","wagon-ahead"],["wagon-ahead","at-grove"],["at-grove","gate-near"],["gate-near","bare"],["approach","gate-near"]],
  },
  channels:["reveal","camera","scroll","light"],

  preview:()=>({ layers:["sky","harbor","walls","palace","grove","fields","road","lanes","waypoints"], status:"CITYWARD", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
