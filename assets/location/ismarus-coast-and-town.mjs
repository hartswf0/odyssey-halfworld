/* location.ismarus-coast-and-town — the raided Ciconian settlement of Ismarus.
   LOCATION asset (OD-B09-S02). An EMPTY navigable set drawn as a receding inland
   view seen from the water: a beached SHIP-LINE and open sea in the foreground, a
   dry beach, a middle-ground raiders' CAMP of tents, a trampled BATTLEFIELD strip,
   a walled TOWN on an inland ridge (smoking, sacked), and a marked RETREAT ROUTE
   winding from the town gate down through the field and camp to the ships.
   Drawn in SOLID grays + hard contour into the offscreen ctx — the engine dotify
   pass supplies the halftone. No characters are baked in; only placement / camera
   anchors and walkable zones.
   Atlas: OD-B09-S02 — raided settlement, beach camp, ship line, inland approach, battle field, retreat route. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const params = {
  ridge:0.34,        // inland horizon / town base as fraction of H
  fieldBot:0.47,     // bottom of the battlefield strip
  campBot:0.62,      // bottom of the camp band
  beachBot:0.86,     // where dry beach meets the water
  towers:2,          // flanking gate towers
  tents:6,           // raiders' camp tents
  ships:5,           // beached hulls along the shore
  smokePlumes:3,     // sack-smoke rising from the town
  seed:9092,
};

/* deterministic pseudo-random, re-seeded each draw so scatter is stable */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const R = rnd(params.seed);
  const ridge = H*params.ridge;
  const layers = st.layers || ["sky","town","smoke","battlefield","camp","beach","sea","ships","retreat","anchors"];
  const has = l => layers.includes(l);

  // ================= SKY (lightest -> sparse dots) =================
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,ridge);
    // low cloud banks
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.18+i*0.32), ridge*(0.30+0.14*(i%2)), W*0.12, H*0.020, 0,0,7); g.fill(); }
  }

  // ================= TOWN on the inland ridge (background) =================
  if (has("town")){
    // the ridge the town sits on (mid tone ground)
    pen.paint(()=>{
      g.moveTo(0, ridge);
      g.quadraticCurveTo(W*0.5, ridge-H*0.03, W, ridge);
      g.lineTo(W, ridge+H*0.05); g.lineTo(0, ridge+H*0.05); g.closePath();
    }, toneSolid(inkLevel(3)), 4);

    const wallY = ridge - H*0.115, wallH = H*0.115;
    const wx0 = W*0.22, wx1 = W*0.78, wallW = wx1-wx0;

    // rooftops peeking behind the wall (raided town interior)
    g.fillStyle = inkLevel(4); g.strokeStyle=INK; g.lineWidth=2;
    for(let i=0;i<5;i++){
      const rx = lerp(wx0+W*0.04, wx1-W*0.04, i/4);
      const rw = W*0.055, rh = H*0.05*(0.7+0.5*R());
      g.beginPath();
      g.moveTo(rx-rw*0.5, wallY); g.lineTo(rx, wallY-rh); g.lineTo(rx+rw*0.5, wallY); g.closePath();
      g.fill(); g.stroke();
    }

    // the town wall (main enclosure)
    pen.paint(()=>{ g.rect(wx0, wallY, wallW, wallH); }, toneSolid(inkLevel(4)), 5);
    // crenellations along the top
    g.fillStyle=inkLevel(5); g.strokeStyle=INK; g.lineWidth=2;
    const merlons = 11;
    for(let i=0;i<merlons;i++){
      if(i%2) continue;
      const mx = wx0 + wallW*(i/merlons);
      g.beginPath(); g.rect(mx, wallY-H*0.018, wallW/merlons, H*0.018); g.fill(); g.stroke();
    }

    // flanking gate towers
    const towerXs = [wx0+wallW*0.16, wx0+wallW*0.84].slice(0,params.towers);
    for(const tx of towerXs){
      const tw = W*0.055, th = H*0.045;
      pen.paint(()=>{ g.rect(tx-tw/2, wallY-th, tw, wallH+th); }, toneSolid(inkLevel(5)), 4);
      pen.paint(()=>{ g.rect(tx-tw*0.62, wallY-th, tw*1.24, H*0.016); }, toneSolid(inkLevel(6)), 3);
    }

    // the gate (dark arch) at the wall centre
    const gtx = W*0.5, gtw = W*0.075, gth = wallH*0.72;
    pen.paint(()=>{
      g.moveTo(gtx-gtw/2, ridge);
      g.lineTo(gtx-gtw/2, wallY+wallH-gth+gtw*0.5);
      g.quadraticCurveTo(gtx, wallY+wallH-gth-gtw*0.2, gtx+gtw/2, wallY+wallH-gth+gtw*0.5);
      g.lineTo(gtx+gtw/2, ridge); g.closePath();
    }, toneSolid(inkLevel(7)), 4);
  }

  // ================= SMOKE of the sack rising from the town =================
  if (has("smoke")){
    const wallY = ridge - H*0.115;
    for(let i=0;i<params.smokePlumes;i++){
      const bx = lerp(W*0.30, W*0.70, (i+0.5)/params.smokePlumes);
      const by = wallY - H*0.01;
      // light plume body
      pen.paint(()=>{
        g.moveTo(bx-W*0.02, by);
        g.quadraticCurveTo(bx-W*0.06, by-H*0.06, bx-W*0.015, by-H*0.11);
        g.quadraticCurveTo(bx-W*0.05, by-H*0.16, bx+W*0.01, by-H*0.20);
        g.quadraticCurveTo(bx+W*0.06, by-H*0.15, bx+W*0.03, by-H*0.10);
        g.quadraticCurveTo(bx+W*0.055, by-H*0.05, bx+W*0.02, by);
        g.closePath();
      }, toneSolid(inkLevel(2)), 3);
      // a couple of curling contour lines inside
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
      g.beginPath(); g.moveTo(bx, by-H*0.02);
      g.quadraticCurveTo(bx-W*0.03, by-H*0.09, bx+W*0.005, by-H*0.15); g.stroke();
      g.globalAlpha=1;
    }
  }

  // ================= BATTLEFIELD strip between town and camp =================
  if (has("battlefield")){
    const top = ridge+H*0.02, bot = H*params.fieldBot;
    // trampled ground band
    pen.paint(()=>{ g.rect(0, top, W, bot-top); }, toneSolid(inkLevel(3)), 0);
    // upper edge contour
    pen.ink(()=>{ g.moveTo(0,top); g.lineTo(W,top); }, 3);
    // scattered debris of the fight: fallen spears, round shields, scuffs
    const midY = (top+bot)/2;
    for(let i=0;i<10;i++){
      const x = lerp(W*0.08, W*0.92, R());
      const y = lerp(top+H*0.01, bot-H*0.01, R());
      const kind = i%3;
      if (kind===0){ // fallen spear (long diagonal shaft + head)
        const a = (R()-0.5)*1.6, len = W*0.09;
        g.strokeStyle=INK; g.lineWidth=2.5; g.lineCap="round";
        g.beginPath(); g.moveTo(x-Math.cos(a)*len/2, y-Math.sin(a)*len/2);
        g.lineTo(x+Math.cos(a)*len/2, y+Math.sin(a)*len/2); g.stroke();
        g.fillStyle=inkLevel(6); g.beginPath();
        g.arc(x+Math.cos(a)*len/2, y+Math.sin(a)*len/2, W*0.008,0,7); g.fill();
      } else if (kind===1){ // round shield (halftone disc + boss)
        pen.paint(()=>{ g.arc(x,y,W*0.028,0,7); }, toneSolid(inkLevel(4)), 3);
        g.fillStyle=inkLevel(6); g.beginPath(); g.arc(x,y,W*0.009,0,7); g.fill();
      } else { // dark scuff patch
        g.fillStyle=inkLevel(5); g.globalAlpha=0.7;
        g.beginPath(); g.ellipse(x,y,W*0.03,H*0.010,0,0,7); g.fill(); g.globalAlpha=1;
      }
    }
  }

  // ================= CAMP of tents (middle ground) =================
  if (has("camp")){
    const top = H*params.fieldBot, bot = H*params.campBot;
    // camp ground faintly set apart
    g.fillStyle=inkLevel(2); g.fillRect(0, top, W, bot-top);
    // a row of ridge tents, foreground ones larger
    for(let i=0;i<params.tents;i++){
      const t = (i+0.5)/params.tents;
      const cx = lerp(W*0.10, W*0.90, t) + (R()-0.5)*W*0.03;
      const depth = 0.55 + 0.45*Math.abs(Math.sin(i*1.7));  // vary size
      const tw = W*0.075*depth*2, th = H*0.075*depth*1.6;
      const cy = lerp(top+H*0.02, bot-H*0.005, R());
      // near (lit) face
      pen.paint(()=>{
        g.moveTo(cx-tw/2, cy); g.lineTo(cx, cy-th); g.lineTo(cx+tw*0.12, cy); g.closePath();
      }, toneSolid(inkLevel(4)), 4);
      // far (shaded) face
      pen.paint(()=>{
        g.moveTo(cx+tw*0.12, cy); g.lineTo(cx, cy-th); g.lineTo(cx+tw/2, cy); g.closePath();
      }, toneSolid(inkLevel(6)), 4);
      // ridge pole + guy line
      g.strokeStyle=INK; g.lineWidth=2;
      g.beginPath(); g.moveTo(cx, cy-th); g.lineTo(cx+tw*0.42, cy+H*0.006); g.stroke();
    }
    // a campfire ring on the near side
    const fx=W*0.62, fy=bot-H*0.01;
    g.strokeStyle=INK; g.lineWidth=2;
    g.beginPath(); g.ellipse(fx,fy,W*0.03,H*0.012,0,0,7); g.stroke();
    pen.paint(()=>{ g.moveTo(fx-W*0.012,fy); g.quadraticCurveTo(fx,fy-H*0.05,fx+W*0.012,fy); g.closePath(); },
              toneSolid(inkLevel(6)), 3);
  }

  // ================= BEACH (dry sand, foreground) =================
  if (has("beach")){
    const top = H*params.campBot, bot = H*params.beachBot;
    pen.paint(()=>{ g.rect(0, top, W, bot-top); }, toneSolid(inkLevel(2)), 0);
    // faint drift lines in the sand
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.25;
    for(let j=1;j<=3;j++){
      const y = lerp(top+H*0.02, bot-H*0.02, j/4);
      g.beginPath();
      for(let s=0;s<=20;s++){ const x=W*s/20, yy=y+Math.sin(s*0.7+j)*H*0.006; s?g.lineTo(x,yy):g.moveTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ================= SEA at the very foreground (waterline) =================
  if (has("sea")){
    const top = H*params.beachBot;
    pen.paint(()=>{ g.rect(0, top, W, H-top); }, toneSolid(inkLevel(3)), 0);
    // a darker near band gives the water depth
    g.fillStyle=inkLevel(4); g.fillRect(0, H-H*0.05, W, H*0.05);
    // waterline contour + swell lines
    pen.ink(()=>{ g.moveTo(0,top); g.lineTo(W,top); }, 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    for(let j=1;j<=3;j++){
      const y = lerp(top+H*0.02, H-H*0.02, j/4);
      g.beginPath();
      for(let s=0;s<=20;s++){ const x=W*s/20, yy=y+Math.sin(s*0.9+j)*H*0.006; s?g.lineTo(x,yy):g.moveTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ================= SHIP-LINE: beached hulls drawn up on the shore =================
  if (has("ships")){
    const by = H*(params.beachBot-0.03);   // hulls sit on the sand at the waterline
    for(let i=0;i<params.ships;i++){
      const t = (i+0.5)/params.ships;
      const flag = Math.abs(t-0.5) < 0.11;          // centre hull = flagship, larger
      const cx = lerp(W*0.13, W*0.87, t);
      const bw = W*(flag?0.098:0.072), bh = H*(flag?0.05:0.04);
      // keel groove scored into the sand behind each hull
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
      g.beginPath(); g.moveTo(cx, by-bh*0.2); g.lineTo(cx, by-H*0.045); g.stroke();
      g.globalAlpha=1;
      // hull (dark boat silhouette, high prow/stern)
      pen.paint(()=>{
        g.moveTo(cx-bw, by-bh*0.2);
        g.quadraticCurveTo(cx-bw*0.4, by+bh, cx+bw, by-bh*0.2);   // underside
        g.quadraticCurveTo(cx+bw*0.55, by-bh*0.7, cx-bw, by-bh*0.2); // gunwale
        g.closePath();
      }, toneSolid(inkLevel(flag?7:6)), 5);
      // upturned prow tip
      g.fillStyle=inkLevel(7); g.strokeStyle=INK; g.lineWidth=2;
      g.beginPath(); g.arc(cx-bw, by-bh*0.2, W*0.008,0,7); g.fill(); g.stroke();
      // mast + furled sail block
      pen.ink(()=>{ g.moveTo(cx, by-bh*0.2); g.lineTo(cx, by-H*(flag?0.10:0.08)); }, 3);
      pen.paint(()=>{ g.rect(cx-W*0.007, by-H*(flag?0.10:0.08), W*0.014, H*0.04); }, toneSolid(inkLevel(4)), 2);
    }
  }

  // ================= RETREAT ROUTE: gate -> field -> camp -> ships =================
  if (has("retreat")){
    const x0 = W*0.50, y0 = ridge;                         // town gate (top)
    const x1 = W*0.38, y1 = H*(params.fieldBot+0.02);      // through the field
    const x2 = W*0.58, y2 = H*(params.campBot+0.02);       // past the camp
    const x3 = W*0.50, y3 = H*(params.beachBot-0.10);      // down to the beach landing (above the hulls)
    const path = (off)=>{
      g.beginPath(); g.moveTo(x0+off, y0);
      g.bezierCurveTo(x1+off, y1, x2+off, y2, x3+off, y3);
    };
    // ribbon between two ink edges
    g.strokeStyle=INK; g.lineWidth=2.5; g.globalAlpha=0.8;
    path(-W*0.028); g.stroke(); path(W*0.028); g.stroke();
    g.globalAlpha=1;
    // light track down the middle
    g.strokeStyle=inkLevel(1); g.lineWidth=W*0.034; g.lineCap="round";
    path(0); g.stroke(); g.lineCap="butt";
    // direction chevrons pointing seaward (down the route)
    g.strokeStyle=INK; g.lineWidth=2.5; g.lineCap="round";
    for(const ty of [0.34, 0.60, 0.84]){
      // sample a point along the bezier at parameter ty
      const u=1-ty;
      const px = u*u*u*x0 + 3*u*u*ty*x1 + 3*u*ty*ty*x2 + ty*ty*ty*x3;
      const py = u*u*u*y0 + 3*u*u*ty*y1 + 3*u*ty*ty*y2 + ty*ty*ty*y3;
      g.beginPath();
      g.moveTo(px-W*0.014, py-H*0.010); g.lineTo(px, py+H*0.005); g.lineTo(px+W*0.014, py-H*0.010);
      g.stroke();
    }
    g.lineCap="butt";
  }
}

export const asset = {
  id:"location.ismarus-coast-and-town",
  type:"LOCATION",
  name:"Ismarus Coast and Town",
  statusWord:"SACKED",
  scene:"OD-B09-S02",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","town","smoke","battlefield","camp","beach","sea","ships","retreat","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "town:gate":{x:.50,y:.33},          // sacked town gate, head of the inland approach
    "town:wall":{x:.50,y:.25},
    "town:tower-l":{x:.32,y:.24}, "town:tower-r":{x:.68,y:.24},
    "field:battle":{x:.50,y:.41},        // centre of the trampled battlefield strip
    "camp:center":{x:.44,y:.55},         // raiders' beach camp
    "camp:fire":{x:.62,y:.60},
    "beach:landing":{x:.50,y:.72},       // open dry-beach mustering ground
    "ship:flagship":{x:.50,y:.80},       // centre hull, drawn up on the shore
    "ship:line-l":{x:.20,y:.80}, "ship:line-r":{x:.80,y:.80},
    "route:retreat":{x:.50,y:.58},       // mid-point of the retreat route
    "sea:edge":{x:.50,y:.93},            // waterline
    "entrance:sea":{x:.50,y:.98},        // arrive / embark from the water
    "exit:inland":{x:.60,y:.14},         // road on past the town, off the top
    "camera:wide":{x:.50,y:.50}, "camera:battle":{x:.50,y:.41}, "camera:ships":{x:.50,y:.80},
  },
  // walkable / interaction regions for scene placement + pathing
  zones:{
    shipLine:{ x0:.08,y0:.74,x1:.92,y1:.86 },
    beach:{    x0:.06,y0:.62,x1:.94,y1:.86 },
    camp:{     x0:.08,y0:.47,x1:.92,y1:.62 },
    field:{    x0:.04,y0:.36,x1:.96,y1:.47 },
    townGate:{ x0:.42,y0:.30,x1:.58,y1:.36 },
    sea:{      x0:.00,y0:.86,x1:1.0,y1:1.0 },
  },
  states:{
    initial:"raided",
    nodes:{
      raided:{  preview:{ layers:["sky","town","smoke","battlefield","camp","beach","sea","ships","retreat"] } },
      calm:{    preview:{ layers:["sky","town","beach","sea","ships"] } },          // before the sack
      battle:{  preview:{ layers:["sky","town","smoke","battlefield","beach","sea","ships"] } },
      retreat:{ preview:{ layers:["sky","town","smoke","battlefield","camp","beach","sea","ships","retreat"] } },
      empty:{   preview:{ layers:["sky","town","beach","sea"] } },                  // bare navigable set
    },
    edges:[["calm","battle"],["battle","raided"],["raided","retreat"],["retreat","empty"],["calm","raided"]],
  },
  channels:["reveal","camera","smoke","light"],

  preview:()=>({ layers:["sky","town","smoke","battlefield","camp","beach","sea","ships","retreat"], status:"SACKED", progress:.22 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
