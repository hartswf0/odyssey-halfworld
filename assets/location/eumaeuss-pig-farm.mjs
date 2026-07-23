/* location.eumaeuss-pig-farm — Eumaeus's remote hilltop steading.
   LOCATION asset. An EMPTY navigable set drawn in SOLID grays + hard contour
   into the offscreen ctx (the engine dotify pass supplies the halftone).
   Declares depth layers (fg yard / mid pens / bg hills), walkable zones,
   gate/spring entrances, placement + camera anchors, and alternate states.
   Do NOT bake characters in.
   Atlas: OD-B14-S01 — stockade yard, stone hut, pig pens, sleeping lean-tos,
   spring path, gate, dog range, fire, visitor's seat. */
import { makePen, toneSolid, inkLevel, INK, ACCENT } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.46,      // hill crest / sky-ground split as fraction of H
  penRows:3,         // rows of pig pens in the mid ground
  penCols:4,         // pens per row
  fireLit:true,      // hearth in the yard
  gateOpen:false,    // stockade gate state
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const layers = st.layers || ["sky","hills","stockade","hut","pens","leantos","spring","dograng","fire","seat","yard","anchors"];
  const has = l => layers.includes(l);
  const gateOpen = st.gateOpen ?? params.gateOpen;
  const fireLit  = st.fireLit ?? params.fireLit;

  // ---- SKY (lightest tone -> sparse dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  }

  // ---- BACKGROUND HILLS (remote hilltop — receding ridges) ----
  if (has("hills")){
    // far ridge
    pen.paint(()=>{
      g.moveTo(0, horizon*0.74);
      g.quadraticCurveTo(W*0.26, horizon*0.52, W*0.52, horizon*0.70);
      g.quadraticCurveTo(W*0.78, horizon*0.86, W, horizon*0.60);
      g.lineTo(W, horizon); g.lineTo(0, horizon); g.closePath();
    }, toneSolid(inkLevel(2)), 4);
    // near ridge (the steading's own hilltop)
    pen.paint(()=>{
      g.moveTo(0, horizon);
      g.quadraticCurveTo(W*0.34, horizon*0.80, W*0.62, horizon*0.96);
      g.quadraticCurveTo(W*0.82, horizon*1.06, W, horizon*0.88);
      g.lineTo(W, horizon+2); g.lineTo(0, horizon+2); g.closePath();
    }, toneSolid(inkLevel(3)), 4);
  }

  // ---- FOREGROUND YARD ground (light so it reads as trodden earth) ----
  if (has("yard")){
    g.fillStyle = inkLevel(2); g.fillRect(0, horizon, W, H-horizon);
    // scuffed ground contour lines fanning across the yard
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
    for(let j=1;j<=4;j++){
      const y = horizon + (H-horizon)*(j/4.4)*(j/4.4);
      g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- STOCKADE FENCE (the enclosing palisade — posts ring the yard) ----
  if (has("stockade")){
    const fy = horizon + (H-horizon)*0.10;   // fence line sits just inside the crest
    const postH = (H-horizon)*0.20, postW = W*0.016;
    const n = 15;
    // back rail
    pen.ink(()=>{ g.moveTo(W*0.04, fy); g.lineTo(W*0.96, fy); }, 3);
    for(let i=0;i<=n;i++){
      const t=i/n, x=W*0.05 + t*W*0.90;
      // leave a gap where the gate is (centre-left)
      const gate = t>0.30 && t<0.44;
      if (gate) continue;
      const ph = postH*(0.9+0.2*((i%3)/2));  // uneven rough stakes
      pen.paint(()=>{
        g.moveTo(x-postW/2, fy);
        g.lineTo(x-postW/2, fy-ph);
        g.lineTo(x, fy-ph-postW*0.7);        // sharpened tip
        g.lineTo(x+postW/2, fy-ph);
        g.lineTo(x+postW/2, fy);
        g.closePath();
      }, toneSolid(inkLevel(i%2?4:5)), 3);
    }
  }

  // ---- GATE in the stockade ----
  if (has("stockade")){
    const fy = horizon + (H-horizon)*0.10;
    const gx0 = W*0.05 + 0.31*W*0.90, gx1 = W*0.05 + 0.43*W*0.90;
    const gh = (H-horizon)*0.20;
    // two gateposts
    for(const gx of [gx0,gx1]){
      pen.paint(()=>{ g.rect(gx-W*0.010, fy-gh*1.15, W*0.020, gh*1.15); }, toneSolid(inkLevel(6)), 3);
    }
    // lintel
    pen.paint(()=>{ g.rect(gx0-W*0.010, fy-gh*1.15, (gx1-gx0)+W*0.020, gh*0.16); }, toneSolid(inkLevel(6)), 3);
    // the gate leaf (swung open = angled aside, closed = filling the span)
    if (gateOpen){
      pen.paint(()=>{
        g.moveTo(gx0, fy); g.lineTo(gx0 - W*0.06, fy - gh*0.28);
        g.lineTo(gx0 - W*0.06, fy - gh*0.98); g.lineTo(gx0, fy - gh*0.86);
        g.closePath();
      }, toneSolid(inkLevel(4)), 3);
    } else {
      pen.paint(()=>{ g.rect(gx0, fy-gh*0.92, gx1-gx0, gh*0.92); }, toneSolid(inkLevel(3)), 3);
      pen.ink(()=>{ g.moveTo(gx0,fy-gh*0.92); g.lineTo(gx1,fy-gh*0.20);
                    g.moveTo(gx1,fy-gh*0.92); g.lineTo(gx0,fy-gh*0.20); }, 2); // X-bracing
    }
  }

  // ---- STONE HUT (rough dry-stone dwelling, back-right of the yard) ----
  if (has("hut")){
    const hx=W*0.70, hy=horizon+(H-horizon)*0.44, hw=W*0.24, hh=(H-horizon)*0.40;
    // gable body
    pen.paint(()=>{ g.rect(hx-hw/2, hy-hh, hw, hh); }, toneSolid(inkLevel(4)), 5);
    // thatched roof
    pen.paint(()=>{
      g.moveTo(hx-hw*0.60, hy-hh);
      g.lineTo(hx, hy-hh*1.52);
      g.lineTo(hx+hw*0.60, hy-hh);
      g.closePath();
    }, toneSolid(inkLevel(6)), 5);
    // stone courses on the wall
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let i=1;i<4;i++){ const y=hy-hh + hh*(i/4); g.beginPath(); g.moveTo(hx-hw/2,y); g.lineTo(hx+hw/2,y); g.stroke(); }
    for(let i=0;i<3;i++){ const x=hx-hw/2 + hw*((i+0.5)/3); g.beginPath(); g.moveTo(x,hy-hh); g.lineTo(x,hy-hh+hh*0.5); g.stroke(); }
    g.globalAlpha=1;
    // low doorway (dark)
    pen.paint(()=>{ g.rect(hx-hw*0.14, hy-hh*0.5, hw*0.28, hh*0.5); }, toneSolid(inkLevel(7)), 4);
  }

  // ---- PIG PENS (rows of low fenced enclosures, mid-ground, left of hut) ----
  if (has("pens")){
    const rows=params.penRows, cols=params.penCols;
    const px0=W*0.05, pz0=horizon+(H-horizon)*0.26;
    const bandW=W*0.50, bandH=(H-horizon)*0.44;
    for(let r=0;r<rows;r++){
      const depth = r/rows;                 // 0 far .. near
      const y = pz0 + depth*bandH*0.9;
      const cellW = bandW*(0.78+depth*0.24)/cols;
      const railH = (H-horizon)*0.085*(0.7+depth*0.6);
      const x0 = px0 + (1-(0.78+depth*0.24))*bandW*0.2;
      for(let c=0;c<cols;c++){
        const cx = x0 + c*cellW;
        // pen floor patch (muddy — mid tone)
        pen.paint(()=>{ g.rect(cx+cellW*0.06, y-railH*0.2, cellW*0.86, railH*1.0); }, toneSolid(inkLevel(3)), 2);
        // front rail (two bars + posts)
        pen.paint(()=>{ g.rect(cx+cellW*0.04, y+railH*0.6, cellW*0.90, railH*0.14); }, toneSolid(inkLevel(5)), 2);
        pen.ink(()=>{ g.moveTo(cx+cellW*0.06, y+railH*0.30); g.lineTo(cx+cellW*0.94, y+railH*0.30); }, 2);
        // corner posts
        for(const pxp of [cx+cellW*0.06, cx+cellW*0.94]){
          pen.paint(()=>{ g.rect(pxp-cellW*0.03, y-railH*0.3, cellW*0.06, railH*1.1); }, toneSolid(inkLevel(6)), 2);
        }
      }
    }
  }

  // ---- SLEEPING LEAN-TOS (rough shelters against the fence, far-left) ----
  if (has("leantos")){
    const n=2, ly=horizon+(H-horizon)*0.20, lw=W*0.095, lh=(H-horizon)*0.17;
    for(let i=0;i<n;i++){
      const lx = W*0.065 + i*W*0.105;
      const yy = ly + i*(H-horizon)*0.035;
      // sloped roof plane (open shelter — mid tone so it stays legible)
      pen.paint(()=>{
        g.moveTo(lx, yy);
        g.lineTo(lx+lw, yy-lh*0.55);
        g.lineTo(lx+lw, yy-lh*0.05);
        g.lineTo(lx, yy+lh*0.5);
        g.closePath();
      }, toneSolid(inkLevel(4)), 3);
      // dark shaded interior beneath the slope
      pen.paint(()=>{ g.rect(lx+lw*0.12, yy-lh*0.05, lw*0.5, lh*0.42); }, toneSolid(inkLevel(6)), 2);
      // tall support post
      pen.ink(()=>{ g.moveTo(lx+lw, yy-lh*0.55); g.lineTo(lx+lw, yy+lh*0.55); }, 3);
      pen.ink(()=>{ g.moveTo(lx, yy+lh*0.5); g.lineTo(lx, yy+lh*0.8); }, 3);
    }
  }

  // ---- SPRING PATH (a trodden path leading off toward the water source) ----
  if (has("spring")){
    const sx=W*0.16, sy=H*0.98;
    g.strokeStyle=inkLevel(4); g.lineWidth=W*0.045; g.lineCap="round";
    g.globalAlpha=0.9;
    g.beginPath();
    g.moveTo(sx, sy);
    g.quadraticCurveTo(W*0.02, horizon+(H-horizon)*0.55, W*0.03, horizon+(H-horizon)*0.30);
    g.stroke();
    g.globalAlpha=1;
    // path edge stones
    g.fillStyle=inkLevel(5);
    for(let i=0;i<5;i++){ const t=i/5;
      const yy = sy + (horizon+(H-horizon)*0.35 - sy)*t;
      const xx = sx + (W*0.03 - sx)*t;
      g.beginPath(); g.arc(xx - W*0.03, yy, W*0.010,0,7); g.fill();
    }
    // little spring basin at the head of the path
    pen.paint(()=>{ g.ellipse(W*0.035, horizon+(H-horizon)*0.26, W*0.035, (H-horizon)*0.02,0,0,7); }, toneSolid(inkLevel(6)), 3);
  }

  // ---- DOG RANGE (a staked run where the guard dogs are kept, front-right) ----
  if (has("dograng")){
    const dx0=W*0.62, dx1=W*0.96, dy=H*0.90;
    // ground patch
    g.fillStyle=inkLevel(3);
    g.beginPath(); g.ellipse((dx0+dx1)/2, dy, (dx1-dx0)/2, (H-horizon)*0.05,0,0,7); g.fill();
    // stakes with a slack tether line between them
    const stakes=[dx0, (dx0+dx1)/2, dx1];
    for(const sx of stakes){
      pen.paint(()=>{ g.rect(sx-W*0.006, dy-(H-horizon)*0.10, W*0.012, (H-horizon)*0.10); }, toneSolid(inkLevel(6)), 2);
    }
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.7;
    g.beginPath();
    g.moveTo(dx0, dy-(H-horizon)*0.09);
    g.quadraticCurveTo((dx0+dx1)/2, dy-(H-horizon)*0.03, dx1, dy-(H-horizon)*0.09);
    g.stroke(); g.globalAlpha=1;
  }

  // ---- FIRE / HEARTH (a ring of stones with the yard fire, centre-front) ----
  if (has("fire")){
    const fx=W*0.44, fy=H*0.83, fr=W*0.055;
    // stone ring
    for(let i=0;i<8;i++){ const a=i/8*Math.PI*2;
      pen.paint(()=>{ g.ellipse(fx+Math.cos(a)*fr, fy+Math.sin(a)*fr*0.5, fr*0.22, fr*0.16,0,0,7); }, toneSolid(inkLevel(5)), 2);
    }
    if (fireLit){
      // logs
      pen.ink(()=>{ g.moveTo(fx-fr*0.5, fy+fr*0.1); g.lineTo(fx+fr*0.5, fy-fr*0.1); }, 4);
      pen.ink(()=>{ g.moveTo(fx-fr*0.5, fy-fr*0.1); g.lineTo(fx+fr*0.5, fy+fr*0.1); }, 4);
      // flame (solid dark tongue — dotify carries the texture)
      pen.paint(()=>{
        g.moveTo(fx-fr*0.35, fy);
        g.quadraticCurveTo(fx-fr*0.2, fy-fr*0.9, fx, fy-fr*1.4);
        g.quadraticCurveTo(fx+fr*0.15, fy-fr*0.7, fx+fr*0.35, fy);
        g.quadraticCurveTo(fx, fy+fr*0.2, fx-fr*0.35, fy);
      }, toneSolid(inkLevel(6)), 3);
      // smoke wisp
      g.strokeStyle=inkLevel(3); g.lineWidth=3; g.globalAlpha=0.6;
      g.beginPath();
      g.moveTo(fx, fy-fr*1.4);
      g.quadraticCurveTo(fx+fr*0.4, fy-fr*2.2, fx-fr*0.2, fy-fr*3.0);
      g.stroke(); g.globalAlpha=1;
    }
  }

  // ---- VISITOR'S SEAT (a rough bench / brushwood pile by the door, front) ----
  if (has("seat")){
    const bx=W*0.60, by=H*0.86, bw=W*0.13, bh=(H-horizon)*0.09;
    // seat slab
    pen.paint(()=>{ g.rect(bx-bw/2, by-bh, bw, bh*0.4); }, toneSolid(inkLevel(5)), 3);
    // legs
    pen.paint(()=>{ g.rect(bx-bw*0.42, by-bh*0.6, bw*0.10, bh*0.9); }, toneSolid(inkLevel(6)), 2);
    pen.paint(()=>{ g.rect(bx+bw*0.32, by-bh*0.6, bw*0.10, bh*0.9); }, toneSolid(inkLevel(6)), 2);
    // a fleece/brush heap draped on it
    pen.paint(()=>{ g.ellipse(bx, by-bh*1.05, bw*0.42, bh*0.30,0,0,7); }, toneSolid(inkLevel(3)), 3);
  }
}

export const asset = {
  id:"location.eumaeuss-pig-farm",
  type:"LOCATION",
  name:"Eumaeus's Pig Farm",
  statusWord:"REMOTE",
  scene:"OD-B14-S01",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","hills","stockade","hut","pens","leantos","spring","dograng","fire","seat","yard","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "gate":{x:.35,y:.62},
    "hut:door":{x:.70,y:.80},
    "hearth":{x:.44,y:.83},
    "seat:visitor":{x:.60,y:.85},
    "spring:head":{x:.04,y:.62},
    "spring:path":{x:.14,y:.92},
    "dog:range":{x:.79,y:.90},
    "pen:a":{x:.14,y:.66}, "pen:b":{x:.30,y:.72}, "pen:c":{x:.24,y:.82},
    "leanto:a":{x:.10,y:.66},
    "yard:centre":{x:.44,y:.74},
    "camera:wide":{x:.50,y:.52}, "camera:yard":{x:.46,y:.72}, "camera:door":{x:.66,y:.74},
  },
  // walkable ground region (for scene placement / pathing)
  zones:{
    walkable:{ x0:.06,y0:.62,x1:.96,y1:.98 },
    yard:{ x0:.30,y0:.70,x1:.72,y1:.94 },
    pens:{ x0:.06,y0:.62,x1:.56,y1:.90 },
    threshold_gate:{ x0:.31,y0:.55,x1:.44,y1:.66 },
  },
  states:{
    initial:"quiet",
    nodes:{
      quiet:{ preview:{ gateOpen:false, fireLit:true } },
      "gate-open":{ preview:{ gateOpen:true, fireLit:true } },
      "night-cold":{ preview:{ gateOpen:false, fireLit:false,
        layers:["sky","hills","stockade","hut","pens","leantos","spring","dograng","seat","yard"] } },
    },
    edges:[["quiet","gate-open"],["quiet","night-cold"],["gate-open","quiet"]],
  },
  channels:["reveal","camera","gate","fire","light"],

  preview:()=>({ gateOpen:false, fireLit:true, status:"REMOTE", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
