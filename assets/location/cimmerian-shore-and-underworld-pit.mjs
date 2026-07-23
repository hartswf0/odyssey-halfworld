/* location.cimmerian-shore-and-underworld-pit — the sunless coast at the world's
   edge where Odysseus digs the pit and calls up the dead. LOCATION asset
   (OD-B11-S01). An EMPTY navigable set, dark and gloomy: a fog-smothered sky
   with no sun, a black ocean-stream, a dark grove of Persephone (black poplars +
   fruit-shedding willows) on the back treeline, the river-meeting where two
   roaring streams converge, a beached black ship hauled up on the strand, the
   broad shore, a dug ritual blood-trench (the bothros) in the foreground, a
   marked sacrifice zone beside it with libation rings, and a ghost-perimeter
   ring scored around the trench where the shades throng. Drawn in SOLID grays +
   hard contour into the offscreen ctx — the engine dotify pass supplies the
   halftone. No characters are baked in; only placement / camera anchors + zones.
   Atlas: OD-B11-S01 — sunless coast, beached ship, dark grove, river meeting,
   ritual trench, sacrifice zone, ghost perimeter. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  horizon:0.30,        // ocean-stream / sky meeting line as fraction of H
  shoreTop:0.42,       // top of the walkable shore (foot of the grove)
  groveTrees:9,        // dark trees of Persephone's grove along the back treeline
  ship:true,           // black ship hauled up on the strand
  rivers:true,         // the river-meeting (two streams converging)
  trench:true,         // the dug ritual blood-trench (bothros) in the foreground
  sacrifice:true,      // sacrifice zone + libation rings beside the trench
  ghostRing:true,      // ghost-perimeter ring scored around the trench
  trenchCx:0.50,       // trench centre x (fraction)
  trenchCy:0.80,       // trench centre y (fraction)
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const shoreTop = H*params.shoreTop;
  const layers = st.layers || ["sky","sea","grove","shore","rivers","ship","ghostring","trench","sacrifice","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY: sunless, fog-smothered. Murky mid tone, no sun disc. ----
  if (has("sky")){
    g.fillStyle = inkLevel(3); g.fillRect(0,0,W,horizon);
    // low fog banks — the mist that hides the Cimmerians (lighter, breaks the flat)
    g.fillStyle = inkLevel(2);
    for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(W*(0.14+i*0.26), horizon*(0.34+0.16*(i%2)), W*0.15, H*0.028, 0,0,7); g.fill(); }
    // a darker overcast ceiling band pressing down from the top
    g.fillStyle = inkLevel(4); g.fillRect(0,0,W,H*0.05);
  }

  // ---- SEA: the sunless ocean-stream at the world's edge (mid tone) ----
  if (has("sea")){
    pen.paint(()=>{ g.rect(0,horizon,W,shoreTop-horizon); }, toneSolid(inkLevel(3)), 0);
    // a darker near band gives depth without a flat blob
    g.fillStyle=inkLevel(4); g.fillRect(0, shoreTop-H*0.040, W, H*0.040);
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 4);
    // sluggish swell lines receding to the horizon
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
    for(let j=1;j<=3;j++){
      const y = lerp(horizon+H*0.02, shoreTop-H*0.02, j/4);
      g.beginPath();
      for(let s=0;s<=20;s++){ const x=W*s/20; const yy=y+Math.sin(s*0.8+j)*H*0.005; s?g.lineTo(x,yy):g.moveTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- GROVE OF PERSEPHONE: dark treeline behind the shore (darkest band) ----
  // black poplars (tall, columnar) alternating with drooping fruit-shedding willows
  if (has("grove")){
    const n = params.groveTrees;
    for(let i=0;i<n;i++){
      const t=(i+0.5)/n;
      const bx=W*(0.05+0.90*t);
      const baseY=shoreTop+H*0.006;
      const poplar = (i%2===0);
      const th = poplar ? H*(0.20+0.03*Math.sin(i*1.7)) : H*0.15;   // height
      if (poplar){
        // columnar black poplar: narrow flame silhouette
        pen.paint(()=>{
          g.moveTo(bx, baseY-th);
          g.quadraticCurveTo(bx+W*0.028, baseY-th*0.4, bx+W*0.014, baseY);
          g.lineTo(bx-W*0.014, baseY);
          g.quadraticCurveTo(bx-W*0.028, baseY-th*0.4, bx, baseY-th);
          g.closePath();
        }, toneSolid(inkLevel(7)), 3);
      } else {
        // drooping willow: rounded dark crown over a short trunk
        pen.paint(()=>{ g.rect(bx-W*0.006, baseY-th*0.55, W*0.012, th*0.55); }, toneSolid(inkLevel(6)), 2); // trunk
        pen.paint(()=>{ g.ellipse(bx, baseY-th*0.62, W*0.045, th*0.5, 0,0,7); }, toneSolid(inkLevel(6)), 3); // crown
        // drooping fronds shedding down
        g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
        for(let k=-2;k<=2;k++){ const fx=bx+k*W*0.014;
          g.beginPath(); g.moveTo(fx, baseY-th*0.62);
          g.quadraticCurveTo(fx+k*W*0.006, baseY-th*0.2, fx+k*W*0.010, baseY-H*0.005); g.stroke(); }
        g.globalAlpha=1;
      }
    }
    // a low understory line joining the grove feet (thin, so the horizon still reads)
    g.fillStyle=inkLevel(4); g.fillRect(0, shoreTop-H*0.002, W, H*0.008);
  }

  // ---- SHORE (broad dark strand, foreground ground — mid tone so trench reads) ----
  if (has("shore")){
    g.fillStyle=inkLevel(3); g.fillRect(0, shoreTop+H*0.008, W, H-(shoreTop+H*0.008));
    // faint drift lines scoured across the sand
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.22;
    for(let j=1;j<=3;j++){ const y=lerp(shoreTop+H*0.06, H*0.96, j/3);
      g.beginPath(); for(let s=0;s<=20;s++){ const x=W*s/20; const yy=y+Math.sin(s*0.6+j)*H*0.006; s?g.lineTo(x,yy):g.moveTo(x,yy);} g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- RIVER-MEETING: two roaring streams converging on the shore ----
  // Pyriphlegethon + Cocytus meet at a rock, then run seaward as one channel
  if (has("rivers") && params.rivers){
    const meetX=W*0.34, meetY=shoreTop+H*0.10;   // the meeting rock, mid-left
    const drawChannel=(x0,y0,x1,y1,wTop,wBot)=>{
      // dark water ribbon between two banks
      pen.paint(()=>{
        g.moveTo(x0-wTop, y0); g.lineTo(x0+wTop, y0);
        g.quadraticCurveTo(lerp(x0,x1,0.5)+wBot, lerp(y0,y1,0.5), x1+wBot, y1);
        g.lineTo(x1-wBot, y1);
        g.quadraticCurveTo(lerp(x0,x1,0.5)-wTop, lerp(y0,y1,0.5), x0-wTop, y0);
        g.closePath();
      }, toneSolid(inkLevel(5)), 3);
    };
    // stream A: down from the grove (upper-left)
    drawChannel(W*0.22, shoreTop-H*0.01, meetX, meetY, W*0.012, W*0.020);
    // stream B: down from the grove (upper-right of the meeting)
    drawChannel(W*0.46, shoreTop-H*0.01, meetX, meetY, W*0.012, W*0.020);
    // the meeting rock
    pen.paint(()=>{ g.ellipse(meetX, meetY, W*0.028, H*0.020, 0,0,7); }, toneSolid(inkLevel(6)), 3);
    // combined channel running seaward toward the surf on the left
    drawChannel(meetX, meetY+H*0.01, W*0.14, shoreTop+H*0.30, W*0.026, W*0.040);
    // ripple ticks in the confluence
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let k=0;k<3;k++){ const ry=meetY+H*(0.03+k*0.03);
      g.beginPath(); g.moveTo(meetX-W*0.03, ry); g.quadraticCurveTo(meetX, ry-H*0.008, meetX+W*0.03, ry); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- BEACHED SHIP: the black ship hauled up on the strand (right of centre) ----
  if (has("ship") && params.ship){
    const bx=W*0.74, by=shoreTop+H*0.14, bw=W*0.15, bh=H*0.055;
    // dark hull crescent (prow + stern rising)
    pen.paint(()=>{
      g.moveTo(bx-bw, by-bh*0.2);
      g.quadraticCurveTo(bx-bw*0.4, by+bh, bx+bw, by-bh*0.2);       // underside
      g.quadraticCurveTo(bx+bw*1.05, by-bh*0.9, bx+bw*0.68, by-bh*0.9);
      g.quadraticCurveTo(bx, by-bh*0.35, bx-bw*0.68, by-bh*0.9);    // gunwale
      g.quadraticCurveTo(bx-bw*1.05, by-bh*0.9, bx-bw, by-bh*0.2);
      g.closePath();
    }, toneSolid(inkLevel(7)), 4);
    // mast + furled yard
    pen.ink(()=>{ g.moveTo(bx, by-bh*0.5); g.lineTo(bx, by-H*0.13); }, 4);
    pen.ink(()=>{ g.moveTo(bx-W*0.03, by-H*0.10); g.lineTo(bx+W*0.03, by-H*0.10); }, 3);
    // twin keel grooves the hull rode up on
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(const off of [-bw*0.4, bw*0.4]){ g.beginPath(); g.moveTo(bx+off, by+bh*0.6); g.lineTo(bx+off*1.4, by+H*0.10); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- GHOST-PERIMETER RING: scored ring around the trench where shades throng ----
  if (has("ghostring") && params.ghostRing){
    const cx=W*params.trenchCx, cy=H*params.trenchCy;
    const rx=W*0.30, ry=H*0.14;
    // the scored perimeter (broken ring, drawn as ticks so it reads as a boundary)
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.55;
    g.setLineDash([W*0.02, W*0.014]);
    g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.stroke();
    g.setLineDash([]);
    g.globalAlpha=1;
    // faint radial wisp-marks standing at the ring (throng markers, NOT figures)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.32;
    for(let i=0;i<14;i++){
      const a=(i/14)*Math.PI*2;
      const wx=cx+Math.cos(a)*rx*0.98, wy=cy+Math.sin(a)*ry*0.98;
      if (wy < cy+ry*0.2){ // only the far/side arc, keep the near foreground clear
        g.beginPath(); g.moveTo(wx, wy); g.quadraticCurveTo(wx+W*0.004, wy-H*0.03, wx-W*0.002, wy-H*0.05); g.stroke();
      }
    }
    g.globalAlpha=1;
  }

  // ---- RITUAL BLOOD-TRENCH (bothros): the dug pit in the foreground ----
  if (has("trench") && params.trench){
    const cx=W*params.trenchCx, cy=H*params.trenchCy;
    const tw=W*0.11, th=H*0.055;
    // heaped earth rim around the pit (mid-dark, thrown-up spoil)
    pen.paint(()=>{ g.ellipse(cx, cy, tw*1.5, th*1.7, 0,0,7); }, toneSolid(inkLevel(4)), 4);
    // the pit mouth (perspective ellipse), dark earth wall
    pen.paint(()=>{ g.ellipse(cx, cy, tw, th, 0,0,7); }, toneSolid(inkLevel(6)), 4);
    // the blood pooled in the trench (darkest — the offering that draws the dead)
    pen.paint(()=>{ g.ellipse(cx, cy+th*0.16, tw*0.72, th*0.60, 0,0,7); }, toneSolid(inkLevel(7)), 3);
    // a glint contour on the blood surface
    g.strokeStyle=inkLevel(3); g.lineWidth=2; g.globalAlpha=0.6;
    g.beginPath(); g.ellipse(cx-tw*0.15, cy+th*0.05, tw*0.30, th*0.16, 0, Math.PI*0.9, Math.PI*1.9); g.stroke();
    g.globalAlpha=1;
    // spade-scored edge on the near lip
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let k=-3;k<=3;k++){ const ex=cx+k*tw*0.28;
      g.beginPath(); g.moveTo(ex, cy+th*0.85); g.lineTo(ex, cy+th*1.05); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- SACRIFICE ZONE: offering slab + libation rings beside the trench ----
  if (has("sacrifice") && params.sacrifice){
    const sx=W*0.72, sy=H*0.80;
    // three concentric libation rings poured round the pit (honey/milk, wine, water + barley)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let r=1;r<=3;r++){ g.beginPath(); g.ellipse(sx, sy, W*0.03*r, H*0.014*r, 0,0,7); g.stroke(); }
    g.globalAlpha=1;
    // the sacrifice slab / offering stone
    pen.paint(()=>{ g.rect(sx-W*0.035, sy-H*0.016, W*0.07, H*0.026); }, toneSolid(inkLevel(5)), 4);   // base slab
    pen.paint(()=>{ g.rect(sx-W*0.044, sy-H*0.024, W*0.088, H*0.010); }, toneSolid(inkLevel(6)), 3);   // capstone
    // barley scatter (small light flecks — no figures)
    g.fillStyle=inkLevel(2);
    for(let k=0;k<7;k++){ const a=k*1.3; g.beginPath(); g.arc(sx+Math.cos(a)*W*0.05, sy+Math.sin(a)*H*0.03, W*0.004, 0,7); g.fill(); }
    // strewn barley contour so the flecks read against the dark shore
    g.strokeStyle=INK; g.lineWidth=1; g.globalAlpha=0.5;
    for(let k=0;k<7;k++){ const a=k*1.3; g.beginPath(); g.arc(sx+Math.cos(a)*W*0.05, sy+Math.sin(a)*H*0.03, W*0.004, 0,7); g.stroke(); }
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"location.cimmerian-shore-and-underworld-pit",
  type:"LOCATION",
  name:"Cimmerian Shore and Underworld Pit",
  statusWord:"SUNLESS",
  scene:"OD-B11-S01",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","sea","grove","shore","rivers","ship","ghostring","trench","sacrifice","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "pit:trench":{x:.50,y:.80},            // the dug ritual blood-trench (focus)
    "zone:sacrifice":{x:.72,y:.80},        // the sacrifice slab beside the pit
    "ring:ghosts":{x:.50,y:.80},           // centre of the ghost-perimeter ring
    "rock:river-meeting":{x:.34,y:.52},    // the rock where the two streams meet
    "hull:beached":{x:.74,y:.56},          // the black ship hauled up on the strand
    "grove:persephone":{x:.50,y:.44},      // the dark grove treeline behind the shore
    "view:ocean":{x:.20,y:.30},            // sightline out over the ocean-stream
    "channel:seaward":{x:.14,y:.72},       // where the joined river runs to the sea
    "entrance:left":{x:.04,y:.90}, "exit:right":{x:.96,y:.90}, "exit:grove":{x:.50,y:.40},
    "camera:wide":{x:.50,y:.50}, "camera:pit":{x:.50,y:.78}, "camera:grove":{x:.50,y:.46},
  },
  // walkable / interaction regions for scene placement + pathing
  zones:{
    shore:{ x0:.02,y0:.42,x1:.98,y1:.98 },       // the whole broad walkable strand
    trench:{ x0:.37,y0:.72,x1:.63,y1:.88 },      // the pit + its earth rim (hazard)
    ghostPerimeter:{ x0:.18,y0:.64,x1:.82,y1:.95 }, // the scored ring the shades throng
    sacrifice:{ x0:.62,y0:.74,x1:.84,y1:.87 },   // the offering / libation zone
    grove:{ x0:.02,y0:.40,x1:.98,y1:.46 },       // Persephone's dark treeline
    riverMeeting:{ x0:.10,y0:.40,x1:.50,y1:.74 },// the converging streams
    sea:{ x0:.00,y0:.30,x1:1.0,y1:.42 },
  },
  states:{
    initial:"digging",
    nodes:{
      digging:{ preview:{ layers:["sky","sea","grove","shore","rivers","ship","trench"] } },              // pit dug, no rite yet
      "rite":{ preview:{ layers:["sky","sea","grove","shore","rivers","ship","ghostring","trench","sacrifice"] } }, // full rite, ghosts gather
      "thronged":{ preview:{ layers:["sky","sea","grove","shore","rivers","ship","ghostring","trench"] } }, // shades crowd the ring
      bare:{ preview:{ layers:["sky","sea","grove","shore","rivers","ship"] } },                            // empty coast, no pit
    },
    edges:[["digging","rite"],["rite","thronged"],["thronged","rite"],["digging","bare"]],
  },
  channels:["reveal","camera","fog","tide","light"],

  preview:()=>({ layers:["sky","sea","grove","shore","rivers","ship","ghostring","trench","sacrifice"], status:"SUNLESS", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
