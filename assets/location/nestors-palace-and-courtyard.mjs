/* location.nestors-palace-and-courtyard — the royal compound at sandy Pylos.
   LOCATION asset. An EMPTY navigable exterior set: the courtyard of Nestor's
   palace seen from just inside the outer wall. Back-left the guest-sleeping
   portico with two made-up beds; back-right the polished bathing basin on its
   pedestal; dead-centre the stone sacrifice altar with its horns and fire;
   front-centre the chariot standing yoked for the road, its pole reaching to
   the great gate at the right where the departure road runs out of the
   compound. Palace facade + pediment close the back. Drawn in SOLID grays +
   hard contour; the engine dotify pass supplies the halftone. NO characters
   baked in.
   Atlas: OD-B03-S05 — guest sleeping / bathing / sacrifice / chariot-prep /
   departure zones of a royal compound. */
import { makePen, toneSolid, inkLevel, INK } from "/engine/halfworld-engine.mjs";

const params = {
  floorLevel:0.68,     // courtyard ground horizon as fraction of H
  porticoCols:4,       // columns of the guest-sleeping portico (back-left)
  altarSteps:3,        // stepped base of the sacrifice altar
  chariotSpokes:8,     // spokes per chariot wheel
  gate:true,           // outer gate + departure road at right edge
  pediment:true,       // gabled roof over the facade
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const wallTop = horizon - H*0.38;
  const layers = st.layers || ["sky","facade","floor","portico","guestbeds","bath","altar","chariot","gate"];
  const has = l => layers.includes(l);

  // ---- SKY over the compound (lightest tone) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  }

  // ---- PALACE FACADE across the back (light structural stone) ----
  if (has("facade")){
    pen.paint(()=>{ g.rect(W*0.05, wallTop, W*0.90, horizon-wallTop); }, toneSolid(inkLevel(2)), 5);
    // cornice beam
    pen.paint(()=>{ g.rect(W*0.05, wallTop, W*0.90, H*0.024); }, toneSolid(inkLevel(3)), 4);
    // gabled pediment over the centre of the facade
    if (params.pediment){
      pen.paint(()=>{
        g.moveTo(W*0.32, wallTop);
        g.lineTo(W*0.50, wallTop-H*0.09);
        g.lineTo(W*0.68, wallTop);
        g.closePath();
      }, toneSolid(inkLevel(2)), 5);
    }
    // faint masonry courses
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.18;
    for(let j=1;j<=4;j++){ const y=wallTop+(horizon-wallTop)*(j/5); g.beginPath(); g.moveTo(W*0.05,y); g.lineTo(W*0.95,y); g.stroke(); }
    g.globalAlpha=1;
    // central megaron doorway (dark passage into the hall)
    pen.paint(()=>{ g.rect(W*0.455, horizon-H*0.22, W*0.09, H*0.22); }, toneSolid(inkLevel(6)), 5);
    pen.paint(()=>{ g.rect(W*0.445, horizon-H*0.235, W*0.11, H*0.018); }, toneSolid(inkLevel(4)), 4); // lintel
  }

  // ---- COURTYARD FLOOR (drawn early so foreground props sit on top) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
    const vx=W*0.50, vy=horizon;
    for(let i=-5;i<=5;i++){ g.beginPath(); g.moveTo(vx, vy); g.lineTo(W*(0.5+i*0.16), H); g.stroke(); }
    for(let j=1;j<=4;j++){ const y=horizon+(H-horizon)*(j/4)*(j/4); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- GUEST-SLEEPING PORTICO (back-left colonnade) ----
  if (has("portico")){
    const n=params.porticoCols, x0=W*0.09, x1=W*0.34, top=horizon-H*0.28, bot=horizon-H*0.005;
    // portico roof beam carried by the columns
    pen.paint(()=>{ g.rect(x0-W*0.025, top-H*0.018, (x1-x0)+W*0.06, H*0.026); }, toneSolid(inkLevel(4)), 5);
    for(let i=0;i<n;i++){
      const t=n>1?i/(n-1):0.5;
      const cx=x0 + (x1-x0)*t, cw=W*0.026;
      pen.paint(()=>{ g.rect(cx-cw/2, top, cw, bot-top); }, toneSolid(inkLevel(3)), 4);          // shaft
      pen.paint(()=>{ g.rect(cx-cw*0.85, top, cw*1.7, H*0.014); }, toneSolid(inkLevel(5)), 3);   // capital
      pen.paint(()=>{ g.rect(cx-cw*0.75, bot-H*0.012, cw*1.5, H*0.012); }, toneSolid(inkLevel(4)), 3); // base
    }
  }

  // ---- GUEST BEDS made up under the portico (two low sleeping frames) ----
  if (has("guestbeds")){
    const beds=[{x:W*0.155,y:horizon+H*0.02},{x:W*0.285,y:horizon+H*0.06}];
    for(const b of beds){
      const bw=W*0.12, bh=H*0.028;
      pen.paint(()=>{ g.rect(b.x-bw/2, b.y-bh, bw, bh); }, toneSolid(inkLevel(3)), 4);            // mattress platform
      pen.paint(()=>{ g.ellipse(b.x-bw*0.34, b.y-bh-H*0.008, bw*0.16, H*0.016, 0,0,7); }, toneSolid(inkLevel(6)), 3); // bolster pillow
      pen.paint(()=>{ g.rect(b.x-bw/2, b.y, bw*0.05, H*0.018); }, toneSolid(inkLevel(5)), 2);      // leg
      pen.paint(()=>{ g.rect(b.x+bw/2-bw*0.05, b.y, bw*0.05, H*0.018); }, toneSolid(inkLevel(5)), 2);// leg
      pen.seam(()=>{ g.moveTo(b.x-bw*0.14,b.y-bh); g.lineTo(b.x+bw*0.30,b.y-bh*0.3); }, 2);        // blanket fold
    }
  }

  // ---- BATHING BASIN on its pedestal (back-right, polished tub) ----
  if (has("bath")){
    const bx=W*0.78, by=horizon-H*0.05, bw=W*0.15;
    pen.paint(()=>{ g.rect(bx-bw*0.22, by, bw*0.44, H*0.055); }, toneSolid(inkLevel(4)), 4);       // pedestal
    pen.paint(()=>{ g.ellipse(bx, by, bw*0.5, H*0.03, 0,0,7); }, toneSolid(inkLevel(3)), 5);       // basin bowl
    pen.paint(()=>{ g.ellipse(bx, by-H*0.006, bw*0.38, H*0.02, 0,0,7); }, toneSolid(inkLevel(5)), 3); // water (darker inside)
    g.strokeStyle=inkLevel(0); g.lineWidth=2; g.globalAlpha=0.5;                                   // light ripple mark
    g.beginPath(); g.ellipse(bx, by-H*0.008, bw*0.22, H*0.012, 0,0,7); g.stroke();
    g.globalAlpha=1;
  }

  // ---- SACRIFICE ALTAR dead-centre (stepped stone with horns + fire) ----
  if (has("altar")){
    const ax=W*0.50, base=horizon+H*0.075, n=params.altarSteps;
    for(let i=0;i<n;i++){                                                                          // stepped base (light, edges read)
      const t=i/n, sw=W*0.19*(1-t*0.34), sh=H*0.026;
      const y=base - i*sh;
      pen.paint(()=>{ g.rect(ax-sw/2, y-sh, sw, sh); }, toneSolid(inkLevel(2+ (i%2))), 4);
    }
    const tblW=W*0.13, tblY=base-n*H*0.026;
    pen.paint(()=>{ g.rect(ax-tblW/2, tblY-H*0.05, tblW, H*0.05); }, toneSolid(inkLevel(4)), 5);    // altar block
    // horns of consecration at the two upper corners
    for(const s of [-1,1]){
      pen.paint(()=>{ g.moveTo(ax+s*tblW*0.44, tblY-H*0.05);
        g.quadraticCurveTo(ax+s*tblW*0.64, tblY-H*0.105, ax+s*tblW*0.32, tblY-H*0.085);
        g.quadraticCurveTo(ax+s*tblW*0.42, tblY-H*0.058, ax+s*tblW*0.44, tblY-H*0.05);
      }, toneSolid(inkLevel(6)), 3);
    }
    // sacrificial fire on the altar table
    g.fillStyle=inkLevel(7);
    for(let k=-1;k<=1;k++){ g.beginPath();
      g.moveTo(ax+k*W*0.022-W*0.008, tblY-H*0.05);
      g.lineTo(ax+k*W*0.022, tblY-H*0.05-H*0.042);
      g.lineTo(ax+k*W*0.022+W*0.008, tblY-H*0.05); g.closePath(); g.fill(); }
  }

  // ---- CHARIOT yoked for the road (front-centre, departure prep) ----
  if (has("chariot")){
    const wy=horizon+H*0.15, r=W*0.058, wx1=W*0.60, wx2=W*0.73; // two wheels, side view
    const wheel=(wx)=>{
      pen.paint(()=>{ g.arc(wx, wy, r, 0,7); }, toneSolid(inkLevel(4)), 5);                        // rim/tyre
      g.strokeStyle=INK; g.lineWidth=3;                                                            // spokes
      for(let s=0;s<params.chariotSpokes;s++){ const a=s/params.chariotSpokes*Math.PI*2;
        g.beginPath(); g.moveTo(wx+Math.cos(a)*r*0.2, wy+Math.sin(a)*r*0.2);
        g.lineTo(wx+Math.cos(a)*r*0.86, wy+Math.sin(a)*r*0.86); g.stroke(); }
      pen.paint(()=>{ g.arc(wx, wy, r*0.18, 0,7); }, toneSolid(inkLevel(7)), 3);                   // hub
    };
    wheel(wx2);                                                                                    // far wheel
    // car box (the standing platform) between the wheels
    pen.paint(()=>{ g.moveTo(wx1-r*0.7, wy-r*0.1);
      g.lineTo(wx2+r*0.35, wy-r*0.1); g.lineTo(wx2+r*0.35, wy-r*0.95);
      g.quadraticCurveTo((wx1+wx2)/2, wy-r*1.35, wx1-r*0.7, wy-r*0.95); g.closePath();
    }, toneSolid(inkLevel(5)), 5);
    wheel(wx1);                                                                                    // near wheel over the car
    // draught pole + yoke reaching right toward the gate
    pen.ink(()=>{ g.moveTo(wx2+r*0.2, wy-r*0.05); g.lineTo(W*0.85, wy-r*0.4); }, 5);
    pen.paint(()=>{ g.rect(W*0.845, wy-r*0.7, W*0.018, H*0.045); }, toneSolid(inkLevel(6)), 3);     // yoke bar
  }

  // ---- GATE + DEPARTURE ROAD (right edge, out of the compound) ----
  if (has("gate") && params.gate){
    const gtop=wallTop+H*0.05, gbot=horizon+H*0.10;
    pen.paint(()=>{ g.rect(W*0.955, gtop, W*0.04, gbot-gtop); }, toneSolid(inkLevel(5)), 5);        // near gatepost
    pen.paint(()=>{ g.rect(W*0.80, gtop, W*0.035, gbot-gtop); }, toneSolid(inkLevel(5)), 5);        // far gatepost
    pen.paint(()=>{ g.rect(W*0.80, gtop, W*0.195, H*0.045); }, toneSolid(inkLevel(5)), 5);          // lintel beam
    // the departure road glimpsed through the open gate (bright light beyond)
    pen.paint(()=>{ g.rect(W*0.835, gtop+H*0.045, W*0.12, gbot-gtop-H*0.045); }, toneSolid(inkLevel(1)), 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;                                           // road recession
    g.beginPath(); g.moveTo(W*0.855, gbot); g.lineTo(W*0.875, gtop+H*0.055); g.stroke();
    g.beginPath(); g.moveTo(W*0.945, gbot); g.lineTo(W*0.925, gtop+H*0.055); g.stroke();
    g.globalAlpha=1;
    // stone threshold slab at the gate foot
    pen.paint(()=>{ g.rect(W*0.795, horizon+H*0.10, W*0.20, H*0.04); }, toneSolid(inkLevel(4)), 4);
  }
}

export const asset = {
  id:"location.nestors-palace-and-courtyard",
  type:"LOCATION",
  name:"Nestor's Palace and Courtyard",
  statusWord:"HOSPITABLE",
  scene:"OD-B03-S05",

  params,
  // back -> front draw order; floor early so foreground props sit on it.
  // scene state may pass a subset of these.
  layers:["sky","facade","floor","portico","guestbeds","bath","altar","chariot","gate"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "door:megaron":{x:.50,y:.60},            // palace hall doorway in the facade
    "zone:guest-sleeping":{x:.20,y:.72},     // portico beds, back-left
    "bed:guest-a":{x:.155,y:.72},
    "bed:guest-b":{x:.285,y:.76},
    "zone:bathing":{x:.78,y:.63},            // basin on its pedestal, back-right
    "basin:bath":{x:.78,y:.63},
    "zone:sacrifice":{x:.50,y:.76},          // altar, dead-centre courtyard
    "altar:fire":{x:.50,y:.66},
    "zone:chariot-prep":{x:.66,y:.86},       // chariot standing yoked, front-centre
    "chariot:car":{x:.66,y:.82},
    "chariot:yoke":{x:.85,y:.80},
    "zone:departure":{x:.88,y:.82},          // gate + road out, right edge
    "gate:outer":{x:.88,y:.66},
    "threshold:gate":{x:.88,y:.83},
    "entrance:gate":{x:.88,y:.74}, "exit:megaron":{x:.50,y:.60},
    "camera:wide":{x:.50,y:.50}, "camera:altar":{x:.50,y:.68}, "camera:chariot":{x:.70,y:.74},
  },
  // walkable ground regions for scene placement / pathing
  zones:{
    walkable:{ x0:.04,y0:.70,x1:.96,y1:.98 },
    sleepzone:{ x0:.07,y0:.70,x1:.36,y1:.86 },
    bathzone:{ x0:.68,y0:.58,x1:.90,y1:.72 },
    sacrificezone:{ x0:.38,y0:.66,x1:.62,y1:.86 },
    chariotzone:{ x0:.48,y0:.76,x1:.80,y1:.96 },
    departzone:{ x0:.78,y0:.72,x1:.98,y1:.96 },
  },
  states:{
    initial:"morning-prep",
    nodes:{
      "morning-prep":{ preview:{ layers:["sky","facade","floor","portico","guestbeds","bath","altar","chariot","gate"] } },
      "beds-struck":{ preview:{ layers:["sky","facade","floor","portico","bath","altar","chariot","gate"] } },
      "sacrifice":{ preview:{ layers:["sky","facade","floor","portico","bath","altar","gate"] } },
      "departure":{ preview:{ layers:["sky","facade","floor","portico","altar","chariot","gate"] } },
      empty:{ preview:{ layers:["sky","facade","floor","portico","altar","gate"] } },
    },
    edges:[["morning-prep","beds-struck"],["beds-struck","sacrifice"],["sacrifice","departure"],["departure","empty"]],
  },
  channels:["reveal","camera","light","fire"],

  preview:()=>({ layers:["sky","facade","floor","portico","guestbeds","bath","altar","chariot","gate"], status:"HOSPITABLE", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
