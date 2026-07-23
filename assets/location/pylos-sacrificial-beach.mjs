/* location.pylos-sacrificial-beach — the broad Pylian strand where Nestor's
   people sacrifice bulls to Poseidon. LOCATION asset (OD-B03-S01). An EMPTY
   navigable set: sky over an open sea, a foaming waterline, a row of black
   ships drawn up in the moored-ship zone, then the broad shore divided into
   NINE crowd divisions by lines scored in the sand, an altar fire burning in
   each division, long feast rows of benches in the foreground, and Nestor's
   raised central place on the middle axis. Drawn in SOLID grays + hard contour
   into the offscreen ctx — the engine dotify pass supplies the halftone. No
   characters are baked in; only placement / camera anchors + walkable zones.
   Atlas: OD-B03-S01 — nine divisions, altar fires, moored ships, feast rows, Nestor's place. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.20,        // sea/sky line as fraction of H
  surfLevel:0.32,      // centre of the foaming waterline band
  divisions:9,         // the nine crowd divisions of the Pylian host
  ships:6,             // black ships drawn up in the moored-ship zone
  altarFires:true,     // an altar fire in each division
  feastRows:true,      // long benches for the feast, foreground
  nestorPlace:true,    // raised central place on the middle axis
};

/* perspective x of a division border: border fraction f (0..1 across the beach)
   is pulled toward centre as it recedes toward the sea (top). */
function bandX(f, t){ // t: 0 = foreground (bottom), 1 = sea edge (top)
  return lerp(f, lerp(0.5, f, 0.62), t);   // gentle convergence -> broad flat shore
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const surfY = H*params.surfLevel;
  const shipBaseY = surfY + H*0.03;      // where the drawn-up hulls sit
  const beachTop = surfY + H*0.06;       // top of the walkable shore
  const layers = st.layers || ["sky","sea","surf","ships","divisions","altars","feast","nestor","anchors"];
  const has = l => layers.includes(l);
  const n = params.divisions;

  // ---- SKY (lightest tone -> sparse dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.20+i*0.32), horizon*(0.44+0.12*(i%2)), W*0.12, H*0.020, 0,0,7); g.fill(); }
  }

  // ---- SEA (mid tone) from horizon down to the surf ----
  if (has("sea")){
    pen.paint(()=>{ g.rect(0,horizon,W,surfY-horizon); }, toneSolid(inkLevel(3)), 0);
    // darker near band gives depth without a flat blob
    g.fillStyle=inkLevel(4); g.fillRect(0, surfY-H*0.05, W, H*0.05);
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 4);
    // swell lines receding to the horizon
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.32;
    for(let j=1;j<=4;j++){
      const y = lerp(horizon+H*0.02, surfY-H*0.02, j/5);
      g.beginPath();
      for(let s=0;s<=20;s++){ const x=W*s/20; const yy=y+Math.sin(s*0.9+j)*H*0.005; s?g.lineTo(x,yy):g.moveTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- FOAMING WATERLINE (surf): light scalloped band ----
  if (has("surf")){
    const amp=H*0.012, lobes=11;
    const topY = x=> surfY + Math.sin(x*Math.PI*lobes)*amp + Math.sin(x*Math.PI*2.1)*amp*0.6;
    g.beginPath(); g.moveTo(0, topY(0)+H*0.03);
    for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); }
    g.lineTo(W, topY(1)+H*0.03); g.closePath();
    g.fillStyle=inkLevel(1); g.fill();
    pen.ink(()=>{ g.moveTo(0,topY(0)); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } }, 4);
    g.fillStyle=inkLevel(1); g.strokeStyle=INK; g.lineWidth=2;
    for(let i=0;i<lobes;i++){ const x=(i+0.5)/lobes; const y=topY(x)+H*0.010;
      g.beginPath(); g.arc(x*W, y, W*0.013, 0, 7); g.fill(); g.stroke(); }
  }

  // ---- BEACH (broad dry shore, foreground, light so it reads as ground) ----
  // painted before divisions so the scored border lines sit on top
  {
    g.fillStyle=inkLevel(2); g.fillRect(0, beachTop-H*0.005, W, H-(beachTop-H*0.005));
  }

  // ---- MOORED-SHIP ZONE: black ships drawn up in a row along the strand ----
  if (has("ships")){
    for(let i=0;i<params.ships;i++){
      const t=(i+0.5)/params.ships;
      const bx=W*(0.08+0.84*t), by=shipBaseY - H*0.004*Math.sin(t*Math.PI); // slight arc
      const bw=W*0.062, bh=H*0.028;
      // dark hull crescent (prow + stern rising)
      pen.paint(()=>{
        g.moveTo(bx-bw, by-bh*0.2);
        g.quadraticCurveTo(bx-bw*0.35, by+bh, bx+bw, by-bh*0.2);   // underside
        g.quadraticCurveTo(bx+bw*1.05, by-bh*0.9, bx+bw*0.7, by-bh*0.9);
        g.quadraticCurveTo(bx, by-bh*0.35, bx-bw*0.7, by-bh*0.9);  // gunwale
        g.quadraticCurveTo(bx-bw*1.05, by-bh*0.9, bx-bw, by-bh*0.2);
        g.closePath();
      }, toneSolid(inkLevel(7)), 4);
      // mast
      pen.ink(()=>{ g.moveTo(bx, by-bh*0.5); g.lineTo(bx, by-H*0.055); }, 3);
    }
  }

  // ---- NINE CROWD DIVISIONS: the beach scored into nine plots ----
  if (has("divisions")){
    const yTop = beachTop, yBot = H*0.97;
    // border lines (n+1 of them) converging slightly toward the sea
    g.strokeStyle=INK; g.lineWidth=3;
    for(let b=0;b<=n;b++){
      const f=b/n;
      g.globalAlpha = (b===0||b===n)?0.9:0.45;
      g.beginPath();
      g.moveTo(bandX(f,1)*W, yTop);
      g.lineTo(bandX(f,0)*W, yBot);
      g.stroke();
    }
    g.globalAlpha=1;
    // a back marker berm closing off the divisions from the ship zone
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    g.beginPath(); g.moveTo(bandX(0,1)*W, yTop); g.lineTo(bandX(1,1)*W, yTop); g.stroke();
    g.globalAlpha=1;
    // faint plot numeral ticks along the back berm (tally marks, not text)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let i=0;i<n;i++){ const cx=bandX((i+0.5)/n,1)*W;
      g.beginPath(); g.moveTo(cx, yTop-H*0.012); g.lineTo(cx, yTop+H*0.004); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- ALTAR FIRES: an altar stone + rising flame in each division ----
  if (has("altars") && params.altarFires){
    for(let i=0;i<n;i++){
      // skip the exact centre division — Nestor's raised place stands there
      const centre = params.nestorPlace && i===Math.floor(n/2);
      const f=(i+0.5)/n;
      const t=0.62;                         // altars sit in the mid-beach depth
      const ax=bandX(f,t)*W, ay=lerp(H*0.97, beachTop, t);
      if (centre) continue;
      // altar stone (mid-dark slab)
      const aw=W*0.034, ah=H*0.024;
      pen.paint(()=>{ g.rect(ax-aw, ay-ah, aw*2, ah); }, toneSolid(inkLevel(5)), 3);
      pen.paint(()=>{ g.rect(ax-aw*1.2, ay-ah-H*0.007, aw*2.4, H*0.009); }, toneSolid(inkLevel(6)), 3); // capstone
      // flame: light body with hard contour so it reads against the dark stone
      const fh=H*0.070;
      pen.paint(()=>{
        g.moveTo(ax-aw*0.8, ay-ah-H*0.005);
        g.quadraticCurveTo(ax-aw*1.0, ay-ah-fh*0.5, ax-aw*0.15, ay-ah-fh);
        g.quadraticCurveTo(ax-aw*0.25, ay-ah-fh*0.55, ax+aw*0.25, ay-ah-fh*0.78);
        g.quadraticCurveTo(ax+aw*1.0, ay-ah-fh*0.45, ax+aw*0.8, ay-ah-H*0.005);
        g.closePath();
      }, toneSolid(inkLevel(2)), 3);
      // inner flame tongue (a touch darker)
      pen.fillPath(()=>{
        g.moveTo(ax-aw*0.3, ay-ah-H*0.005);
        g.quadraticCurveTo(ax-aw*0.4, ay-ah-fh*0.42, ax, ay-ah-fh*0.66);
        g.quadraticCurveTo(ax+aw*0.4, ay-ah-fh*0.42, ax+aw*0.3, ay-ah-H*0.005);
        g.closePath();
      }, inkLevel(4));
      // a thin smoke curl
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
      g.beginPath(); g.moveTo(ax, ay-ah-fh);
      g.quadraticCurveTo(ax+aw*0.6, ay-ah-fh*1.4, ax-aw*0.2, ay-ah-fh*1.9);
      g.stroke(); g.globalAlpha=1;
    }
  }

  // ---- FEAST ROWS: long benches ranked across the foreground of each plot ----
  if (has("feast") && params.feastRows){
    for(let i=0;i<n;i++){
      const f=(i+0.5)/n;
      for(let r=0;r<2;r++){
        const t=0.24 - r*0.10;              // two ranks near the foreground
        const cx=bandX(f,t)*W, cy=lerp(H*0.97, beachTop, t);
        const bw=W*(0.036 - r*0.004), bh=H*0.011;
        pen.paint(()=>{ g.rect(cx-bw, cy-bh/2, bw*2, bh); }, toneSolid(inkLevel(4)), 2);
        // bench legs
        g.strokeStyle=INK; g.lineWidth=2;
        g.beginPath(); g.moveTo(cx-bw*0.8, cy+bh/2); g.lineTo(cx-bw*0.8, cy+bh);
        g.moveTo(cx+bw*0.8, cy+bh/2); g.lineTo(cx+bw*0.8, cy+bh); g.stroke();
      }
    }
  }

  // ---- NESTOR'S CENTRAL PLACE: a raised canopied seat on the middle axis ----
  if (has("nestor") && params.nestorPlace){
    const t=0.60, cx=bandX(0.5,t)*W, cy=lerp(H*0.97, beachTop, t);
    const pw=W*0.05, ph=H*0.075;
    // low dais platform
    pen.paint(()=>{ g.rect(cx-pw*1.25, cy-H*0.006, pw*2.5, H*0.020); }, toneSolid(inkLevel(4)), 4);
    // throne back + seat (darkest structure so the centre reads as the focus)
    pen.paint(()=>{ g.rect(cx-pw*0.6, cy-ph, pw*1.2, ph); }, toneSolid(inkLevel(6)), 4);            // back
    pen.paint(()=>{ g.rect(cx-pw*0.8, cy-ph*0.44, pw*1.6, ph*0.44); }, toneSolid(inkLevel(7)), 4);  // seat
    // canopy posts + lintel
    g.strokeStyle=INK; g.lineWidth=3;
    g.beginPath(); g.moveTo(cx-pw*1.1, cy-H*0.006); g.lineTo(cx-pw*1.1, cy-ph*1.5);
    g.moveTo(cx+pw*1.1, cy-H*0.006); g.lineTo(cx+pw*1.1, cy-ph*1.5); g.stroke();
    pen.paint(()=>{ g.rect(cx-pw*1.3, cy-ph*1.6, pw*2.6, ph*0.14); }, toneSolid(inkLevel(5)), 3);    // canopy lintel
  }
}

export const asset = {
  id:"location.pylos-sacrificial-beach",
  type:"LOCATION",
  name:"Pylos Sacrificial Beach",
  statusWord:"HALLOWED",
  scene:"OD-B03-S01",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","sea","surf","ships","divisions","altars","feast","nestor","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "place:nestor":{x:.50,y:.62},          // Nestor's raised central place
    "altar:div-1":{x:.10,y:.63}, "altar:div-2":{x:.21,y:.63}, "altar:div-3":{x:.31,y:.63},
    "altar:div-4":{x:.40,y:.63}, "altar:div-6":{x:.60,y:.63}, "altar:div-7":{x:.69,y:.63},
    "altar:div-8":{x:.79,y:.63}, "altar:div-9":{x:.90,y:.63},
    "zone:ships":{x:.50,y:.36},             // moored-ship line, sea side
    "feast:front":{x:.50,y:.86},            // foreground feast rows
    "threshold:surf":{x:.50,y:.34},         // waterline threshold to the sea
    "entrance:left":{x:.04,y:.90}, "exit:right":{x:.96,y:.90}, "exit:inland":{x:.50,y:.98},
    "camera:wide":{x:.50,y:.50}, "camera:nestor":{x:.50,y:.60}, "camera:altars":{x:.50,y:.62},
  },
  // walkable / interaction regions for scene placement + pathing
  zones:{
    shore:{ x0:.02,y0:.40,x1:.98,y1:.98 },     // the whole broad walkable strand
    divisions:{ x0:.04,y0:.42,x1:.96,y1:.97 }, // the nine scored crowd plots
    altarLine:{ x0:.06,y0:.58,x1:.94,y1:.66 }, // the rank of altar fires
    feast:{ x0:.06,y0:.78,x1:.94,y1:.96 },     // the foreground feast rows
    shipZone:{ x0:.04,y0:.32,x1:.96,y1:.40 },  // the moored ships drawn up on the sand
    sea:{ x0:.00,y0:.20,x1:1.0,y1:.32 },
  },
  states:{
    initial:"assembled",
    nodes:{
      assembled:{ preview:{ layers:["sky","sea","surf","ships","divisions","altars","feast","nestor"] } },
      "rite":{ preview:{ layers:["sky","sea","surf","ships","divisions","altars","nestor"] } },   // fires lit, benches cleared
      "feasting":{ preview:{ layers:["sky","sea","surf","ships","divisions","feast","nestor"] } },// fires banked
      empty:{ preview:{ layers:["sky","sea","surf","ships","divisions"] } },                       // bare set
    },
    edges:[["assembled","rite"],["rite","feasting"],["assembled","empty"],["feasting","empty"]],
  },
  channels:["reveal","camera","fire","tide","light"],

  preview:()=>({ layers:["sky","sea","surf","ships","divisions","altars","feast","nestor"], status:"HALLOWED", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
