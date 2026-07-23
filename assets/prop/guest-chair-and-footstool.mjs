/* prop.guest-chair-and-footstool — a wooden guest chair with a separate
   low footstool. PROP asset. Isolated reusable object drawn in SOLID grays +
   hard contour into the offscreen ctx; the engine dotify pass supplies the
   halftone. Do NOT pre-dither.
   Scene function (OD-B01-S04): paired furniture that anchors sit / rise /
   turn-toward / honor-position performances. Three states:
     VACANT   — footstool tucked, bare seat (the seat a guest is offered)
     SEATED   — footstool pulled forward for the feet, cushion on the seat
     HONORED  — footstool forward, cushion + a cloth draped over the back
   Drawn in a light oblique 3/4 so seat, back-slats, legs and the stool all
   read as one carpentered set. Contact / support / grip anchors in 0..1. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  owner:"guest",        // ownership: offered to a visiting guest
  wood:5,               // base wood ink level
  slats:4,              // vertical back slats
  seatTh:0.034,         // seat slab thickness (fraction of H)
  legW:0.024,           // leg width (fraction of W)
  collision:"box",      // collision shape kind
};

/* draw one oblique box (top + front + right-side faces) from four top
   corners (pixel points) and a downward thickness th. */
function box3D(pen,g,c,th,topL,frontL,sideL){
  const FLb={x:c.FL.x,y:c.FL.y+th}, FRb={x:c.FR.x,y:c.FR.y+th}, BRb={x:c.BR.x,y:c.BR.y+th};
  // right side face
  pen.paint(()=>{ g.moveTo(c.FR.x,c.FR.y); g.lineTo(c.BR.x,c.BR.y); g.lineTo(BRb.x,BRb.y); g.lineTo(FRb.x,FRb.y); g.closePath(); }, toneSolid(inkLevel(sideL)), 5);
  // front face
  pen.paint(()=>{ g.moveTo(c.FL.x,c.FL.y); g.lineTo(c.FR.x,c.FR.y); g.lineTo(FRb.x,FRb.y); g.lineTo(FLb.x,FLb.y); g.closePath(); }, toneSolid(inkLevel(frontL)), 5);
  // top face
  pen.paint(()=>{ g.moveTo(c.FL.x,c.FL.y); g.lineTo(c.FR.x,c.FR.y); g.lineTo(c.BR.x,c.BR.y); g.lineTo(c.BL.x,c.BL.y); g.closePath(); }, toneSolid(inkLevel(topL)), 5);
}

/* vertical wooden leg/post as a slightly-tapered bar */
function post(pen,g,x,yTop,yBot,w,taper,tone){
  const wt=w, wb=w*taper;
  pen.paint(()=>{
    g.moveTo(x-wt/2,yTop); g.lineTo(x+wt/2,yTop);
    g.lineTo(x+wb/2,yBot); g.lineTo(x-wb/2,yBot); g.closePath();
  }, tone, 5);
}

function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const P = (nx,ny)=>({x:nx*W,y:ny*H});
  const stoolFwd = clamp(st.stoolFwd ?? 0.15, 0, 1);
  const cushion  = clamp(st.cushion  ?? 0,    0, 1);
  const drape    = clamp(st.drape    ?? 0,    0, 1);
  const seatTh = H*params.seatTh;
  const legW   = W*params.legW;
  const wD = inkLevel(params.wood);        // dark wood (front / legs)
  const wM = inkLevel(params.wood-1);      // mid wood (sides / posts)
  const wL = inkLevel(params.wood-2);      // light wood (top faces)

  /* ---------- GROUND SHADOW ---------- */
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(W*0.55,H*0.855,W*0.30,H*0.020,0,0,7); g.fill();
  g.beginPath(); g.ellipse(W*(0.40-stoolFwd*0.05),H*(0.815+stoolFwd*0.02),W*0.15,H*0.014,0,0,7); g.fill();

  /* ---------- SEAT top-corner geometry (oblique 3/4) ---------- */
  const FL=P(0.42,0.600), FR=P(0.64,0.600), BR=P(0.70,0.505), BL=P(0.48,0.505);

  /* ---------- BACK legs / stiles (rise from the two back corners) ---------- */
  post(pen,g,BL.x,H*0.240,H*0.835,legW*1.05,0.72,toneSolid(wM));   // left stile+leg
  post(pen,g,BR.x,H*0.225,H*0.820,legW*1.05,0.72,toneSolid(wM));   // right stile+leg

  /* ---------- BACKREST: top rail, cross rail, vertical slats ---------- */
  // top rail (a thick bar spanning the two stiles)
  const rT={x:BL.x-legW*0.2,y:H*0.230}, rTr={x:BR.x+legW*0.2,y:H*0.215};
  const railTh=H*0.032;
  pen.paint(()=>{
    g.moveTo(rT.x,rT.y); g.lineTo(rTr.x,rTr.y);
    g.lineTo(rTr.x,rTr.y+railTh); g.lineTo(rT.x,rT.y+railTh); g.closePath();
  }, toneSolid(wD), 5);
  // vertical slats
  const slatTop=H*0.262, slatBot=H*0.462;
  for(let i=0;i<params.slats;i++){
    const f=(i+1)/(params.slats+1);
    const bx=lerp(BL.x+legW*0.4,BR.x-legW*0.4,f);
    const tx=bx+W*0.006;   // faint shared oblique, matching the frame
    pen.paint(()=>{
      g.moveTo(tx-W*0.0085,slatTop); g.lineTo(tx+W*0.0085,slatTop);
      g.lineTo(bx+W*0.0085,slatBot); g.lineTo(bx-W*0.0085,slatBot); g.closePath();
    }, toneSolid(wM), 4);
  }
  // lower cross rail at the seat back
  const cT={x:BL.x-legW*0.1,y:H*0.462}, cTr={x:BR.x+legW*0.1,y:H*0.447};
  pen.paint(()=>{
    g.moveTo(cT.x,cT.y); g.lineTo(cTr.x,cTr.y);
    g.lineTo(cTr.x,cTr.y+H*0.024); g.lineTo(cT.x,cT.y+H*0.024); g.closePath();
  }, toneSolid(wD), 5);

  /* ---------- FRONT legs ---------- */
  post(pen,g,FL.x,H*0.600,H*0.850,legW*1.1,0.7,toneSolid(wD));
  post(pen,g,FR.x,H*0.600,H*0.845,legW*1.1,0.7,toneSolid(wD));
  // a stretcher rail between the front legs
  pen.paint(()=>{ g.rect(FL.x-legW*0.3,H*0.760,(FR.x-FL.x)+legW*0.6,H*0.018); }, toneSolid(wM), 4);

  /* ---------- SEAT slab (top + front + side) ---------- */
  box3D(pen,g,{FL,FR,BR,BL},seatTh,params.wood-2,params.wood,params.wood-1);

  /* ---------- CUSHION on the seat (seated / honored) ---------- */
  if (cushion>0.05){
    const inx=(a,b,t)=>({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)});
    const cFL=inx(FL,BR,0.10), cFR=inx(FR,BL,0.10), cBR=inx(BR,FL,0.10), cBL=inx(BL,FR,0.10);
    const rise=H*0.028*cushion;
    [cFL,cFR,cBR,cBL].forEach(p=>p.y-=rise);
    // cushion front lip
    pen.paint(()=>{ g.moveTo(cFL.x,cFL.y); g.lineTo(cFR.x,cFR.y); g.lineTo(cFR.x,cFR.y+H*0.026); g.lineTo(cFL.x,cFL.y+H*0.026); g.closePath(); }, toneSolid(inkLevel(3)), 4);
    // cushion top (soft light pad)
    pen.paint(()=>{ g.moveTo(cFL.x,cFL.y); g.lineTo(cFR.x,cFR.y); g.lineTo(cBR.x,cBR.y); g.lineTo(cBL.x,cBL.y); g.closePath(); }, toneSolid(inkLevel(2)), 4);
    // a button-tuft seam down the middle
    pen.seam(()=>{ g.moveTo(lerp(cFL.x,cBL.x,0.5),lerp(cFL.y,cBL.y,0.5)); g.lineTo(lerp(cFR.x,cBR.x,0.5),lerp(cFR.y,cBR.y,0.5)); }, 2.5);
  }

  /* ---------- DRAPE: honor cloth over the top rail (honored) ---------- */
  if (drape>0.05){
    const dTop=H*0.230, hang=H*0.16*drape;
    pen.paint(()=>{
      g.moveTo(rT.x-W*0.006,dTop);
      g.lineTo(rTr.x+W*0.006,dTop-H*0.006);
      g.lineTo(rTr.x+W*0.006,dTop+hang*0.9);
      // scalloped hem
      const n=4;
      for(let i=n;i>=0;i--){ const f=i/n; const xx=lerp(rT.x,rTr.x,f); const yy=dTop+hang+(i%2? -H*0.014:0); g.lineTo(xx,yy); }
      g.lineTo(rT.x-W*0.006,dTop+hang*0.9); g.closePath();
    }, toneSolid(inkLevel(params.wood)), 4);
    // fold seams
    for(let i=1;i<4;i++){ const f=i/4; const xx=lerp(rT.x,rTr.x,f);
      pen.seam(()=>{ g.moveTo(xx,dTop+H*0.01); g.lineTo(xx+W*0.004,dTop+hang*0.85); }, 2.2); }
  }

  /* ---------- FOOTSTOOL (separate, in front-left; slides out when in use) ---------- */
  const sx = lerp(0.02,-0.05,stoolFwd);   // forward slides left
  const sy = lerp(0.00, 0.03,stoolFwd);   // and slightly down/forward
  const sFL=P(0.30+sx,0.700+sy), sFR=P(0.485+sx,0.700+sy), sBR=P(0.535+sx,0.645+sy), sBL=P(0.35+sx,0.645+sy);
  // stool front legs
  post(pen,g,sFL.x+legW*0.4,sFL.y,H*0.795+sy*H,legW*0.95,0.75,toneSolid(wD));
  post(pen,g,sFR.x-legW*0.4,sFR.y,H*0.790+sy*H,legW*0.95,0.75,toneSolid(wD));
  // stool box (thicker slab so it reads as a stool, not a tile)
  box3D(pen,g,{FL:sFL,FR:sFR,BR:sBR,BL:sBL},H*0.030,params.wood-2,params.wood,params.wood-1);
  // grain seams on the stool top
  pen.seam(()=>{ g.moveTo(lerp(sFL.x,sBL.x,0.5),lerp(sFL.y,sBL.y,0.5)); g.lineTo(lerp(sFR.x,sBR.x,0.5),lerp(sFR.y,sBR.y,0.5)); }, 2.2);

  // subtle grain seam across the seat top
  pen.seam(()=>{ g.moveTo(lerp(FL.x,BL.x,0.45),lerp(FL.y,BL.y,0.45)); g.lineTo(lerp(FR.x,BR.x,0.45),lerp(FR.y,BR.y,0.45)); }, 2.2);
}

export const asset = {
  id:"prop.guest-chair-and-footstool",
  type:"PROP",
  name:"Guest Chair and Footstool",
  statusWord:"VACANT",
  scene:"OD-B01-S04",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","back-legs","backrest","front-legs","seat","cushion","drape","footstool"],
  // normalized 0..1 anchors: sit / rise / turn-toward / honor-position + contacts
  anchors:{
    "sit:seat":{x:.56,y:.555},          // where an occupant's hips rest
    "honor:position":{x:.56,y:.500},    // the honored-guest body center
    "support:back":{x:.59,y:.360},      // backrest contact for the spine
    "turn:toward":{x:.53,y:.660},       // facing/turn-toward direction, chair front
    "rise:clearance":{x:.52,y:.700},    // stand-up / rise clearance in front
    "grip:top-rail":{x:.59,y:.235},     // where a hand moves/turns the chair
    "rest:footstool":{x:.40,y:.690},    // footstool top (feet/footrest)
    "contact:feet":{x:.40,y:.685},      // resting feet contact
    "contact:floor":{x:.55,y:.845},     // chair floor footprint centre
  },
  // collision shape (AABB in 0..1) covering chair + footstool
  zones:{ bounds:{ x0:.26,y0:.21,x1:.74,y1:.86 }, seatpad:{ x0:.42,y0:.50,x1:.70,y1:.61 } },
  states:{
    initial:"vacant",
    nodes:{
      vacant: { preview:{ stoolFwd:0.15, cushion:0, drape:0, status:"VACANT",  progress:.12 } },
      seated: { preview:{ stoolFwd:0.90, cushion:1, drape:0, status:"SEATED",  progress:.55 } },
      honored:{ preview:{ stoolFwd:1.00, cushion:1, drape:1, status:"HONORED", progress:.92 } },
    },
    edges:[["vacant","seated"],["seated","vacant"],["seated","honored"],["honored","seated"],["vacant","honored"]],
  },
  channels:["stoolFwd","cushion","drape","t"],

  preview:()=>({ stoolFwd:0.15, cushion:0, drape:0, t:0, status:"VACANT", progress:.12 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
