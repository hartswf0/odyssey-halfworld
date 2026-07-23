/* vehicle.odysseuss-raft — the modular timber raft Odysseus builds on Ogygia.
   VEHICLE asset. A front-quarter view of a raft of lashed logs: a row of cut
   log-ends at the waterline, a receding deck of bound timbers, transverse
   lashing-beams, a low wicker fence rail, a stepped mast with yard + square
   sail, a trailing steering-oar with tiller, ballast stones and stowed cargo.
   Built through construction stages and rig states, and able to break up in a
   storm. Drawn EMPTY — no rider baked in.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B05-S04): the raft assembling and rigging — loose felled
   logs, then lashed deck, then mast + sail stepped, then under sail, then
   Poseidon's storm wrenching the timbers apart.
   Atlas: reusable boarded object; board/ride/pilot/dock anchors, construction
   + motion states, capacity, collision, damage. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  nLogs:9,          // timbers across the raft
  logInk:3,         // lit top of the timber
  logEndInk:4,      // shaded cut faces at the waterline
  beamInk:5,        // transverse lashing-beams
  mastInk:5,
  sailInk:2,        // pale cloth
  stoneInk:5,       // ballast stones
  waterInk:1,       // near-paper sea
};

/* ---- fixed geometry in the 660x880 source (fractions of W/H) ---- */
function rig(W,H){
  const waterY  = H*0.605;
  const nearL   = W*0.130,  nearR = W*0.870;
  const farL    = W*0.335,  farR  = W*0.665;
  const farY    = H*0.360;                 // far (bow) edge of the deck plane
  const r       = (nearR-nearL)/(2*params.nLogs) * 1.02;   // log-end radius
  const deckNearY = waterY - r;            // near deck edge = tops of the log-ends
  const mastX   = W*0.500;
  const mastTop = H*0.108;
  const yardY   = H*0.185;
  const yardX0  = W*0.255, yardX1 = W*0.745;
  return { waterY, nearL, nearR, farL, farR, farY, r, deckNearY,
           mastX, mastTop, yardY, yardX0, yardX1 };
}
/* a point on the receding deck plane: u across 0..1, v depth 0 near..1 far */
function deckPt(R,u,v){
  const nx = lerp(R.nearL, R.nearR, u), fx = lerp(R.farL, R.farR, u);
  return { x: lerp(nx, fx, v), y: lerp(R.deckNearY, R.farY, v) };
}
function logCenterX(R,i){ return lerp(R.nearL, R.nearR, (i+0.5)/params.nLogs); }

/* per-state pose */
const POSE = {
  logs:    { deck:false, loose:true,  lashings:false, fence:false, mast:false, sail:"none",   steer:false, ballast:false, cargo:false, damage:0,  status:"FELLING",    progress:0.12 },
  lashed:  { deck:true,  loose:false, lashings:true,  fence:false, mast:false, sail:"none",   steer:false, ballast:true,  cargo:false, damage:0,  status:"LASHED",     progress:0.34 },
  rigged:  { deck:true,  loose:false, lashings:true,  fence:true,  mast:true,  sail:"furled", steer:true,  ballast:true,  cargo:true,  damage:0,  status:"RIGGED",     progress:0.58 },
  sailing: { deck:true,  loose:false, lashings:true,  fence:true,  mast:true,  sail:"full",   steer:true,  ballast:true,  cargo:true,  damage:0,  status:"UNDER SAIL", progress:1.00 },
  damaged: { deck:true,  loose:false, lashings:false, fence:true,  mast:true,  sail:"full",   steer:false, ballast:true,  cargo:false, damage:1,  status:"BREAKING UP",progress:0.50 },
};

/* one cut log-end: filled disc with growth rings so it reads as sawn timber */
function logEnd(pen,g,cx,cy,r,endInk){
  pen.paint(()=>{ g.arc(cx,cy,r,0,7); }, toneSolid(inkLevel(endInk)), 4);
  g.strokeStyle = inkLevel(endInk+2); g.lineWidth = 2;
  g.beginPath(); g.arc(cx,cy,r*0.62,0,7); g.stroke();
  g.beginPath(); g.arc(cx,cy,r*0.30,0,7); g.stroke();
  g.fillStyle = inkLevel(endInk+3); g.beginPath(); g.arc(cx,cy,r*0.10,0,7); g.fill();
}

function drawRaft(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "rigged";
  const P = POSE[mode] || POSE.rigged;
  const R = rig(W,H);
  const T = st.t || 0;
  const N = params.nLogs;

  /* ============ SEA (near-paper) + waterline ============ */
  g.fillStyle = inkLevel(params.waterInk); g.fillRect(0, R.waterY, W, H - R.waterY);
  g.strokeStyle = inkLevel(3); g.lineWidth = 2; g.lineCap = "round";
  for (let k=0;k<3;k++){
    const wy = R.waterY + H*0.045 + k*H*0.032;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.05){
      const y = wy + Math.sin(x*0.028 + k*1.7 + T)*3;
      x===0 ? g.moveTo(x,y) : g.lineTo(x,y);
    }
    g.stroke();
  }
  pen.ink(()=>{ g.moveTo(0,R.waterY); g.lineTo(W,R.waterY); }, 2);

  /* ============ LOOSE FELLED LOGS (construction stage 0) ============ */
  if (P.loose){
    // three felled trunks lying across the shallows, not yet bound
    const trunks = [
      { y:R.waterY+H*0.010, x0:W*0.16, x1:W*0.72, rr:R.r*0.9, ink:3 },
      { y:R.waterY+H*0.060, x0:W*0.26, x1:W*0.86, rr:R.r*1.0, ink:4 },
      { y:R.waterY+H*0.110, x0:W*0.12, x1:W*0.66, rr:R.r*0.85,ink:3 },
    ];
    for (const t of trunks){
      pen.paint(()=>{ g.rect(t.x0, t.y-t.rr, t.x1-t.x0, t.rr*2); }, toneSolid(inkLevel(t.ink)), 4);
      // bark seams
      g.strokeStyle=inkLevel(t.ink+2); g.lineWidth=1.6;
      for(let s=1;s<=2;s++){ const yy=t.y-t.rr+ (t.rr*2)*s/3; g.beginPath(); g.moveTo(t.x0+6,yy); g.lineTo(t.x1-6,yy); g.stroke(); }
      logEnd(pen,g,t.x1,t.y,t.rr,params.logEndInk); // sawn end facing right
      logEnd(pen,g,t.x0,t.y,t.rr*0.96,params.logEndInk-1);
    }
    // felling axe leaning on the near log
    pen.limb(()=>{ g.moveTo(W*0.50,R.waterY+H*0.010); g.lineTo(W*0.585,R.waterY-H*0.070); }, toneSolid(inkLevel(5)),5);
    pen.paint(()=>{ g.moveTo(W*0.585,R.waterY-H*0.070); g.lineTo(W*0.625,R.waterY-H*0.086);
                    g.lineTo(W*0.612,R.waterY-H*0.052); g.closePath(); }, toneSolid(inkLevel(6)),3);
    return;
  }

  /* ---- per-log lateral offset for the storm break-up ---- */
  const off = (i)=> P.damage ? (i%2? 1:-1) * H*0.02 * P.damage * (0.5+0.5*Math.sin(T*3+i)) : 0;
  const drop = (i)=> P.damage ? (i%3===0? H*0.02*P.damage : 0) : 0;

  /* ============ DECK PLANE (lit timber tops, receding) ============ */
  pen.paint(()=>{
    g.moveTo(R.nearL, R.deckNearY);
    g.lineTo(R.nearR, R.deckNearY);
    g.lineTo(R.farR,  R.farY);
    g.lineTo(R.farL,  R.farY);
    g.closePath();
  }, toneSolid(inkLevel(params.logInk-1)), 5);

  // seam lines dividing the deck into individual timbers (near -> far)
  g.strokeStyle = inkLevel(params.logInk+2); g.lineWidth = 2.4;
  for (let i=1;i<N;i++){
    const u=i/N; const a=deckPt(R,u,0), b=deckPt(R,u,1);
    g.beginPath(); g.moveTo(a.x+off(i-1)*0.4,a.y); g.lineTo(b.x,b.y); g.stroke();
  }
  // gentle top-shading band per timber (alternating) so the logs read as round
  for (let i=0;i<N;i+=2){
    const a=deckPt(R,(i+0.15)/N,0), b=deckPt(R,(i+0.15)/N,1);
    const a2=deckPt(R,(i+0.5)/N,0), b2=deckPt(R,(i+0.5)/N,1);
    g.fillStyle=inkLevel(params.logInk+1);
    g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(b2.x,b2.y); g.lineTo(a2.x,a2.y); g.closePath(); g.fill();
  }

  /* ============ TRANSVERSE LASHING-BEAMS across the timbers ============ */
  if (P.lashings){
    for (const v of [0.24, 0.62]){
      const a=deckPt(R,0.02,v), b=deckPt(R,0.98,v);
      const bh = lerp(H*0.017, H*0.011, v);
      pen.paint(()=>{ g.moveTo(a.x,a.y-bh); g.lineTo(b.x,b.y-bh); g.lineTo(b.x,b.y+bh); g.lineTo(a.x,a.y+bh); g.closePath(); },
                toneSolid(inkLevel(params.beamInk)), 3);
      // X lashings binding each timber to the beam
      g.strokeStyle=INK; g.lineWidth=1.6;
      for(let i=0;i<N;i++){
        const c=deckPt(R,(i+0.5)/N,v);
        g.beginPath(); g.moveTo(c.x-bh*0.6,c.y-bh); g.lineTo(c.x+bh*0.6,c.y+bh);
        g.moveTo(c.x+bh*0.6,c.y-bh); g.lineTo(c.x-bh*0.6,c.y+bh); g.stroke();
      }
    }
  }

  /* ============ LOG-END ROW (cut faces at the waterline, front face) ============ */
  for (let i=0;i<N;i++){
    const cx = logCenterX(R,i)+off(i);
    const cy = R.waterY + drop(i);
    logEnd(pen,g,cx,cy,R.r, params.logEndInk);
  }
  // shadow of the raft on the water just below the log row
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(W*0.5, R.waterY+R.r*1.4, (R.nearR-R.nearL)/2, R.r*0.5, 0,0,7); g.fill();

  /* ============ BALLAST STONES on the deck ============ */
  if (P.ballast){
    const stones=[ [0.40,0.44,0.9],[0.47,0.48,1.1],[0.56,0.43,0.85],[0.43,0.53,0.8],[0.53,0.54,1.0] ];
    for(const [u,v,s] of stones){
      const p=deckPt(R,u,v);
      pen.paint(()=>{ g.ellipse(p.x,p.y,R.r*0.62*s,R.r*0.44*s,0,0,7); }, toneSolid(inkLevel(params.stoneInk)),3);
      g.strokeStyle=inkLevel(params.stoneInk+2); g.lineWidth=1.4;
      g.beginPath(); g.arc(p.x-R.r*0.1,p.y-R.r*0.06,R.r*0.28*s,-0.6,1.1); g.stroke();
    }
  }

  /* ============ STOWED CARGO (amphora + provisions crate) ============ */
  if (P.cargo){
    // amphora, far-left of the deck
    const a=deckPt(R,0.28,0.44);
    pen.paint(()=>{ g.ellipse(a.x,a.y,R.r*0.5,R.r*0.8,0,0,7); }, toneSolid(inkLevel(4)),3);       // body
    pen.paint(()=>{ g.rect(a.x-R.r*0.14,a.y-R.r*1.35,R.r*0.28,R.r*0.6); }, toneSolid(inkLevel(4)),2); // neck
    g.strokeStyle=INK; g.lineWidth=2;                                                              // handles
    g.beginPath(); g.arc(a.x-R.r*0.34,a.y-R.r*0.7,R.r*0.28,-1.2,1.2); g.stroke();
    g.beginPath(); g.arc(a.x+R.r*0.34,a.y-R.r*0.7,R.r*0.28,Math.PI-1.2,Math.PI+1.2); g.stroke();
    // provisions crate, far-right
    const c=deckPt(R,0.72,0.44);
    pen.paint(()=>{ g.rect(c.x-R.r*0.7,c.y-R.r*0.9,R.r*1.4,R.r*0.9); }, toneSolid(inkLevel(3)),3);
    pen.seam(()=>{ g.moveTo(c.x-R.r*0.7,c.y-R.r*0.45); g.lineTo(c.x+R.r*0.7,c.y-R.r*0.45);
                   g.moveTo(c.x,c.y-R.r*0.9); g.lineTo(c.x,c.y); }, 2);
  }

  /* ============ LOW WICKER FENCE RAIL around the deck edge ============ */
  if (P.fence){
    const postH = H*0.052;
    const railEdge=(u0,v0,u1,v1,nP)=>{
      const pts=[];
      for(let k=0;k<=nP;k++){ const t=k/nP; pts.push(deckPt(R, lerp(u0,u1,t), lerp(v0,v1,t))); }
      // posts
      for(const p of pts){ pen.paint(()=>{ g.rect(p.x-2, p.y-postH, 4, postH); }, toneSolid(inkLevel(4)),2); }
      // top rail
      pen.limb(()=>{ g.moveTo(pts[0].x,pts[0].y-postH); for(let k=1;k<pts.length;k++) g.lineTo(pts[k].x,pts[k].y-postH); },
               toneSolid(inkLevel(3)), 4);
      // woven mid rail
      g.strokeStyle=inkLevel(4); g.lineWidth=1.6;
      g.beginPath(); g.moveTo(pts[0].x,pts[0].y-postH*0.5);
      for(let k=1;k<pts.length;k++) g.lineTo(pts[k].x,pts[k].y-postH*0.5); g.stroke();
    };
    railEdge(0.0,0.0, 0.0,1.0, 4);   // left rail
    railEdge(1.0,0.0, 1.0,1.0, 4);   // right rail
    railEdge(0.0,1.0, 1.0,1.0, 6);   // far (bow) rail
  }

  /* ============ MAST + STEP + RIGGING + SAIL ============ */
  if (P.mast){
    const base = deckPt(R,0.5,0.45);
    const broken = P.damage>0;
    const snapY = R.yardY + H*0.10;
    // mast step block
    pen.paint(()=>{ g.rect(base.x-R.r*0.5, base.y-R.r*0.4, R.r, R.r*0.7); }, toneSolid(inkLevel(6)),3);
    // mast (snapped short if breaking up)
    const topY = broken ? snapY : R.mastTop;
    pen.limb(()=>{ g.moveTo(base.x, base.y); g.lineTo(base.x, topY); },
             toneSolid(inkLevel(params.mastInk)), 11);
    if (broken){
      // splintered upper mast toppling to leeward, dragging the sail
      pen.limb(()=>{ g.moveTo(base.x, snapY); g.lineTo(base.x+W*0.16, snapY-H*0.10); },
               toneSolid(inkLevel(params.mastInk)), 9);
    } else {
      pen.paint(()=>{ g.arc(base.x, R.mastTop, 6, 0,7); }, toneSolid(inkLevel(6)),3);   // mast-head
      // forestay / backstay to the deck ends
      pen.ink(()=>{ g.moveTo(base.x, R.mastTop+4); g.lineTo(R.farL+8, R.farY+6); }, 2);
      pen.ink(()=>{ g.moveTo(base.x, R.mastTop+4); g.lineTo(R.nearL+14, R.deckNearY-4); }, 2);
      pen.ink(()=>{ g.moveTo(base.x, R.mastTop+4); g.lineTo(R.nearR-14, R.deckNearY-4); }, 2);
    }

    // yard + sail (attached to the standing or the snapped mast head)
    const yTopY = broken ? snapY-H*0.09 : R.yardY;
    const yCx   = broken ? base.x+W*0.15 : base.x;
    if (P.sail !== "none"){
      // yard
      const yx0 = broken ? yCx-W*0.16 : R.yardX0, yx1 = broken ? yCx+W*0.16 : R.yardX1;
      pen.limb(()=>{ g.moveTo(yx0, yTopY); g.lineTo(yx1, yTopY); },
               toneSolid(inkLevel(params.mastInk)), 7);
      if (P.sail === "full" && !broken){
        const belly = W*0.026 + Math.sin(T)*W*0.006;
        const footY = R.yardY + H*0.235;
        pen.paint(()=>{
          g.moveTo(R.yardX0+6, R.yardY+4);
          g.lineTo(R.yardX1-6, R.yardY+4);
          g.quadraticCurveTo(R.yardX1+belly, (R.yardY+footY)/2, W*0.640, footY);
          g.quadraticCurveTo(base.x, footY+H*0.024, W*0.360, footY);
          g.quadraticCurveTo(R.yardX0-belly, (R.yardY+footY)/2, R.yardX0+6, R.yardY+4);
          g.closePath();
        }, toneSolid(inkLevel(params.sailInk)), 4);
        g.strokeStyle=inkLevel(3); g.lineWidth=1.5;
        for(let x=R.yardX0+26;x<R.yardX1-16;x+=W*0.06){
          g.beginPath(); g.moveTo(x,R.yardY+6);
          g.quadraticCurveTo(x+belly*0.4,(R.yardY+footY)/2,x,footY-6); g.stroke();
        }
        pen.ink(()=>{ g.moveTo(W*0.640,footY); g.lineTo(R.nearR-16, R.deckNearY-4); }, 1.6);
        pen.ink(()=>{ g.moveTo(W*0.360,footY); g.lineTo(R.nearL+16, R.deckNearY-4); }, 1.6);
      } else if (P.sail === "full" && broken){
        // torn sail streaming off the fallen yard
        pen.paint(()=>{
          g.moveTo(yCx-W*0.16, yTopY);
          g.lineTo(yCx+W*0.16, yTopY);
          g.lineTo(yCx+W*0.20, yTopY+H*0.12);
          g.lineTo(yCx+W*0.06, yTopY+H*0.07);
          g.lineTo(yCx-W*0.02, yTopY+H*0.14);
          g.lineTo(yCx-W*0.14, yTopY+H*0.08);
          g.closePath();
        }, toneSolid(inkLevel(params.sailInk)), 3);
      } else {
        // FURLED: sail rolled into a bundle lashed along the yard
        pen.paint(()=>{ g.ellipse(yCx, yTopY+H*0.014, (R.yardX1-R.yardX0)/2-8, H*0.024, 0,0,7); },
                  toneSolid(inkLevel(params.sailInk+1)), 4);
        g.strokeStyle=INK; g.lineWidth=1.8;
        for(let x=R.yardX0+22;x<R.yardX1-12;x+=W*0.055){
          g.beginPath(); g.moveTo(x,yTopY-H*0.008); g.lineTo(x,yTopY+H*0.034); g.stroke();
        }
      }
    }
  }

  /* ============ STEERING-OAR + TILLER off the near-right (aft) quarter ============ */
  if (P.steer){
    const mnt = { x:R.nearR-R.r*0.6, y:R.deckNearY-2 };
    const blade = { x:W*0.955, y:R.waterY+H*0.115 };
    pen.limb(()=>{ g.moveTo(mnt.x, mnt.y); g.lineTo(blade.x, blade.y); }, toneSolid(inkLevel(4)), 6);
    pen.paint(()=>{ g.ellipse(blade.x, blade.y, W*0.017, H*0.026, -0.55, 0, 7); }, toneSolid(inkLevel(5)), 3);
    // tholepin lashing at the mount + tiller handle inboard
    pen.paint(()=>{ g.arc(mnt.x, mnt.y, R.r*0.28, 0, 7); }, toneSolid(inkLevel(6)), 2);
    pen.ink(()=>{ g.moveTo(mnt.x, mnt.y); g.lineTo(mnt.x-W*0.05, mnt.y-H*0.030); }, 4);
  }
}

export const asset = {
  id:"vehicle.odysseuss-raft",
  type:"VEHICLE",
  name:"Odysseus's Raft",
  statusWord:"ADRIFT",
  scene:"OD-B05-S04",

  params,
  // back -> front draw order the module honors
  layers:["sea","loose-logs","deck","seams","lashings","log-ends","shadow",
          "ballast","cargo","fence","mast","step","stays","yard","sail","steering-oar"],

  // normalized 0..1 board / ride / pilot / dock + attachment anchors (EMPTY raft)
  anchors:{
    "board:aft":{x:.500,y:.605},          // step over the log-ends at the waterline
    "ride:deck":{x:.500,y:.470},          // standing room on the bound deck
    "pilot:helm":{x:.780,y:.520},         // where Odysseus works the steering-oar
    "grip:steering-oar":{x:.815,y:.560},
    "grip:tiller":{x:.740,y:.500},
    mast:{x:.500,y:.300},
    "step:mast":{x:.500,y:.520},
    "yard:center":{x:.500,y:.210},
    "stow:cargo":{x:.680,y:.500},
    "stow:ballast":{x:.470,y:.520},
    bow:{x:.500,y:.360},                  // far edge, into the swell
    stern:{x:.500,y:.590},                // near edge / aft
    "dock:beach":{x:.130,y:.780},         // Ogygia's shore
    "waterline":{x:.500,y:.605},
  },
  // collision shape: the floating timber footprint (asset space); rig rises above
  collision:{ kind:"box", x0:.130, y0:.360, x1:.870, y1:.660 },
  capacity:{ riders:1, cargo:2, total:1 },   // Odysseus alone, with provisions
  ownership:"odysseus",                       // built by his own hands on Ogygia

  states:{
    initial:"rigged",
    nodes:{
      logs:    { preview:{ mode:"logs",    status:"FELLING",     progress:0.12 } },
      lashed:  { preview:{ mode:"lashed",  status:"LASHED",      progress:0.34 } },
      rigged:  { preview:{ mode:"rigged",  status:"RIGGED",      progress:0.58 } },
      sailing: { preview:{ mode:"sailing", status:"UNDER SAIL",  progress:1.00 } },
      damaged: { preview:{ mode:"damaged", status:"BREAKING UP", progress:0.50 } },
    },
    edges:[
      ["logs","lashed"],["lashed","rigged"],["rigged","sailing"],
      ["sailing","damaged"],["sailing","rigged"],["rigged","lashed"],
    ],
  },
  channels:["mode","sail","steer","t"],

  preview:()=>({ mode:"rigged", status:"RIGGED", progress:0.58, t:0 }),
  draw(ctx,W,H,state){ drawRaft(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
