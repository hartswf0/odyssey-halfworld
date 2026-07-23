/* location.scheria-city-and-harbor — the walled seafaring capital of the
   Phaeacians. LOCATION asset. An EMPTY navigable set seen from the seaward
   side: TWIN HARBORS in the foreground flanking a central stone quay/mole
   (moored ships along both edges), rows of gabled SHIP SHEDS at the harbor
   heads, a MARKET of stalls and a columned POSEIDON TEMPLE on the mid streets,
   and behind it all the CITY WALL with its gate, towers, and the royal PALACE
   raised on a rise reached by the approach stair. Drawn in SOLID grays + hard
   contour into the offscreen ctx (the engine dotify pass supplies the
   halftone). Declares depth layers (fg quay+water / mid streets / bg walls+
   palace), walkable zones, gates, entrances/exits, crowd lanes, camera anchors.
   NO characters baked in.
   Atlas: OD-B07-S01 — walled seafaring city with twin harbors, ship sheds,
   market, temple, streets, palace approach, crowd lanes. */
import { makePen, toneSolid, inkLevel, INK, lerp, clamp } from "/engine/halfworld-engine.mjs";

const params = {
  wallTop:0.27,        // top of the city wall (fraction of H)
  wallBot:0.42,        // where the wall meets the city ground
  horizon:0.62,        // city ground -> harbor foreground line
  gateX:0.50,          // main gate + palace-approach axis
  templeX:0.68,        // Poseidon temple on the mid street (right of centre)
  marketX:0.30,        // market stalls on the mid street (left of centre)
  shipsLeft:2,         // moored ships in the left harbor
  shipsRight:2,        // moored ships in the right harbor
  wallTowers:4,        // towers punctuating the wall
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const wallTop = H*params.wallTop;
  const wallBot = H*params.wallBot;
  const horizon = H*params.horizon;
  const gx = W*params.gateX;
  const layers = st.layers || ["sky","palace","walls","ground","sheds","market","temple","harbors","quay","ships","anchors"];
  const has = l => layers.includes(l);

  /* ---- small reusable builders ---- */
  // a columned classical building (temple/palace facade): stylobate, columns,
  // architrave, gabled pediment. base=ground y, w=full width, h=column height.
  function colonnade(cx, base, w, h, cols, bodyTone, colTone, shadeTone){
    // stylobate / plinth
    pen.paint(()=>{ g.rect(cx-w/2, base-h*0.10, w, h*0.10); }, toneSolid(bodyTone), 4);
    // dark cella interior BEHIND the colonnade (one band -> depth, not stray bars)
    pen.paint(()=>{ g.rect(cx-w*0.42, base-h*0.92, w*0.84, h*0.82); }, toneSolid(inkLevel(6)), 3);
    // columns (light) standing against the dark interior
    const inner=w*0.82, cw=inner/(cols*1.7);
    for(let i=0;i<cols;i++){
      const t=cols>1?i/(cols-1):0.5;
      const x=cx-inner/2 + inner*t;
      pen.paint(()=>{ g.rect(x-cw/2, base-h*0.92, cw, h*0.82); }, toneSolid(colTone), 3);
    }
    // architrave beam
    pen.paint(()=>{ g.rect(cx-w/2, base-h-h*0.02, w, h*0.14); }, toneSolid(shadeTone), 4);
    // gabled pediment
    pen.paint(()=>{
      g.moveTo(cx-w/2, base-h-h*0.02);
      g.lineTo(cx, base-h-h*0.46);
      g.lineTo(cx+w/2, base-h-h*0.02);
      g.closePath();
    }, toneSolid(bodyTone), 4);
  }

  // a gabled ship shed / boathouse with a dark slip mouth facing the water
  function shed(x, base, w, h){
    pen.paint(()=>{ g.rect(x, base-h, w, h); }, toneSolid(inkLevel(3)), 3);              // body
    pen.paint(()=>{                                                                       // gable roof
      g.moveTo(x-w*0.08, base-h); g.lineTo(x+w/2, base-h-h*0.55); g.lineTo(x+w*1.08, base-h); g.closePath();
    }, toneSolid(inkLevel(4)), 3);
    pen.paint(()=>{                                                                       // arched slip mouth (dark)
      g.moveTo(x+w*0.22, base); g.lineTo(x+w*0.22, base-h*0.52);
      g.quadraticCurveTo(x+w*0.5, base-h*0.78, x+w*0.78, base-h*0.52);
      g.lineTo(x+w*0.78, base); g.closePath();
    }, toneSolid(inkLevel(6)), 2);
  }

  // a market stall: light awning table with two posts
  function stall(x, base, w, h){
    pen.paint(()=>{ g.rect(x-w*0.06, base-h, w*0.05, h); }, toneSolid(inkLevel(5)), 2);   // back post
    pen.paint(()=>{ g.rect(x+w*0.55, base-h, w*0.05, h); }, toneSolid(inkLevel(5)), 2);   // front post
    pen.paint(()=>{ g.rect(x-w*0.12, base-h, w*0.78, h*0.24); }, toneSolid(inkLevel(4)), 3); // awning
    pen.paint(()=>{ g.rect(x, base-h*0.42, w*0.5, h*0.18); }, toneSolid(inkLevel(3)), 2);    // counter
  }

  // a moored ship in side view: long low galley hull with raised prow/stern,
  // a tall mast, furled yard, and rigging — reads clearly as a boat.
  function ship(cx, cy, s){
    pen.paint(()=>{                                                                        // hull (solid galley)
      g.moveTo(cx-s*1.10, cy-s*0.06);
      g.quadraticCurveTo(cx-s*0.98, cy-s*0.40, cx-s*0.72, cy-s*0.30);   // raised stern
      g.lineTo(cx+s*0.72, cy-s*0.30);
      g.quadraticCurveTo(cx+s*0.98, cy-s*0.40, cx+s*1.10, cy-s*0.06);   // raised prow
      g.quadraticCurveTo(cx, cy+s*0.44, cx-s*1.10, cy-s*0.06);          // rounded keel
      g.closePath();
    }, toneSolid(inkLevel(6)), 3);
    // gunwale sheer line (light) to separate hull from keel
    pen.seam(()=>{ g.moveTo(cx-s*0.72, cy-s*0.22); g.lineTo(cx+s*0.72, cy-s*0.22); }, 2);
    // mast + furled yard
    pen.ink(()=>{ g.moveTo(cx, cy-s*0.30); g.lineTo(cx, cy-s*1.18); }, 3);
    pen.ink(()=>{ g.moveTo(cx-s*0.55, cy-s*0.80); g.lineTo(cx+s*0.55, cy-s*0.80); }, 3);
    // fore/back stays (rigging)
    pen.ink(()=>{ g.moveTo(cx, cy-s*1.18); g.lineTo(cx-s*0.70, cy-s*0.30); }, 2);
    pen.ink(()=>{ g.moveTo(cx, cy-s*1.18); g.lineTo(cx+s*0.70, cy-s*0.30); }, 2);
  }

  // ---- SKY over the city (lightest tone -> few dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,wallBot);
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.14+i*0.30), wallTop*(0.40+0.18*(i%2)), W*0.12, H*0.020, 0,0,7); g.fill(); }
  }

  // ---- PALACE on the rise (centre-back, raised above the wall) ----
  if (has("palace")){
    const px=gx, base=wallTop+H*0.02, pw=W*0.30, ph=H*0.15;
    // terraced rise the palace stands on (a stepped mound behind the wall)
    for(let i=0;i<3;i++){
      const tw=pw*(1.5-i*0.16), ty=wallTop+H*0.02 - i*H*0.006;
      pen.paint(()=>{ g.rect(px-tw/2, ty, tw, H*0.03); }, toneSolid(inkLevel(2+ (i%2))), 3);
    }
    // palace facade block with its own colonnade + pediment
    colonnade(px, base-H*0.005, pw, ph, 5, inkLevel(3), inkLevel(4), inkLevel(5));
    // twin corner turrets flanking the palace
    for(const s of [-1,1]){
      pen.paint(()=>{ g.rect(px+s*pw*0.66-W*0.02, base-ph*1.10, W*0.04, ph*1.20); }, toneSolid(inkLevel(3)), 3);
      pen.paint(()=>{ g.rect(px+s*pw*0.66-W*0.03, base-ph*1.10, W*0.06, H*0.02); }, toneSolid(inkLevel(4)), 2);
    }
  }

  // ---- CITY WALL across the back with gate + towers ----
  if (has("walls")){
    // main curtain wall
    pen.paint(()=>{ g.rect(W*0.03, wallTop, W*0.94, wallBot-wallTop); }, toneSolid(inkLevel(3)), 5);
    // crenellated coping along the top
    pen.paint(()=>{ g.rect(W*0.03, wallTop, W*0.94, H*0.018); }, toneSolid(inkLevel(4)), 3);
    g.fillStyle=inkLevel(4);
    for(let x=W*0.05; x<W*0.95; x+=W*0.045){ g.fillRect(x, wallTop-H*0.012, W*0.022, H*0.014); }
    // faint masonry courses
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.16;
    for(let j=1;j<=3;j++){ const y=wallTop+(wallBot-wallTop)*(j/4); g.beginPath(); g.moveTo(W*0.03,y); g.lineTo(W*0.97,y); g.stroke(); }
    g.globalAlpha=1;
    // wall towers
    const n=params.wallTowers;
    for(let i=0;i<n;i++){
      const t=(i+0.5)/n, tx=W*(0.06+0.88*t);
      if (Math.abs(tx-gx) < W*0.09) continue;       // leave room for the gate
      pen.paint(()=>{ g.rect(tx-W*0.028, wallTop-H*0.05, W*0.056, wallBot-wallTop+H*0.05); }, toneSolid(inkLevel(4)), 4);
      pen.paint(()=>{ g.rect(tx-W*0.034, wallTop-H*0.05, W*0.068, H*0.016); }, toneSolid(inkLevel(5)), 2);
    }
    // MAIN GATE — dark arched opening on the palace-approach axis
    const gw=W*0.10, gh=(wallBot-wallTop)*0.86;
    pen.paint(()=>{
      g.moveTo(gx-gw/2, wallBot); g.lineTo(gx-gw/2, wallBot-gh*0.6);
      g.quadraticCurveTo(gx, wallBot-gh*1.05, gx+gw/2, wallBot-gh*0.6);
      g.lineTo(gx+gw/2, wallBot); g.closePath();
    }, toneSolid(inkLevel(7)), 4);
    // flanking gate-towers
    for(const s of [-1,1]){
      pen.paint(()=>{ g.rect(gx+s*gw*0.72-W*0.026, wallTop-H*0.06, W*0.052, wallBot-wallTop+H*0.06); }, toneSolid(inkLevel(5)), 4);
      pen.paint(()=>{ g.rect(gx+s*gw*0.72-W*0.032, wallTop-H*0.06, W*0.064, H*0.018); }, toneSolid(inkLevel(6)), 2);
    }
  }

  // ---- CITY GROUND / STREETS (mid band, light; perspective lanes to the gate) ----
  if (has("ground")){
    g.fillStyle=inkLevel(2); g.fillRect(0,wallBot,W,horizon-wallBot);
    // crowd-lane paving: lines radiating up to the gate (the palace approach fan)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.26;
    for(let i=-6;i<=6;i++){ g.beginPath(); g.moveTo(gx, wallBot); g.lineTo(W*(0.5+i*0.115), horizon); g.stroke(); }
    for(let j=1;j<=3;j++){ const y=wallBot+(horizon-wallBot)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
    // palace-approach STAIR climbing from the street up to the gate
    const sw=W*0.12;
    for(let i=0;i<5;i++){
      const t=i/5, y=lerp(horizon-H*0.02, wallBot, t), w=lerp(sw, W*0.09, t);
      pen.paint(()=>{ g.rect(gx-w/2, y-H*0.012, w, H*0.014); }, toneSolid(inkLevel(3+(i%2))), 2);
    }
  }

  // ---- SHIP SHEDS at the harbor heads (rows flanking the quay, near horizon) ----
  if (has("sheds")){
    const sh=H*0.05, sw=W*0.075;
    for(let i=0;i<3;i++){ shed(W*0.05 + i*sw*1.12, horizon-H*0.004, sw, sh); }        // left harbor head
    for(let i=0;i<3;i++){ shed(W*0.62 + i*sw*1.12, horizon-H*0.004, sw, sh); }        // right harbor head
  }

  // ---- MARKET of stalls on the left mid street ----
  if (has("market")){
    const mx=W*params.marketX, base=horizon-H*0.03, sw=W*0.07, sh=H*0.055;
    for(let i=0;i<3;i++){ stall(mx-W*0.02 + i*sw*1.05, base - i*H*0.004, sw, sh); }
  }

  // ---- POSEIDON TEMPLE standing proud on the right mid street ----
  if (has("temple")){
    const tx=W*params.templeX, base=horizon-H*0.02, tw=W*0.20, th=H*0.14;
    colonnade(tx, base, tw, th, 4, inkLevel(3), inkLevel(4), inkLevel(6));
    // trident finial atop the pediment (Poseidon's mark)
    pen.ink(()=>{ g.moveTo(tx, base-th-th*0.52); g.lineTo(tx, base-th-th*0.80); }, 3);
    pen.ink(()=>{ g.moveTo(tx-tw*0.05, base-th-th*0.70); g.lineTo(tx-tw*0.05, base-th-th*0.86); }, 2);
    pen.ink(()=>{ g.moveTo(tx+tw*0.05, base-th-th*0.70); g.lineTo(tx+tw*0.05, base-th-th*0.86); }, 2);
  }

  // ---- TWIN HARBORS: the two water basins flanking the central quay (fg) ----
  if (has("harbors")){
    const drawBasin=(pts)=>{
      pen.paint(()=>{ g.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.closePath(); },
        toneSolid(inkLevel(3)), 4);
    };
    // left basin (bottom-left) and right basin (bottom-right)
    drawBasin([[0,horizon],[W*0.42,horizon],[W*0.30,H],[0,H]]);
    drawBasin([[W,horizon],[W*0.58,horizon],[W*0.70,H],[W,H]]);
    // swell/ripple lines across both basins (deterministic, calmer harbor water)
    g.strokeStyle=INK; g.lineCap="round"; g.lineWidth=2;
    for(let j=1;j<=6;j++){
      const t=j/6, y=lerp(horizon+H*0.02, H, t);
      g.globalAlpha=0.20+0.30*t;
      // left basin ripple
      g.beginPath(); for(let x=0;x<=W*0.40;x+=W/26){ const yy=y+Math.sin(x/W*13+j)*H*0.006; x===0?g.moveTo(x,yy):g.lineTo(x,yy); } g.stroke();
      // right basin ripple
      g.beginPath(); let first=true; for(let x=W*0.60;x<=W;x+=W/26){ const yy=y+Math.sin(x/W*13+j+2)*H*0.006; first?g.moveTo(x,yy):g.lineTo(x,yy); first=false; } g.stroke();
    }
    g.globalAlpha=1;
    // hard water sightline at the harbor head
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W*0.42,horizon); }, 3);
    pen.ink(()=>{ g.moveTo(W*0.58,horizon); g.lineTo(W,horizon); }, 3);
  }

  // ---- CENTRAL QUAY / MOLE (foreground stone tongue between the harbors) ----
  if (has("quay")){
    pen.paint(()=>{
      g.moveTo(W*0.42,horizon); g.lineTo(W*0.58,horizon);
      g.lineTo(W*0.70,H); g.lineTo(W*0.30,H); g.closePath();
    }, toneSolid(inkLevel(2)), 5);
    // paving joints running down the mole toward the viewer
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
    for(let i=-2;i<=2;i++){ g.beginPath(); g.moveTo(gx+i*W*0.03, horizon); g.lineTo(gx+i*W*0.09, H); g.stroke(); }
    for(let j=1;j<=3;j++){ const y=lerp(horizon,H,j/3); const hw=lerp(W*0.08,W*0.20,j/3); g.beginPath(); g.moveTo(gx-hw,y); g.lineTo(gx+hw,y); g.stroke(); }
    g.globalAlpha=1;
    // mooring bollards along the two quay edges
    g.fillStyle=inkLevel(6);
    for(let j=0;j<3;j++){ const t=(j+1)/4;
      const lyx=lerp(W*0.42,W*0.30,t), ryx=lerp(W*0.58,W*0.70,t), y=lerp(horizon,H,t);
      g.beginPath(); g.ellipse(lyx, y, W*0.010, H*0.008, 0,0,7); g.fill();
      g.beginPath(); g.ellipse(ryx, y, W*0.010, H*0.008, 0,0,7); g.fill();
    }
  }

  // ---- MOORED SHIPS along the quay edges in each harbor ----
  if (has("ships")){
    for(let i=0;i<params.shipsLeft;i++){
      const t=params.shipsLeft>1?i/(params.shipsLeft-1):0.5;
      ship(lerp(W*0.24,W*0.11,t), lerp(horizon+H*0.09,H*0.84,t), lerp(W*0.068,W*0.098,t));
    }
    for(let i=0;i<params.shipsRight;i++){
      const t=params.shipsRight>1?i/(params.shipsRight-1):0.5;
      ship(lerp(W*0.76,W*0.89,t), lerp(horizon+H*0.09,H*0.84,t), lerp(W*0.068,W*0.098,t));
    }
  }
}

export const asset = {
  id:"location.scheria-city-and-harbor",
  type:"LOCATION",
  name:"Scheria City and Harbor",
  statusWord:"SEAFARING",
  scene:"OD-B07-S01",

  params,
  // back -> front draw order; ground early so buildings sit on it, water/quay/
  // ships last as the foreground. Scene state may pass a subset of these.
  layers:["sky","palace","walls","ground","sheds","market","temple","harbors","quay","ships","anchors"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "gate:main":{x:.50,y:.42},              // city gate on the wall
    "palace:approach":{x:.50,y:.36},        // stair climbing to the palace
    "palace:facade":{x:.50,y:.26},          // Alcinous's palace on the rise
    "temple:poseidon":{x:.68,y:.54},        // columned Poseidon temple
    "market:stalls":{x:.30,y:.56},          // market on the mid street
    "street:crowd-lane":{x:.50,y:.55},      // main lane, gate to quay
    "harbor:left":{x:.18,y:.82},            // left harbor basin
    "harbor:right":{x:.82,y:.82},           // right harbor basin
    "quay:mole":{x:.50,y:.86},              // central stone quay/mole (fg)
    "sheds:left":{x:.16,y:.60},             // left ship sheds
    "sheds:right":{x:.78,y:.60},            // right ship sheds
    "moor:left":{x:.20,y:.78},              // moored ship, left
    "moor:right":{x:.80,y:.78},             // moored ship, right
    "entrance:quay":{x:.50,y:.98},          // arrive by sea onto the quay (fg)
    "exit:gate":{x:.50,y:.42},              // leave through the gate into the city
    "camera:wide":{x:.50,y:.50},
    "camera:harbor":{x:.50,y:.80},
    "camera:palace":{x:.50,y:.32},
  },
  // navigable regions for scene placement / pathing
  zones:{
    walkable:{ x0:.04,y0:.42,x1:.96,y1:.62 },     // the city streets / mid ground
    quay:{ x0:.30,y0:.62,x1:.70,y1:1.00 },         // the central mole (fg land)
    "water-left":{ x0:.00,y0:.62,x1:.42,y1:1.00 }, // left harbor (navigable by ship)
    "water-right":{ x0:.58,y0:.62,x1:1.00,y1:1.00 },
    market:{ x0:.18,y0:.50,x1:.44,y1:.60 },
    temple:{ x0:.56,y0:.44,x1:.80,y1:.60 },
    approach:{ x0:.40,y0:.36,x1:.60,y1:.60 },      // palace-approach crowd lane
  },
  states:{
    initial:"festive",
    nodes:{
      // full city, ships moored, market busy — the day of Odysseus's arrival
      festive:{ preview:{ layers:["sky","palace","walls","ground","sheds","market","temple","harbors","quay","ships"] } },
      // market struck, quay cleared for the assembly / ship-launch
      "assembly":{ preview:{ layers:["sky","palace","walls","ground","sheds","temple","harbors","quay","ships"] } },
      // harbors empty, ships gone to sea (the escort launched)
      "ships-away":{ preview:{ layers:["sky","palace","walls","ground","sheds","market","temple","harbors","quay"] } },
      // bare navigable set: architecture + water only
      empty:{ preview:{ layers:["sky","palace","walls","ground","temple","harbors","quay"] } },
    },
    edges:[["festive","assembly"],["assembly","ships-away"],["ships-away","festive"],["festive","empty"]],
  },
  channels:["reveal","camera","tide","light","crowd"],

  preview:()=>({ layers:["sky","palace","walls","ground","sheds","market","temple","harbors","quay","ships"], status:"SEAFARING", progress:0.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
