/* location.island-of-syria-memory — a prosperous small island kingdom, half-remembered.
   LOCATION asset (memory-toned / faint). Eumaeus' recollected homeland: a royal
   house on a hill (bg), a small town stepping down to the water (mid), and a
   harbor with a moored trader ship (fg) — the abduction route runs down from the
   palace through the town to the shore where the traders lay in wait.
   Empty navigable set: no baked characters. Drawn in SOLID grays + hard contour;
   the engine dotify pass supplies the halftone. Tones kept low + a faint offset
   "echo" on the palace so the whole set reads slightly recollected.
   Atlas: OD-B15-S04 — prosperous small kingdom, royal house, harbor, trader ship, abduction route. */
import { makePen, toneSolid, inkLevel, INK, ACCENT } from "../../engine/halfworld-engine.mjs";

const params = {
  shoreLevel:0.64,     // waterline as fraction of H
  hillCrest:0.30,      // royal-house hill crest as fraction of H
  townRows:2,          // rows of stepped houses
  ship:true,           // moored trader ship in the harbor
  route:true,          // abduction route palace -> shore
  memory:true,         // faint recollected echo pass
};

/* ---- a faint offset "echo" of a filled shape: the recollected double-image ---- */
function echo(ctx, pathFn){
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.translate(-6, -4);
  ctx.fillStyle = inkLevel(1);
  ctx.beginPath(); pathFn(); ctx.fill();
  ctx.restore();
}

/* ---- a small pitched-roof house block ---- */
function house(pen, g, x, y, w, h, tone){
  pen.paint(()=>{ g.rect(x, y, w, h); }, toneSolid(tone), 3);            // wall
  pen.paint(()=>{                                                        // roof
    g.moveTo(x-w*0.12, y);
    g.lineTo(x+w*0.5,  y-h*0.62);
    g.lineTo(x+w*1.12, y);
    g.closePath();
  }, toneSolid(inkLevel(4)), 3);
  // door
  g.fillStyle = inkLevel(5);
  g.fillRect(x+w*0.38, y+h*0.42, w*0.24, h*0.58);
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const shore = H*params.shoreLevel;
  const crest = H*params.hillCrest;
  const layers = st.layers || ["sky","hill","royal-house","town","shore","water","jetty","ship","route"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest — few dots, recollected haze) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,shore);
  }

  // ---- HILL: bg land mound rising against the sky (low + light) ----
  if (has("hill")){
    if (params.memory) echo(ctx, ()=>{
      g.moveTo(W*0.00, shore);
      g.quadraticCurveTo(W*0.26, crest*1.16, W*0.48, crest*0.98);
      g.quadraticCurveTo(W*0.72, crest*1.22, W*1.00, shore);
      g.closePath();
    });
    pen.paint(()=>{
      g.moveTo(W*0.00, shore);
      g.quadraticCurveTo(W*0.26, crest*1.20, W*0.48, crest);
      g.quadraticCurveTo(W*0.72, crest*1.26, W*1.00, shore);
      g.closePath();
    }, toneSolid(inkLevel(2)), 3);
    // a couple of terrace contour lines up the hill (light)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
    for(let i=1;i<=2;i++){ const y=crest+ (shore-crest)*(i/3);
      g.beginPath(); g.moveTo(W*0.14, y); g.quadraticCurveTo(W*0.5, y-H*0.015, W*0.88, y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- ROYAL HOUSE on the crest (bg focal — small + high) ----
  if (has("royal-house")){
    const hx=W*0.48, hy=crest+2, hw=W*0.15, hh=H*0.075;
    if (params.memory) echo(ctx, ()=>{ g.rect(hx-hw/2-5, hy-hh, hw, hh); });
    // podium
    pen.paint(()=>{ g.rect(hx-hw*0.62, hy, hw*1.24, hh*0.18); }, toneSolid(inkLevel(3)), 3);
    // hall body
    pen.paint(()=>{ g.rect(hx-hw/2, hy-hh, hw, hh); }, toneSolid(inkLevel(3)), 3);
    // colonnade (faint verticals)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.7;
    for(let i=0;i<=4;i++){ const cx=hx-hw/2 + hw*(i/4);
      g.beginPath(); g.moveTo(cx, hy-hh*0.9); g.lineTo(cx, hy); g.stroke(); }
    g.globalAlpha=1;
    // pediment roof
    pen.paint(()=>{
      g.moveTo(hx-hw*0.60, hy-hh);
      g.lineTo(hx,          hy-hh*1.55);
      g.lineTo(hx+hw*0.60, hy-hh);
      g.closePath();
    }, toneSolid(inkLevel(4)), 3);
  }

  // ---- TOWN: stepped little houses (mid ground) ----
  if (has("town")){
    const bandTop = H*0.44, bandBot = shore - H*0.01;
    const rows = params.townRows;
    for(let r=0;r<rows;r++){
      const y = bandTop + (bandBot-bandTop)*((r+0.55)/rows);
      const n = 4 + r;                                   // more houses in front rows
      const hw = W*0.075*(1 - r*0.06);
      const hh = H*0.055*(1 + r*0.12);
      for(let i=0;i<n;i++){
        const x = W*(0.12 + (i+ (r%2)*0.5)*(0.76/n));
        house(pen, g, x, y, hw, hh, inkLevel(3 - (r===0?1:0)));
      }
    }
  }

  // ---- SHORE line + beach band ----
  if (has("shore")){
    pen.paint(()=>{ g.rect(0, shore, W, H*0.02); }, toneSolid(inkLevel(2)), 3);
    pen.ink(()=>{ g.moveTo(0, shore); g.lineTo(W, shore); }, 3);
  }

  // ---- HARBOR WATER (fg, light with a few wave rules) ----
  if (has("water")){
    g.fillStyle = inkLevel(2); g.fillRect(0, shore+H*0.02, W, H - (shore+H*0.02));
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
    for(let j=0;j<5;j++){ const y = shore + H*0.05 + j*(H*0.34/5);
      g.beginPath();
      for(let x=0;x<=W;x+=W/12){ const yy = y + Math.sin((x/W)*Math.PI*3 + j)*3;
        (x===0? g.moveTo(x,yy): g.lineTo(x,yy)); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- JETTY: dock reaching from shore into the harbor ----
  if (has("jetty")){
    const jx=W*0.10, jy=shore+H*0.015, jw=W*0.13, jl=H*0.13;
    pen.paint(()=>{ g.rect(jx, jy, jw, jl); }, toneSolid(inkLevel(4)), 3); // deck
    // plank seams + pilings
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
    for(let i=1;i<4;i++){ const y=jy+jl*(i/4); g.beginPath(); g.moveTo(jx,y); g.lineTo(jx+jw,y); g.stroke(); }
    g.globalAlpha=1;
    g.fillStyle=inkLevel(6);
    g.fillRect(jx+jw*0.05, jy+jl-4, jw*0.1, H*0.05);
    g.fillRect(jx+jw*0.85, jy+jl-4, jw*0.1, H*0.05);
  }

  // ---- TRADER SHIP moored in the harbor (fg focal — darkest) ----
  if (has("ship") && params.ship){
    const sx=W*0.62, sy=shore+H*0.235, sw=W*0.30, sh=H*0.058;
    // mast + yard + sail sit clear of the town (fully within the water band)
    // mast
    pen.ink(()=>{ g.moveTo(sx, sy-sh*0.1); g.lineTo(sx, sy-sh*4.0); }, 4);
    // yard + billowed sail (mid tone) — trader's square sail
    pen.ink(()=>{ g.moveTo(sx-sw*0.30, sy-sh*3.4); g.lineTo(sx+sw*0.30, sy-sh*3.4); }, 3);
    pen.paint(()=>{
      g.moveTo(sx-sw*0.28, sy-sh*3.3);
      g.quadraticCurveTo(sx, sy-sh*3.0, sx+sw*0.28, sy-sh*3.3);
      g.lineTo(sx+sw*0.24, sy-sh*1.2);
      g.quadraticCurveTo(sx, sy-sh*0.9, sx-sw*0.24, sy-sh*1.2);
      g.closePath();
    }, toneSolid(inkLevel(3)), 3);
    // rigging
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
    g.beginPath(); g.moveTo(sx, sy-sh*4.0); g.lineTo(sx-sw*0.44, sy-sh*0.2); g.moveTo(sx, sy-sh*4.0); g.lineTo(sx+sw*0.44, sy-sh*0.2); g.stroke();
    g.globalAlpha=1;
    // hull (crescent) — drawn last so it sits over the mast foot + waterline
    pen.paint(()=>{
      g.moveTo(sx-sw/2, sy);
      g.quadraticCurveTo(sx-sw*0.34, sy+sh*1.6, sx, sy+sh*1.45);
      g.quadraticCurveTo(sx+sw*0.34, sy+sh*1.6, sx+sw/2, sy);
      g.lineTo(sx+sw*0.42, sy);
      g.quadraticCurveTo(sx, sy+sh*0.7, sx-sw*0.42, sy);
      g.closePath();
    }, toneSolid(inkLevel(5)), 4);
    // prow post
    pen.ink(()=>{ g.moveTo(sx-sw*0.48, sy); g.lineTo(sx-sw*0.58, sy-sh*1.0); }, 4);
  }

  // ---- ABDUCTION ROUTE: dotted marked path palace -> town -> shore/jetty ----
  if (has("route") && params.route){
    const pts = [
      { x:W*0.46, y:crest+H*0.06 }, // leaving the royal house
      { x:W*0.36, y:H*0.44 },       // down the hill
      { x:W*0.26, y:H*0.55 },       // through the town
      { x:W*0.18, y:shore-H*0.01 }, // to the shore
      { x:W*0.16, y:shore+H*0.05 }, // onto the jetty head
    ];
    // dashed ink path (dark enough to survive the halftone)
    g.strokeStyle=INK; g.lineWidth=5; g.lineCap="round"; g.setLineDash([13,9]); g.globalAlpha=1;
    g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
    for(let i=1;i<pts.length;i++) g.lineTo(pts[i].x, pts[i].y);
    g.stroke(); g.setLineDash([]);
    // waypoint marks (blue accent = the diegetic route markers)
    for(const p of pts){ g.fillStyle=ACCENT; g.beginPath(); g.arc(p.x,p.y,6,0,7); g.fill();
      g.fillStyle="#ffffff"; g.beginPath(); g.arc(p.x,p.y,2.4,0,7); g.fill(); }
    // arrowhead at the shore end (direction of abduction: down to the ship)
    const a=pts[pts.length-2], b=pts[pts.length-1];
    const ang=Math.atan2(b.y-a.y, b.x-a.x);
    g.fillStyle=INK; g.beginPath();
    g.moveTo(b.x, b.y);
    g.lineTo(b.x-14*Math.cos(ang-0.4), b.y-14*Math.sin(ang-0.4));
    g.lineTo(b.x-14*Math.cos(ang+0.4), b.y-14*Math.sin(ang+0.4));
    g.closePath(); g.fill();
  }
}

export const asset = {
  id:"location.island-of-syria-memory",
  type:"LOCATION",
  name:"Island of Syria memory",
  statusWord:"REMEMBERED",
  scene:"OD-B15-S04",

  params,
  // back -> front draw order; scene state can pass a subset
  layers:["sky","hill","royal-house","town","shore","water","jetty","ship","route"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "bg:royal-house":{x:.50,y:.22},
    "mid:town":{x:.45,y:.52},
    "fg:harbor":{x:.55,y:.84},
    "route:palace":{x:.50,y:.26},
    "route:town":{x:.38,y:.55},
    "route:shore":{x:.34,y:.65},
    "dock:jetty":{x:.37,y:.72},
    "moor:trader-ship":{x:.66,y:.82},
    "entrance:hill-path":{x:.50,y:.24},
    "exit:sea":{x:.90,y:.92},
    "camera:wide":{x:.50,y:.50},
    "camera:harbor":{x:.55,y:.80},
    "camera:house":{x:.50,y:.28},
  },
  // navigable regions (for scene placement / pathing)
  zones:{
    walkable:{ x0:.08,y0:.44,x1:.92,y1:.66 },
    route:{ x0:.30,y0:.24,x1:.54,y1:.70 },
    water:{ x0:.00,y0:.68,x1:1.00,y1:1.00 },
  },
  states:{
    initial:"remembered",
    nodes:{
      remembered:{ preview:{ layers:["sky","hill","royal-house","town","shore","water","jetty","ship","route"] } },
      abduction:{ preview:{ layers:["sky","hill","royal-house","town","shore","water","jetty","ship","route"] } },
      // faint recollection — the town and route fade, only palace + harbor remain
      faint:{ preview:{ layers:["sky","hill","royal-house","shore","water","ship"] } },
    },
    edges:[["remembered","abduction"],["remembered","faint"],["abduction","faint"]],
  },
  channels:["reveal","camera","light","route"],

  preview:()=>({
    layers:["sky","hill","royal-house","town","shore","water","jetty","ship","route"],
    status:"REMEMBERED", progress:.16,
  }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
