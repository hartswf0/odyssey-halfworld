/* set_piece.battle-threshold-formation — the Book-XXII HOLD, drawn as a plan.
   SET_PIECE. Four men — Odysseus on the sill, Telemachus, Eumaeus, Philoetius —
   stand a line across the near end of the megaron so that TWO things stay under
   their control at once: the great doorway, which is the only way out the
   suitors know, and the postern lane, which is the only way to the arms.
   The whole set piece exists to state that pair as geometry.

   The sheet is a floor PLAN read from above, door-wall at the top, hall below.
   A light floor plane; a broken door-wall carrying the shut leaves, the two
   jambs and the sill block; the postern gap on the left with its lane running
   up to the storeroom, and the BOLT across that lane — barred, swung aside, or
   double-barred, which is the plot of the scene; four station PLATES in a
   shallow forward arc, each with its shield band and spear vector, numbered as
   seven-segment GEOMETRY because set type at this size dissolves in the dot
   lattice; the commanded arc as a second light plane fanning from the sill to
   the near edge; the archer's LANE left open down the spine so Odysseus can
   keep shooting through his own line; and the suitors' pressure as a broken row
   of heads pushing back at the shields.

   Two verification insets: the SILL SECTION (the doorway cut in elevation —
   lintel, jambs, sill, and the four shields standing edge to edge across the
   opening, which is the proof that four bodies cover a door) and the ARMS ISSUE
   table (what Telemachus carries out of the storeroom: four shields, four
   helmets, eight spears, each count stated as a numeral over its own comb).

   Separable component: placement anchors, collision zones, depth layer, and
   five alternate states. SOLID grays + hard contour only; the engine dotify
   pass supplies the halftone.
   Atlas: OD-B22-S03 — four-person defensive line controlling the doorway and
   weapon access. */
import { makePen, toneSolid, inkLevel, INK, lerp } from "../../engine/halfworld-engine.mjs";

/* ---------------- the plan, in fractions of W (x) and H (y) ----------------
   Every anchor and every zone below is read out of these numbers, so the
   drawing and the placement data can never disagree. */
const PLAN = {
  x0:0.082, x1:0.918,           // plan extents
  wallY:0.248, wallT:0.019,     // the door wall (a strip, broken into runs)
  nearY:0.648,                  // near edge of the plan strip
  door:  { x0:0.424, x1:0.616 },
  sillT: 0.042,                 // sill depth into the hall
  jambW: 0.026,                 // door post width
  pier:  { x0:0.758, x1:0.788 },// pier that breaks the long right-hand wall run
  postern:{ x0:0.140, x1:0.208 },
  laneTop:0.188,                // storeroom lane, running UP off the wall
  store: { x0:0.088, y0:0.104, x1:0.268, y1:0.188 },
};

/* the four stations, in a shallow arc convex toward the hall. Odysseus holds
   the centre-right of the sill line; the order is fixed because scenes cite
   these anchors by name. */
const LINE = {
  who:["telemachus","odysseus","eumaeus","philoetius"],
  x:[0.325, 0.455, 0.585, 0.715],
  y:[0.382, 0.410, 0.410, 0.382],
  plateR:0.048,                 // *W  big enough to carry its own numeral
  shieldOut:0.080, shieldIn:0.063,  // *W  the shield band
  shieldArc:1.22,               // half-angle, radians (~70 deg)
  spear:[0.132, 0.156, 0.144, 0.126],  // *H  reach past the plate
  numH:0.044, numLW:7,
};

/* the archer's channel — deliberately left open between stations 2 and 3 so
   Odysseus can keep loosing through his own line */
const LANEX = 0.520;

const SECTION = { x0:0.052, y0:0.686, x1:0.432, y1:0.902 };
const ISSUE   = { x0:0.472, y0:0.686, x1:0.948, y1:0.902 };

/* what comes out of the storeroom, stated as counts */
const KIT = [
  { key:"shields", n:4, glyph:"disc" },
  { key:"helmets", n:4, glyph:"dome" },
  { key:"spears",  n:8, glyph:"tick" },
];

const params = {
  floorLevel:1,       // the hall floor — lightest plane, most of the sheet is paper
  coverLevel:2,       // the commanded arc
  wallLevel:3,
  leafLevel:3,        // the shut door leaves
  sillLevel:2,
  jambLevel:5,        // small dark accents
  plateLevel:2,
  shieldLevel:5,      // thin band — dark, but only a band
  boltLevel:6,
  storeLevel:1,
  boundaryLW:6,
};

/* ---------------- primitives ---------------- */
function seg(g,x1,y1,x2,y2,lw,color,dash){
  g.save(); g.strokeStyle=color||INK; g.lineWidth=lw; g.lineCap="round";
  if(dash) g.setLineDash(dash);
  g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();
  g.setLineDash([]); g.restore();
}
function corner(g,x,y,dx,dy,len,lw){
  g.save(); g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="butt";
  g.beginPath(); g.moveTo(x+dx*len,y); g.lineTo(x,y); g.lineTo(x,y+dy*len); g.stroke(); g.restore();
}
function brackets(g,W,H,B,len,lw){
  const x0=B.x0*W, y0=B.y0*H, x1=B.x1*W, y1=B.y1*H, L=len*W;
  corner(g,x0,y0, 1, 1,L,lw); corner(g,x1,y0,-1, 1,L,lw);
  corner(g,x0,y1, 1,-1,L,lw); corner(g,x1,y1,-1,-1,L,lw);
}
function head(g,x,y,ux,uy,s){        // filled arrow head pointing along (ux,uy)
  const nx=-uy, ny=ux;
  g.save(); g.fillStyle=INK; g.beginPath();
  g.moveTo(x+ux*s*1.7, y+uy*s*1.7);
  g.lineTo(x-nx*s*0.85, y-ny*s*0.85);
  g.lineTo(x+nx*s*0.85, y+ny*s*0.85);
  g.closePath(); g.fill(); g.restore();
}

/* seven-segment numerals — every number on this sheet is drawn as GEOMETRY */
const SEG7 = { "0":"abcdef","1":"bc","2":"abged","3":"abgcd","4":"fgbc","5":"afgcd",
               "6":"afgecd","7":"abc","8":"abcdefg","9":"abfgcd" };
function segDigit(g,ch,x,y,h,lw){
  const w=h*0.60, m=SEG7[ch]||"", my=y+h/2, i=lw*0.75;
  const on=k=>m.includes(k);
  g.save(); g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="round";
  const ln=(x1,y1,x2,y2)=>{ g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke(); };
  if(on("a")) ln(x+i,y,    x+w-i,y);
  if(on("b")) ln(x+w,y+i,  x+w,  my-i);
  if(on("c")) ln(x+w,my+i, x+w,  y+h-i);
  if(on("d")) ln(x+i,y+h,  x+w-i,y+h);
  if(on("e")) ln(x,  my+i, x,    y+h-i);
  if(on("f")) ln(x,  y+i,  x,    my-i);
  if(on("g")) ln(x+i,my,   x+w-i,my);
  g.restore();
  return w;
}
function segNumber(g,text,x,y,h,lw){
  let cx=x; for(const ch of text){ cx += segDigit(g,ch,cx,y,h,lw) + h*0.30; }
  return cx - x - h*0.30;
}
/* centred on cx — "1" is only its two right-hand bars, so it needs shifting
   back by half a cell or the disc it sits in looks lopsided */
function segCentre(g,text,cx,y,h,lw){
  const w=h*0.60, span=text.length*w + (text.length-1)*h*0.30;
  const bias = text==="1" ? -w*0.50 : 0;   // "1" is only its right-hand bar
  segNumber(g, text, cx - span/2 + bias, y, h, lw);
}

/* the shield seen in plan: a curved band standing in front of its bearer */
function shieldBand(g,cx,cy,rOut,rIn,a0,a1){
  g.moveTo(cx+Math.cos(a0)*rOut, cy+Math.sin(a0)*rOut);
  g.arc(cx,cy,rOut,a0,a1);
  g.lineTo(cx+Math.cos(a1)*rIn, cy+Math.sin(a1)*rIn);
  g.arc(cx,cy,rIn,a1,a0,true);
  g.closePath();
}

/* ---------------- the plan floor + its broken boundary ---------------- */
function drawFloor(pen,g,W,H){
  pen.fillPath(()=>{ g.rect(PLAN.x0*W, PLAN.wallY*H, (PLAN.x1-PLAN.x0)*W,
                            (PLAN.nearY-PLAN.wallY)*H); },
               inkLevel(params.floorLevel));
  // side walls: two broken runs each, never one long rule
  for(const sx of [PLAN.x0, PLAN.x1]){
    seg(g, sx*W, PLAN.wallY*H, sx*W, 0.452*H, params.boundaryLW, INK);
    seg(g, sx*W, 0.506*H,      sx*W, PLAN.nearY*H, params.boundaryLW, INK);
  }
  // near edge: broken, with the archer's channel left open through it
  const e=[[0.082,0.268],[0.300,0.470],[0.570,0.740],[0.772,0.918]];
  for(const [a,b] of e) seg(g, a*W, PLAN.nearY*H, b*W, PLAN.nearY*H, params.boundaryLW, INK);
}

/* ---------------- the door wall: runs, leaves, jambs, sill ---------------- */
function drawWall(pen,g,W,H){
  const y=PLAN.wallY*H, t=PLAN.wallT*H;
  const runs=[[PLAN.x0,PLAN.postern.x0],[PLAN.postern.x1,PLAN.door.x0],
              [PLAN.door.x1,PLAN.pier.x0],[PLAN.pier.x1,PLAN.x1]];
  for(const [a,b] of runs){
    pen.paint(()=>{ g.rect(a*W, y, (b-a)*W, t); }, toneSolid(inkLevel(params.wallLevel)), 5);
  }
  // the pier that breaks the long right-hand run
  pen.paint(()=>{ g.rect(PLAN.pier.x0*W, y-0.008*H, (PLAN.pier.x1-PLAN.pier.x0)*W, t+0.016*H); },
            toneSolid(inkLevel(4)), 5);

  // the great doors, shut: two leaves standing outside the wall line
  const lo=PLAN.door.x0, hi=PLAN.door.x1, mid=(lo+hi)/2, ly=y-0.034*H;
  for(const [a,b] of [[lo,mid],[mid,hi]]){
    pen.paint(()=>{ g.rect(a*W, ly, (b-a)*W, 0.034*H); },
              toneSolid(inkLevel(params.leafLevel)), 5);
  }
  seg(g, mid*W, ly-0.006*H, mid*W, y+0.004*H, 7, INK);           // centre stile
  // the two jambs, projecting into the hall
  for(const jx of [lo-PLAN.jambW, hi]){
    pen.paint(()=>{ g.rect(jx*W, y, PLAN.jambW*W, (PLAN.sillT+PLAN.wallT)*H); },
              toneSolid(inkLevel(params.jambLevel)), 5);
  }
  // the SILL — the block Odysseus shoots from
  pen.paint(()=>{ g.rect(lo*W, (PLAN.wallY+PLAN.wallT)*H, (hi-lo)*W, PLAN.sillT*H); },
            toneSolid(inkLevel(params.sillLevel)), 6);
  for(let i=1;i<4;i++){
    const jx=lerp(lo,hi,i/4)*W;
    seg(g, jx, (PLAN.wallY+PLAN.wallT+0.006)*H, jx, (PLAN.wallY+PLAN.wallT+PLAN.sillT-0.006)*H, 4, INK);
  }
}

/* ---------------- the postern lane, the bolt, the storeroom ---------------- */
function drawPostern(pen,g,W,H,bar){
  const a=PLAN.postern.x0*W, b=PLAN.postern.x1*W;
  const yTop=PLAN.laneTop*H, yBot=(PLAN.wallY+PLAN.wallT)*H;
  // lane cheeks
  seg(g, a, yTop, a, yBot, 5.5, INK);
  seg(g, b, yTop, b, yBot, 5.5, INK);

  // the storeroom, up the lane: a light box with a broken rack in it
  const S=PLAN.store;
  pen.paint(()=>{ g.rect(S.x0*W, S.y0*H, (S.x1-S.x0)*W, (S.y1-S.y0)*H); },
            toneSolid(inkLevel(params.storeLevel)), 5.5);
  const rackY=(S.y0+0.026)*H;
  for(let i=0;i<3;i++){
    const cx=(S.x0+0.030+i*0.048)*W;
    g.save(); g.strokeStyle=INK; g.lineWidth=4.5;
    g.beginPath(); g.arc(cx, rackY, 0.016*W, 0, 7); g.stroke(); g.restore();
  }
  for(let i=0;i<5;i++){
    const cx=(S.x0+0.024+i*0.030)*W;
    seg(g, cx, (S.y1-0.030)*H, cx, (S.y1-0.008)*H, 4.5, INK);
  }

  // the BOLT across the lane
  const by=0.216*H, keep=0.010*W;
  if (bar==="open"){
    // swung aside, laid along the left cheek — and the leak running up the lane
    pen.paint(()=>{ g.rect(a-0.016*W, yBot-0.048*H, 0.013*W, 0.044*H); },
              toneSolid(inkLevel(params.boltLevel)), 4);
    const cx=(a+b)/2;
    seg(g, cx, yBot-0.006*H, cx, yTop+0.020*H, 5, INK, [12,9]);
    head(g, cx, yTop+0.018*H, 0, -1, 9);
  } else {
    const n = bar==="double" ? 2 : 1;
    for(let k=0;k<n;k++){
      const yy=by + k*0.021*H;
      pen.paint(()=>{ g.rect(a-keep, yy, (b-a)+keep*2, 0.012*H); },
                toneSolid(inkLevel(params.boltLevel)), 4);
    }
    for(const kx of [a-keep, b+keep]) seg(g, kx, by-0.010*H, kx, by+0.034*H, 5, INK);
  }
}

/* ---------------- the commanded arc: the second light plane ---------------- */
function drawCover(pen,g,W,H){
  const lo=PLAN.door.x0*W, hi=PLAN.door.x1*W;
  const yA=(PLAN.wallY+PLAN.wallT+PLAN.sillT)*H, yB=PLAN.nearY*H;
  const fl=0.126*W, fr=0.892*W;
  pen.fillPath(()=>{ g.moveTo(lo,yA); g.lineTo(hi,yA); g.lineTo(fr,yB); g.lineTo(fl,yB); g.closePath(); },
               inkLevel(params.coverLevel));
  // only the two flank rays are ruled — never the near edge, which would lay a
  // full-width bar across the frame
  seg(g, lo, yA, fl, yB, 5, INK);
  seg(g, hi, yA, fr, yB, 5, INK);
}

/* ---------------- one station: plate, shield band, spear ---------------- */
function drawStation(pen,g,W,H,i,mode){
  const cx=LINE.x[i]*W, cy=LINE.y[i]*H;
  const down=Math.PI/2, a0=down-LINE.shieldArc, a1=down+LINE.shieldArc;

  // the shield, standing in front of the bearer
  pen.paint(()=>{ shieldBand(g,cx,cy,LINE.shieldOut*W,LINE.shieldIn*W,a0,a1); },
            toneSolid(inkLevel(params.shieldLevel)), 4.5);

  // the spear vector, out through the shield line
  const reach=LINE.spear[i]*H*(mode==="spears"?1.34:1);
  const sy0=cy+LINE.plateR*W*0.4, sy1=cy+reach;
  const hs=mode==="spears"?15:12;
  seg(g,cx,sy0,cx,sy1-hs*2.4, mode==="spears"?7:5.5, INK);   // shaft stops short
  head(g,cx,sy1-hs*1.7,0,1,hs);                              // so the head reads

  // the standing plate: paper punched through the commanded plane, so the
  // station number sits on clean ground and survives the dot lattice
  pen.paint(()=>{ g.arc(cx,cy,LINE.plateR*W,0,7); }, toneSolid(inkLevel(0)), 7);
  const h=LINE.numH*H;
  segCentre(g, String(i+1), cx, cy-h/2, h, LINE.numLW);
  // heel ticks — the placement anchor, read from behind
  for(const k of [-1,1]) seg(g, cx+k*LINE.plateR*W*1.18, cy-0.004*H,
                                cx+k*LINE.plateR*W*1.62, cy-0.004*H, 4.5, INK);
}

/* ---------------- the archer's channel down the spine ---------------- */
function drawArcherLane(g,W,H,mode){
  const x=LANEX*W, yA=(PLAN.wallY+PLAN.wallT+PLAN.sillT+0.008)*H, yB=(PLAN.nearY-0.014)*H;
  seg(g,x,yA,x,yB, 4.5, INK, [14,11]);
  if (mode==="spears"){          // arrows out — the channel struck through
    const my=(yA+yB)/2;
    seg(g, x-0.024*W, my-0.016*H, x+0.024*W, my+0.016*H, 6, INK);
    seg(g, x-0.024*W, my+0.016*H, x+0.024*W, my-0.016*H, 6, INK);
  } else {
    head(g,x,yB,0,1,10);
  }
}

/* ---------------- the pressure from the hall ---------------- */
function drawThreat(g,W,H){
  const y=0.606*H;
  for(const x of [0.176,0.246,0.316, 0.664,0.734,0.804]){
    seg(g, x*W, y+0.046*H, x*W, y+0.026*H, 5, INK);
    head(g, x*W, y+0.010*H, 0, -1, 13);
  }
}

/* ---------------- SILL SECTION inset: four shields cover one door --------- */
function drawSection(pen,g,W,H,manned){
  const B=SECTION, floorY=0.866*H;
  const lo=0.152*W, hi=0.336*W;
  // broken floor line
  seg(g, 0.072*W, floorY, 0.132*W, floorY, 5, INK);
  seg(g, 0.356*W, floorY, 0.414*W, floorY, 5, INK);
  // sill block
  pen.paint(()=>{ g.rect(lo, floorY-0.030*H, hi-lo, 0.030*H); },
            toneSolid(inkLevel(params.sillLevel)), 5);
  for(let i=1;i<4;i++){ const jx=lerp(lo,hi,i/4); seg(g,jx,floorY-0.026*H,jx,floorY-0.006*H,3.5,INK); }
  // jambs + lintel
  for(const jx of [lo-0.028*W, hi]){
    pen.paint(()=>{ g.rect(jx, 0.726*H, 0.028*W, floorY-0.030*H-0.726*H); },
              toneSolid(inkLevel(params.wallLevel)), 5);
  }
  pen.paint(()=>{ g.rect(lo-0.040*W, 0.700*H, (hi-lo)+0.080*W, 0.026*H); },
            toneSolid(inkLevel(params.sillLevel)), 5);

  if (manned){
    // four shields standing edge to edge across the opening — the proof
    const w=(hi-lo)/4, gap=0.011*W;
    for(let i=0;i<4;i++){
      const x=lo+i*w;
      pen.paint(()=>{ g.rect(x+gap/2, 0.780*H, w-gap, 0.046*H); },
                toneSolid(inkLevel(3)), 4.5);
      seg(g, x+gap/2+3, 0.803*H, x+w-gap/2-3, 0.803*H, 3.5, INK);   // boss band
      // helmet dome above each shield
      g.save(); g.strokeStyle=INK; g.lineWidth=4.5;
      g.beginPath(); g.arc(x+w/2, 0.772*H, w*0.28, Math.PI, 0); g.stroke(); g.restore();
    }
  }
  // standing datum: a height bracket, never a figure
  const dx=0.096*W;
  seg(g, dx, 0.756*H, dx, floorY, 4.5, INK);
  seg(g, dx, 0.756*H, dx+0.020*W, 0.756*H, 4.5, INK);
  seg(g, dx, floorY,  dx+0.020*W, floorY, 4.5, INK);
  // depth-layer ticks: sill / shield / lintel plane, stated as lengths
  for(const [yy,len] of [[0.712,0.020],[0.812,0.032],[0.852,0.044]])
    seg(g, 0.392*W, yy*H, (0.392+len)*W, yy*H, 4.5, INK);
  brackets(g,W,H,B,0.034,4);
}

/* ---------------- ARMS ISSUE inset: what comes out of the store ----------- */
function drawIssue(pen,g,W,H,lit){
  const B=ISSUE, h=0.046*H;
  const rows=[0.712,0.782,0.852];
  KIT.forEach((k,r)=>{
    const y=rows[r]*H;
    segNumber(g, String(k.n), B.x0*W+0.022*W, y-h*0.5, h, 8);
    const x0=0.596*W, pitch=(k.glyph==="tick") ? 0.038*W : 0.062*W;
    for(let i=0;i<k.n;i++){
      const cx=x0+i*pitch;
      if (k.glyph==="disc"){
        pen.paint(()=>{ g.arc(cx, y, 0.021*W, 0, 7); },
                  toneSolid(inkLevel(lit?3:1)), 5);
        seg(g, cx-0.013*W, y, cx+0.013*W, y, 4, INK);
      } else if (k.glyph==="dome"){
        g.save(); g.strokeStyle=INK; g.lineWidth=5;
        g.beginPath(); g.arc(cx, y+0.010*H, 0.019*W, Math.PI, 0); g.stroke();
        g.beginPath(); g.moveTo(cx-0.019*W, y+0.010*H); g.lineTo(cx+0.019*W, y+0.010*H); g.stroke();
        g.restore();
      } else {
        seg(g, cx, y-0.020*H, cx, y+0.020*H, 5, INK);
        seg(g, cx-0.006*W, y-0.014*H, cx, y-0.026*H, 4, INK);
        seg(g, cx+0.006*W, y-0.014*H, cx, y-0.026*H, 4, INK);
      }
    }
  });
  brackets(g,W,H,B,0.034,4);
}

/* ---------------- the set piece ---------------- */
function drawFormation(ctx,W,H,st){
  const pen=makePen(ctx,{ outline:true });
  const g=ctx;
  const layers=st.layers||["floor","cover","wall","postern","line","lane","threat","section","issue"];
  const has=l=>layers.includes(l);
  const bar=st.bar||"barred";          // barred | open | double
  const mode=st.mode||"arrows";        // arrows | spears

  if (has("floor"))   drawFloor(pen,g,W,H);
  if (has("cover"))   drawCover(pen,g,W,H);
  if (has("wall"))    drawWall(pen,g,W,H);
  if (has("postern")) drawPostern(pen,g,W,H,bar);
  if (has("threat"))  drawThreat(g,W,H);
  if (has("lane"))    drawArcherLane(g,W,H,mode);
  if (has("line"))    for(let i=0;i<4;i++) drawStation(pen,g,W,H,i,mode);
  if (has("section")) drawSection(pen,g,W,H,has("line"));
  if (has("issue"))   drawIssue(pen,g,W,H,has("line"));
}

/* ---------------- anchors, computed off the plan ---------------- */
const ANCHORS = {};
LINE.who.forEach((who,i)=>{
  const id=String(i+1).padStart(2,"0");
  ANCHORS[`post:${id}`]   = { x:LINE.x[i], y:LINE.y[i] };
  ANCHORS[`shield:${id}`] = { x:LINE.x[i], y:LINE.y[i] + LINE.shieldOut*0.86 };
  ANCHORS[`stand:${who}`] = { x:LINE.x[i], y:LINE.y[i] };
});
ANCHORS["door:main"]      = { x:(PLAN.door.x0+PLAN.door.x1)/2, y:PLAN.wallY };
ANCHORS["sill:centre"]    = { x:(PLAN.door.x0+PLAN.door.x1)/2, y:PLAN.wallY+PLAN.wallT+PLAN.sillT/2 };
ANCHORS["jamb:left"]      = { x:PLAN.door.x0-PLAN.jambW/2, y:PLAN.wallY+PLAN.sillT/2 };
ANCHORS["jamb:right"]     = { x:PLAN.door.x1+PLAN.jambW/2, y:PLAN.wallY+PLAN.sillT/2 };
ANCHORS["postern:gap"]    = { x:(PLAN.postern.x0+PLAN.postern.x1)/2, y:PLAN.wallY };
ANCHORS["postern:bolt"]   = { x:(PLAN.postern.x0+PLAN.postern.x1)/2, y:0.222 };
ANCHORS["storeroom:issue"]= { x:(PLAN.store.x0+PLAN.store.x1)/2, y:(PLAN.store.y0+PLAN.store.y1)/2 };
ANCHORS["lane:archer"]    = { x:LANEX, y:PLAN.wallY+PLAN.wallT+PLAN.sillT+0.010 };
ANCHORS["lane:mark"]      = { x:LANEX, y:PLAN.nearY-0.014 };
ANCHORS["pier:right"]     = { x:(PLAN.pier.x0+PLAN.pier.x1)/2, y:PLAN.wallY+PLAN.wallT/2 };
ANCHORS["section:sill"]   = { x:0.244, y:0.851 };
ANCHORS["issue:table"]    = { x:(ISSUE.x0+ISSUE.x1)/2, y:(ISSUE.y0+ISSUE.y1)/2 };
ANCHORS["camera:plan"]    = { x:0.500, y:0.430 };

export const asset = {
  id:"set_piece.battle-threshold-formation",
  type:"SET_PIECE",
  name:"Battle threshold formation",
  statusWord:"HELD",
  scene:"OD-B22-S03",

  params,
  layers:["floor","cover","wall","postern","line","lane","threat","section","issue"],
  anchors:ANCHORS,

  /* collision boundaries / footprints (normalized boxes) */
  zones:{
    plan:      { x0:PLAN.x0, y0:PLAN.wallY, x1:PLAN.x1, y1:PLAN.nearY },
    doorway:   { x0:PLAN.door.x0, y0:PLAN.wallY-0.034, x1:PLAN.door.x1, y1:PLAN.wallY+PLAN.wallT },
    sill:      { x0:PLAN.door.x0, y0:PLAN.wallY+PLAN.wallT,
                 x1:PLAN.door.x1, y1:PLAN.wallY+PLAN.wallT+PLAN.sillT },
    line:      { x0:0.288, y0:0.352, x1:0.752, y1:0.442 },
    cover:     { x0:0.126, y0:0.309, x1:0.892, y1:PLAN.nearY },
    postern:   { x0:PLAN.postern.x0, y0:PLAN.laneTop, x1:PLAN.postern.x1, y1:PLAN.wallY+PLAN.wallT },
    storeroom: { x0:PLAN.store.x0, y0:PLAN.store.y0, x1:PLAN.store.x1, y1:PLAN.store.y1 },
    archerLane:{ x0:LANEX-0.024, y0:0.310, x1:LANEX+0.024, y1:PLAN.nearY },
    threat:    { x0:0.160, y0:0.596, x1:0.820, y1:0.640 },
    section:   { x0:SECTION.x0, y0:SECTION.y0, x1:SECTION.x1, y1:SECTION.y1 },
    issue:     { x0:ISSUE.x0,   y0:ISSUE.y0,   x1:ISSUE.x1,   y1:ISSUE.y1 },
  },
  /* architecture at the far end of the hall: figures stand on it and in front
     of it, the suitor mass reads nearer to camera */
  depth:"midground",

  states:{
    initial:"open",
    nodes:{
      // the doorway unheld: wall, doors, postern barred, nobody on the sill
      open:{ preview:{ layers:["floor","wall","postern","section","issue"],
                       bar:"barred", status:"OPEN", progress:.12 } },
      // the four stand the line; the store is being emptied into it
      formed:{ preview:{ layers:["floor","cover","wall","postern","line","lane","threat","section","issue"],
                         bar:"barred", mode:"arrows", status:"HELD", progress:.46 } },
      // Telemachus left the postern unbarred after one trip — the leak
      unbarred:{ preview:{ layers:["floor","cover","wall","postern","line","lane","threat","section","issue"],
                           bar:"open", mode:"arrows", status:"UNBARRED", progress:.63 } },
      // arrows spent: the archer's channel struck, spears run out
      spears:{ preview:{ layers:["floor","cover","wall","postern","line","lane","threat","section","issue"],
                         bar:"open", mode:"spears", status:"SPEARS", progress:.84 } },
      // the lane double-barred behind Melanthius; the line still stands
      sealed:{ preview:{ layers:["floor","cover","wall","postern","line","lane","threat","section","issue"],
                         bar:"double", mode:"spears", status:"SEALED", progress:1 } },
    },
    edges:[["open","formed"],["formed","unbarred"],["unbarred","spears"],
           ["spears","sealed"],["sealed","spears"],["formed","spears"],["formed","open"]],
  },
  channels:["formation","bar-state","coverage","supply","weapon-mode","depth"],

  preview:()=>({
    layers:["floor","cover","wall","postern","line","lane","threat","section","issue"],
    bar:"barred", mode:"arrows", status:"HELD", progress:.46,
  }),
  draw(ctx,W,H,state){ drawFormation(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
