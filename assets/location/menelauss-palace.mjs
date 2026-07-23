/* location.menelauss-palace — the luminous high-roofed hall of Sparta.
   LOCATION asset. An EMPTY navigable INTERIOR set: the great wedding-feast
   hall of Menelaus seen down its length. High pitched roof on twin
   colonnades closes the top; the far back wall opens through the great GATE
   to bright daylight and the courtyard beyond. Down each side run the guest
   seats (high-backed chairs) and, along the walls, the gleaming treasure
   surfaces — bronze tripods and laden tables that catch the light. Back-left
   a curtained bathing-room niche; front-right by the gate the stable stalls.
   Dead-centre the long feast table set for the wedding of two children.
   Drawn in SOLID grays + hard contour; the engine dotify pass supplies the
   halftone. NO characters baked in.
   Atlas: OD-B04-S01 — luminous high-roofed Spartan palace with gate, stable,
   bathing rooms, wedding feast, treasure surfaces, guest seats. */
import { makePen, toneSolid, inkLevel, INK } from "../../engine/halfworld-engine.mjs";

const params = {
  floorLevel:0.70,     // hall floor horizon as fraction of H
  colsPerSide:4,       // columns of each receding colonnade
  seatsPerSide:3,      // high-backed guest seats down each side
  tripods:true,        // gleaming bronze treasure tripods along the walls
  gate:true,           // great gate in the back wall, daylight beyond
  bathNiche:true,      // curtained bathing-room niche, back-left
  stable:true,         // stable stalls by the gate, front-right
  feast:true,          // long wedding-feast table dead-centre
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const wallTop = horizon - H*0.44;      // top of the tall back wall
  const roofPeak = wallTop - H*0.16;     // apex of the high pitched roof
  const layers = st.layers || ["roof","backwall","gate","floor","colonnade","tripods","seats","bath","stable","feast"];
  const has = l => layers.includes(l);

  // ---- HIGH PITCHED ROOF closing the top (luminous, lightest tones) ----
  if (has("roof")){
    // interior ceiling field behind the rafters
    g.fillStyle=inkLevel(1); g.fillRect(0,0,W,wallTop);
    // gabled roofline: two long slopes meeting at the peak
    pen.paint(()=>{
      g.moveTo(W*0.02, wallTop);
      g.lineTo(W*0.50, roofPeak);
      g.lineTo(W*0.98, wallTop);
      g.lineTo(W*0.98, wallTop+H*0.02);
      g.lineTo(W*0.50, roofPeak+H*0.02);
      g.lineTo(W*0.02, wallTop+H*0.02);
      g.closePath();
    }, toneSolid(inkLevel(2)), 5);
    // ridge beam + receding rafters (structural ink lines catching the light)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.55;
    for(let i=1;i<=7;i++){
      const t=i/8, x=W*(0.02+0.96*t);
      const ry = wallTop - Math.sin(t*Math.PI)*H*0.155;   // follows the gable
      g.beginPath(); g.moveTo(x, wallTop+H*0.01); g.lineTo(x, ry+H*0.006); g.stroke();
    }
    g.globalAlpha=1;
    // ridge purlin
    pen.ink(()=>{ g.moveTo(W*0.14, roofPeak+H*0.048); g.lineTo(W*0.86, roofPeak+H*0.048); }, 3);
  }

  // ---- BACK WALL of the hall (mid structural stone) ----
  if (has("backwall")){
    pen.paint(()=>{ g.rect(W*0.02, wallTop, W*0.96, horizon-wallTop); }, toneSolid(inkLevel(3)), 5);
    // cornice band under the roof
    pen.paint(()=>{ g.rect(W*0.02, wallTop, W*0.96, H*0.026); }, toneSolid(inkLevel(4)), 4);
    // faint ashlar courses
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.16;
    for(let j=1;j<=4;j++){ const y=wallTop+(horizon-wallTop)*(j/5); g.beginPath(); g.moveTo(W*0.02,y); g.lineTo(W*0.98,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- GREAT GATE in the back wall, daylight beyond (luminous portal) ----
  if (has("gate") && params.gate){
    const gx=W*0.50, gw=W*0.20, gtop=wallTop+H*0.05, gbot=horizon;
    // dark jamb frame
    pen.paint(()=>{ g.rect(gx-gw/2-W*0.012, gtop-H*0.02, gw+W*0.024, gbot-gtop+H*0.02); }, toneSolid(inkLevel(5)), 5);
    // the bright opening — courtyard daylight (lightest, so it glows)
    pen.paint(()=>{ g.rect(gx-gw/2, gtop, gw, gbot-gtop); }, toneSolid(inkLevel(1)), 4);
    // heavy lintel beam over the gate
    pen.paint(()=>{ g.rect(gx-gw/2-W*0.02, gtop-H*0.035, gw+W*0.04, H*0.035); }, toneSolid(inkLevel(5)), 4);
    // a low far wall / distant courtyard step glimpsed through the opening
    g.fillStyle=inkLevel(2); g.fillRect(gx-gw/2, gbot-H*0.05, gw, H*0.05);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
    g.beginPath(); g.moveTo(gx-gw*0.5, gbot); g.lineTo(gx-gw*0.28, gtop+H*0.03); g.stroke();
    g.beginPath(); g.moveTo(gx+gw*0.5, gbot); g.lineTo(gx+gw*0.28, gtop+H*0.03); g.stroke();
    g.globalAlpha=1;
  }

  // ---- HALL FLOOR (drawn before props so they sit on it) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.26;
    const vx=W*0.50, vy=horizon;
    for(let i=-6;i<=6;i++){ g.beginPath(); g.moveTo(vx, vy); g.lineTo(W*(0.5+i*0.15), H); g.stroke(); }
    for(let j=1;j<=4;j++){ const y=horizon+(H-horizon)*(j/4)*(j/4); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- TWIN COLONNADES carrying the high roof (receding down the hall) ----
  if (has("colonnade")){
    const n=params.colsPerSide;
    for(let s=-1;s<=1;s+=2){
      for(let i=0;i<n;i++){
        const depth=i/(n-1);                              // 0 far .. 1 near
        const cx = W*0.50 + s*(W*0.12 + depth*W*0.32);
        const foot = horizon + depth*H*0.14;              // steps toward viewer
        const chgt = H*0.34 + depth*H*0.14;
        const cw = W*0.024 + depth*W*0.022;
        pen.paint(()=>{ g.rect(cx-cw/2, foot-chgt, cw, chgt); }, toneSolid(inkLevel(3)), 4);        // shaft
        pen.paint(()=>{ g.rect(cx-cw*0.9, foot-chgt, cw*1.8, H*0.02+depth*H*0.01); }, toneSolid(inkLevel(5)), 3); // capital
        pen.paint(()=>{ g.rect(cx-cw*0.8, foot-H*0.016, cw*1.6, H*0.016); }, toneSolid(inkLevel(4)), 3); // base
        // faint fluting
        g.strokeStyle=INK; g.lineWidth=1.5; g.globalAlpha=0.25;
        g.beginPath(); g.moveTo(cx-cw*0.2, foot-chgt+H*0.02); g.lineTo(cx-cw*0.2, foot-H*0.02); g.stroke();
        g.beginPath(); g.moveTo(cx+cw*0.2, foot-chgt+H*0.02); g.lineTo(cx+cw*0.2, foot-H*0.02); g.stroke();
        g.globalAlpha=1;
      }
    }
  }

  // ---- GLEAMING TREASURE SURFACES: bronze tripods along the back wall ----
  if (has("tripods") && params.tripods){
    const spots=[W*0.14, W*0.30, W*0.70, W*0.86];
    for(const tx of spots){
      const ty=horizon-H*0.02, bowlR=W*0.026, legH=H*0.07;
      // three splayed legs
      g.strokeStyle=INK; g.lineWidth=4; g.lineCap="round";
      g.beginPath(); g.moveTo(tx, ty-legH); g.lineTo(tx-bowlR*0.9, ty); g.stroke();
      g.beginPath(); g.moveTo(tx, ty-legH); g.lineTo(tx+bowlR*0.9, ty); g.stroke();
      g.beginPath(); g.moveTo(tx, ty-legH); g.lineTo(tx, ty+H*0.004); g.stroke();
      // the gleaming cauldron bowl (dark rim, bright highlight = polished bronze)
      pen.paint(()=>{ g.ellipse(tx, ty-legH, bowlR, bowlR*0.6, 0,0,7); }, toneSolid(inkLevel(5)), 4);
      pen.paint(()=>{ g.ellipse(tx, ty-legH-H*0.004, bowlR*0.66, bowlR*0.34, 0,0,7); }, toneSolid(inkLevel(2)), 3); // highlight
      // ring handles
      g.strokeStyle=INK; g.lineWidth=3;
      g.beginPath(); g.arc(tx-bowlR, ty-legH, bowlR*0.22, 0,7); g.stroke();
      g.beginPath(); g.arc(tx+bowlR, ty-legH, bowlR*0.22, 0,7); g.stroke();
    }
  }

  // ---- GUEST SEATS: high-backed chairs down each side ----
  if (has("seats")){
    const n=params.seatsPerSide;
    for(let s=-1;s<=1;s+=2){
      for(let i=0;i<n;i++){
        const depth=i/(n-1);
        const cx = W*0.50 + s*(W*0.26 + depth*W*0.16);
        const foot = horizon + H*0.03 + depth*H*0.15;
        const sc = 0.8 + depth*0.7;                       // scale with nearness
        const sw=W*0.05*sc, seatH=H*0.04*sc, backH=H*0.11*sc;
        pen.paint(()=>{ g.rect(cx-sw/2, foot-seatH, sw, seatH); }, toneSolid(inkLevel(4)), 4);       // seat block
        pen.paint(()=>{ g.rect(cx-sw/2, foot-seatH-backH, sw*0.9, backH); }, toneSolid(inkLevel(5)), 4); // high back
        pen.paint(()=>{ g.rect(cx-sw/2, foot, sw*0.16, H*0.03*sc); }, toneSolid(inkLevel(5)), 2);     // front leg
        pen.paint(()=>{ g.rect(cx+sw/2-sw*0.16, foot, sw*0.16, H*0.03*sc); }, toneSolid(inkLevel(5)), 2); // front leg
        // a fleece cushion catching light on the seat
        pen.paint(()=>{ g.ellipse(cx, foot-seatH-H*0.004*sc, sw*0.42, H*0.012*sc, 0,0,7); }, toneSolid(inkLevel(2)), 2);
      }
    }
  }

  // ---- CURTAINED BATHING-ROOM NICHE (back-left in the wall) ----
  if (has("bath") && params.bathNiche){
    const nx=W*0.11, ntop=wallTop+H*0.10, nw=W*0.11, nh=H*0.24;
    pen.paint(()=>{ g.rect(nx-nw/2, ntop, nw, nh); }, toneSolid(inkLevel(4)), 4);                    // recessed niche
    // hanging curtain, half drawn (folds)
    g.fillStyle=inkLevel(6);
    for(let k=0;k<4;k++){ g.beginPath(); g.rect(nx-nw/2+k*(nw*0.16), ntop, nw*0.14, nh*0.7); g.fill(); }
    g.strokeStyle=INK; g.lineWidth=2;
    for(let k=0;k<4;k++){ g.beginPath(); g.moveTo(nx-nw/2+k*(nw*0.16)+nw*0.07, ntop); g.lineTo(nx-nw/2+k*(nw*0.16)+nw*0.07, ntop+nh*0.7); g.stroke(); }
    // polished bathing basin inside the niche
    pen.paint(()=>{ g.ellipse(nx, ntop+nh-H*0.02, nw*0.42, H*0.02, 0,0,7); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.ellipse(nx, ntop+nh-H*0.024, nw*0.3, H*0.013, 0,0,7); }, toneSolid(inkLevel(2)), 2);
  }

  // ---- STABLE STALLS by the gate (front-right) ----
  if (has("stable") && params.stable){
    const bx=W*0.87, bfoot=horizon+H*0.20, bw=W*0.20, bh=H*0.20;
    // stall enclosure
    pen.paint(()=>{ g.rect(bx-bw/2, bfoot-bh, bw, bh); }, toneSolid(inkLevel(2)), 5);
    pen.ink(()=>{ g.moveTo(bx, bfoot-bh); g.lineTo(bx, bfoot); }, 4);                                // divider between two stalls
    // rail bars across the front
    g.strokeStyle=INK; g.lineWidth=3;
    for(let r=1;r<=3;r++){ const y=bfoot-bh*(r/4); g.beginPath(); g.moveTo(bx-bw/2, y); g.lineTo(bx+bw/2, y); g.stroke(); }
    // a manger trough at the base
    pen.paint(()=>{ g.rect(bx-bw*0.44, bfoot-H*0.03, bw*0.88, H*0.03); }, toneSolid(inkLevel(5)), 3);
    // straw hatch marks in the trough
    g.strokeStyle=INK; g.lineWidth=1.5; g.globalAlpha=0.5;
    for(let s2=0;s2<6;s2++){ const x=bx-bw*0.4+s2*bw*0.14; g.beginPath(); g.moveTo(x, bfoot-H*0.028); g.lineTo(x+bw*0.03, bfoot-H*0.008); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- LONG WEDDING-FEAST TABLE dead-centre (set for the double wedding) ----
  if (has("feast") && params.feast){
    const fx=W*0.50, ftop=horizon+H*0.12, fw=W*0.30, fh=H*0.05;
    // table top (long, foreshortened toward the gate)
    pen.paint(()=>{
      g.moveTo(fx-fw*0.34, ftop); g.lineTo(fx+fw*0.34, ftop);
      g.lineTo(fx+fw*0.5, ftop+fh); g.lineTo(fx-fw*0.5, ftop+fh); g.closePath();
    }, toneSolid(inkLevel(4)), 5);
    // table legs
    pen.paint(()=>{ g.rect(fx-fw*0.46, ftop+fh, W*0.02, H*0.06); }, toneSolid(inkLevel(6)), 3);
    pen.paint(()=>{ g.rect(fx+fw*0.44, ftop+fh, W*0.02, H*0.06); }, toneSolid(inkLevel(6)), 3);
    // gleaming plate + cups on the board (bright highlights)
    for(let k=-2;k<=2;k++){
      const px=fx+k*fw*0.20, py=ftop+fh*0.5;
      pen.paint(()=>{ g.ellipse(px, py, fw*0.05, fh*0.28, 0,0,7); }, toneSolid(inkLevel(2)), 2);      // dish
      pen.paint(()=>{ g.rect(px+fw*0.02, py-fh*0.5, fw*0.02, fh*0.4); }, toneSolid(inkLevel(5)), 2);   // cup
    }
    // a great mixing-bowl (krater) centred on the board
    pen.paint(()=>{ g.ellipse(fx, ftop+fh*0.35, fw*0.08, fh*0.4, 0,0,7); }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.ellipse(fx, ftop+fh*0.30, fw*0.05, fh*0.24, 0,0,7); }, toneSolid(inkLevel(2)), 2);
  }
}

export const asset = {
  id:"location.menelauss-palace",
  type:"LOCATION",
  name:"Menelaus's Palace",
  statusWord:"LUMINOUS",
  scene:"OD-B04-S01",

  params,
  // back -> front draw order; floor early so foreground props sit on it.
  // scene state may pass a subset of these.
  layers:["roof","backwall","gate","floor","colonnade","tripods","seats","bath","stable","feast"],
  // normalized 0..1 placement / camera + zone anchors (NO baked characters)
  anchors:{
    "gate:great":{x:.50,y:.55},               // great gate in the back wall
    "threshold:gate":{x:.50,y:.70},
    "zone:feast-hall":{x:.50,y:.82},           // central wedding-feast hall
    "table:feast":{x:.50,y:.82},
    "krater:mixing":{x:.50,y:.80},
    "zone:bathing":{x:.11,y:.58},              // bathing-room niche, back-left
    "basin:bath":{x:.11,y:.66},
    "zone:stable":{x:.87,y:.86},               // stable stalls, front-right
    "manger:stable":{x:.87,y:.90},
    "seat:guest-l1":{x:.24,y:.74}, "seat:guest-l2":{x:.20,y:.82}, "seat:guest-l3":{x:.16,y:.92},
    "seat:guest-r1":{x:.76,y:.74}, "seat:guest-r2":{x:.80,y:.82}, "seat:guest-r3":{x:.84,y:.92},
    "treasure:tripod-a":{x:.14,y:.66}, "treasure:tripod-b":{x:.30,y:.66},
    "treasure:tripod-c":{x:.70,y:.66}, "treasure:tripod-d":{x:.86,y:.66},
    "entrance:gate":{x:.50,y:.68}, "exit:foreground":{x:.50,y:.98},
    "camera:wide":{x:.50,y:.50}, "camera:feast":{x:.50,y:.80}, "camera:gate":{x:.50,y:.58},
  },
  // walkable ground regions for scene placement / pathing
  zones:{
    walkable:{ x0:.06,y0:.72,x1:.94,y1:.98 },
    feastzone:{ x0:.34,y0:.80,x1:.66,y1:.96 },
    aislezone:{ x0:.42,y0:.70,x1:.58,y1:.98 },
    bathzone:{ x0:.05,y0:.58,x1:.18,y1:.74 },
    stablezone:{ x0:.76,y0:.78,x1:.98,y1:.98 },
  },
  states:{
    initial:"wedding-feast",
    nodes:{
      "wedding-feast":{ preview:{ layers:["roof","backwall","gate","floor","colonnade","tripods","seats","bath","stable","feast"] } },
      "hall-set":{ preview:{ layers:["roof","backwall","gate","floor","colonnade","tripods","seats","feast"] } },
      "guests-only":{ preview:{ layers:["roof","backwall","gate","floor","colonnade","tripods","seats"] } },
      empty:{ preview:{ layers:["roof","backwall","gate","floor","colonnade","tripods"] } },
    },
    edges:[["wedding-feast","hall-set"],["hall-set","guests-only"],["guests-only","empty"]],
  },
  channels:["reveal","camera","light"],

  preview:()=>({ layers:["roof","backwall","gate","floor","colonnade","tripods","seats","bath","stable","feast"], status:"LUMINOUS", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
