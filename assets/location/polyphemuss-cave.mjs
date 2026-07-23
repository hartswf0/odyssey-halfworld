/* location.polyphemuss-cave — the Cyclops's colossal vaulted cavern (INTERIOR).
   LOCATION asset for OD-B09-S05. An EMPTY navigable GIANT-SCALE set drawn in
   SOLID grays + hard contour into the offscreen ctx (the engine dotify pass
   supplies the halftone). Interior view: a great vaulted rock ceiling arcing
   overhead; a huge arched entrance-mouth punched in the back wall (daylight
   beyond) with the giant's door-boulder resting beside it; a central stone
   fire-ring; tall cheese racks stacked with round cheeses along the left wall;
   a line of milk pails across the mid floor; stone-walled animal pens on the
   right divided by age (lambs / kids); the giant's raised sleeping-ledge at
   back-left; shadowy recesses in the deep corners. NO baked characters —
   anchors + zones only. Matches the reference CAVE INTERIOR + CHEESE RACK cards. */
import { makePen, toneSolid, inkLevel, INK, clamp } from "/engine/halfworld-engine.mjs";

const params = {
  vaultPeak:0.06,      // ceiling apex as fraction of H (high = tall vault)
  vaultSpring:0.30,    // where the vault meets the side walls
  floorLevel:0.66,     // cavern floor / back-wall base as fraction of H
  cheeseRows:4,        // shelves on the cheese rack
  cheesePerRow:4,
  pails:5,             // milk pails in the line
  penDivs:3,           // pens: lamb / kid / newborn compartments
  boulder:true,        // the door-stone beside the mouth
};

/* an arched opening path: flat sill, straight jambs, round crown */
function archPath(g, cx, sillY, w, h){
  const half=w/2, springY=sillY-h*0.62;
  g.moveTo(cx-half, sillY);
  g.lineTo(cx-half, springY);
  g.quadraticCurveTo(cx-half, sillY-h, cx, sillY-h);
  g.quadraticCurveTo(cx+half, sillY-h, cx+half, springY);
  g.lineTo(cx+half, sillY);
  g.closePath();
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const t = st.t || 0;
  const floor = H*params.floorLevel;
  const spring = H*params.vaultSpring;
  const peak = H*params.vaultPeak;
  const layers = st.layers || ["recesses","vault","backwall","entrance","boulder","sleeping",
                               "floor","cheese","pens","pails","fire","anchors"];
  const has = l => layers.includes(l);
  const sealed = !!st.sealed;

  // ---- DEEP RECESSES: dark pockets in the back corners (drawn first, behind all) ----
  if (has("recesses")){
    g.fillStyle=inkLevel(7);
    g.beginPath(); g.moveTo(0,spring); g.lineTo(W*0.14,spring); g.lineTo(0,floor); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(W,spring); g.lineTo(W*0.86,spring); g.lineTo(W,floor); g.closePath(); g.fill();
    g.fillStyle=inkLevel(6);
    g.beginPath(); g.ellipse(W*0.06, floor*0.9, W*0.10, H*0.10, 0,0,7); g.fill();
    g.beginPath(); g.ellipse(W*0.94, floor*0.9, W*0.10, H*0.10, 0,0,7); g.fill();
  }

  // ---- VAULTED CEILING: great rock arch spanning the width, hanging overhead ----
  if (has("vault")){
    pen.paint(()=>{
      g.moveTo(0,0); g.lineTo(W,0);
      g.lineTo(W,spring);
      g.quadraticCurveTo(W*0.5, peak, 0, spring);
      g.closePath();
    }, toneSolid(inkLevel(4)), 6);
    // concentric vault ribs following the underside arc
    for(let i=1;i<=3;i++){
      const d=i*H*0.045;
      pen.seam(()=>{ g.moveTo(W*0.02, spring-d*0.2);
        g.quadraticCurveTo(W*0.5, peak+d, W*0.98, spring-d*0.2); }, 3);
    }
    // stalactite teeth hanging from the underside arc (clean triangles)
    for(let i=0;i<6;i++){ const x=W*(0.20+i*0.12);
      const uy = peak + (spring-peak)*Math.pow((x-W*0.5)/(W*0.5),2);
      const len = H*0.04*(0.7+0.5*((i*7)%3));
      pen.paint(()=>{ g.moveTo(x-W*0.018, uy-2); g.lineTo(x+W*0.018, uy-2);
        g.lineTo(x, uy+len); g.closePath(); }, toneSolid(inkLevel(5)), 3); }
  }

  // ---- BACK WALL between the side walls, from vault spring down to floor ----
  if (has("backwall")){
    pen.paint(()=>{ g.rect(0, spring-H*0.005, W, floor-spring+H*0.01); }, toneSolid(inkLevel(3)), 5);
    // side wall strips (darker, to frame the giant interior)
    pen.paint(()=>{ g.rect(0, spring, W*0.10, floor-spring); }, toneSolid(inkLevel(5)), 4);
    pen.paint(()=>{ g.rect(W*0.90, spring, W*0.10, floor-spring); }, toneSolid(inkLevel(5)), 4);
    // rough strata seams across the back wall
    pen.seam(()=>{ g.moveTo(W*0.10, spring+H*0.06); g.quadraticCurveTo(W*0.5, spring+H*0.04, W*0.90, spring+H*0.07); }, 3);
    pen.seam(()=>{ g.moveTo(W*0.10, spring+H*0.14); g.quadraticCurveTo(W*0.5, spring+H*0.16, W*0.90, spring+H*0.13); }, 3);
  }

  // ---- GREAT ARCHED ENTRANCE punched in the back wall (daylight beyond) ----
  if (has("entrance")){
    const mx=W*0.50, mw=W*0.26, mh=(floor-spring)*0.92, sill=floor;
    if (sealed){
      // door-boulder rolled across the mouth: dark stone plug
      pen.paint(()=>{ archPath(g, mx, sill, mw, mh); }, toneSolid(inkLevel(6)), 6);
      pen.paint(()=>{ g.ellipse(mx, sill-mh*0.55, mw*0.52, mh*0.52, 0,0,7); }, toneSolid(inkLevel(6)), 6);
    } else {
      // open mouth: bright daylight (near-paper) framed by a thick stone jamb
      pen.paint(()=>{ archPath(g, mx, sill, mw*1.16, mh*1.06); }, toneSolid(inkLevel(4)), 6); // jamb
      pen.paint(()=>{ archPath(g, mx, sill-H*0.004, mw, mh); }, toneSolid(inkLevel(1)), 4);    // sky
      // a distant hill/horizon line inside the opening
      pen.seam(()=>{ g.moveTo(mx-mw*0.5, sill-mh*0.22); g.lineTo(mx+mw*0.5, sill-mh*0.22); }, 2);
      g.fillStyle=inkLevel(3);
      g.beginPath(); g.ellipse(mx, sill-mh*0.18, mw*0.34, mh*0.10, 0,0,7); g.fill();
    }
  }

  // ---- DOOR-BOULDER rolled aside at the mouth-sill (when open) ----
  if (has("boulder") && params.boulder && !sealed){
    const bx=W*0.40, by=floor+H*0.02, br=W*0.085;
    pen.paint(()=>{ g.ellipse(bx, by, br, br*0.92, 0,0,7); }, toneSolid(inkLevel(5)), 6);
    pen.seam(()=>{ g.moveTo(bx-br*0.5, by-br*0.3); g.quadraticCurveTo(bx, by, bx+br*0.4, by+br*0.2); }, 3);
    pen.seam(()=>{ g.moveTo(bx-br*0.2, by-br*0.6); g.lineTo(bx+br*0.1, by-br*0.1); }, 3);
  }

  // ---- GIANT'S SLEEPING-LEDGE against the back wall, right of the mouth ----
  if (has("sleeping")){
    const lx=W*0.66, ly=floor, lw=W*0.21, lh=H*0.20;
    pen.paint(()=>{ g.rect(lx, ly-lh, lw, lh); }, toneSolid(inkLevel(5)), 5);            // stone block
    pen.paint(()=>{ g.rect(lx-W*0.01, ly-lh-H*0.02, lw+W*0.02, H*0.03); }, toneSolid(inkLevel(4)), 5); // slab top / pallet
    // a rolled bolster of skins at the head end
    pen.paint(()=>{ g.ellipse(lx+lw*0.82, ly-lh-H*0.018, W*0.05, H*0.022, 0,0,7); }, toneSolid(inkLevel(6)), 4);
    // block seams
    pen.seam(()=>{ g.moveTo(lx, ly-lh*0.55); g.lineTo(lx+lw, ly-lh*0.55); }, 2);
    pen.seam(()=>{ g.moveTo(lx+lw*0.5, ly-lh); g.lineTo(lx+lw*0.5, ly); }, 2);
  }

  // ---- CAVERN FLOOR (foreground ground plane, lightest so it reads as ground) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,floor,W,H-floor);
    pen.ink(()=>{ g.moveTo(0,floor); g.lineTo(W,floor); }, 3);
    // packed-earth converging scuff lines toward the mouth
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let i=-5;i<=5;i++){ g.beginPath(); g.moveTo(W*0.5, floor); g.lineTo(W*0.5+i*W*0.12, H); g.stroke(); }
    for(let j=1;j<=3;j++){ const y=floor+(H-floor)*(j/3)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- CHEESE RACKS along the left wall: tall frame + shelves of round cheeses ----
  if (has("cheese")){
    const rx=W*0.05, ry0=floor-H*0.02, rw=W*0.24, rh=H*0.30, ry1=ry0-rh;
    // uprights
    pen.paint(()=>{ g.rect(rx, ry1, W*0.016, rh); }, toneSolid(inkLevel(5)), 4);
    pen.paint(()=>{ g.rect(rx+rw-W*0.016, ry1, W*0.016, rh); }, toneSolid(inkLevel(5)), 4);
    const rows=params.cheeseRows, per=params.cheesePerRow;
    for(let r=0;r<rows;r++){
      const sy=ry1 + rh*(r+0.5)/rows + H*0.02;
      // shelf plank
      pen.paint(()=>{ g.rect(rx, sy, rw, H*0.012); }, toneSolid(inkLevel(4)), 3);
      // round cheeses resting on the shelf
      for(let c=0;c<per;c++){
        const cx=rx+rw*(c+0.5)/per, cyr=sy-H*0.018, cr=W*0.024;
        pen.paint(()=>{ g.ellipse(cx, cyr, cr, cr*0.78, 0,0,7); }, toneSolid(inkLevel(3)), 3);
        pen.seam(()=>{ g.ellipse(cx, cyr, cr*0.5, cr*0.4, 0,0,7); }, 2);   // rind ring
      }
    }
  }

  // ---- ANIMAL PENS on the right: stone-walled compartments, divided by age ----
  if (has("pens")){
    const px0=W*0.62, px1=W*0.95, py0=floor+H*0.01, py1=H*0.965, wallT=H*0.02;
    // outer low wall
    pen.paint(()=>{ g.rect(px0, py0, px1-px0, wallT); }, toneSolid(inkLevel(5)), 4);        // back rail
    pen.paint(()=>{ g.rect(px0, py1-wallT, px1-px0, wallT); }, toneSolid(inkLevel(5)), 4);   // front rail
    pen.paint(()=>{ g.rect(px0, py0, W*0.012, py1-py0); }, toneSolid(inkLevel(5)), 4);
    pen.paint(()=>{ g.rect(px1-W*0.012, py0, W*0.012, py1-py0); }, toneSolid(inkLevel(5)), 4);
    // dividing walls -> separate compartments by age
    const divs=params.penDivs;
    for(let d=1;d<divs;d++){
      const dx=px0+(px1-px0)*d/divs;
      pen.paint(()=>{ g.rect(dx-W*0.006, py0, W*0.012, py1-py0); }, toneSolid(inkLevel(5)), 4);
    }
    // stone-block seams along the rails
    g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.6;
    for(let x=px0; x<px1; x+=W*0.03){ g.beginPath(); g.moveTo(x,py0); g.lineTo(x,py0+wallT); g.stroke();
      g.beginPath(); g.moveTo(x,py1-wallT); g.lineTo(x,py1); g.stroke(); }
    g.globalAlpha=1;
    // strewn straw bedding inside (light dashes)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    for(let i=0;i<18;i++){ const sx=px0+W*0.03+((i*53)%Math.round((px1-px0-W*0.05)));
      const sy=py0+wallT+H*0.02+((i*37)%Math.round((py1-py0-wallT*3)));
      g.beginPath(); g.moveTo(sx,sy); g.lineTo(sx+8,sy-4); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- LINE OF MILK PAILS across the mid floor ----
  if (has("pails")){
    const n=params.pails, y=floor+H*0.10, pw=W*0.045, ph=H*0.06;
    for(let i=0;i<n;i++){
      const cx=W*0.16 + i*W*0.085;
      pen.paint(()=>{
        g.moveTo(cx-pw*0.5, y-ph);
        g.lineTo(cx+pw*0.5, y-ph);
        g.lineTo(cx+pw*0.38, y);
        g.lineTo(cx-pw*0.38, y);
        g.closePath();
      }, toneSolid(inkLevel(4)), 4);
      // rim + milk surface (light)
      pen.paint(()=>{ g.ellipse(cx, y-ph, pw*0.5, ph*0.12, 0,0,7); }, toneSolid(inkLevel(2)), 3);
      // stave seam
      pen.seam(()=>{ g.moveTo(cx, y-ph); g.lineTo(cx-pw*0.05, y); }, 2);
    }
  }

  // ---- CENTRAL FIRE-RING: ring of hearth stones + flame tongues (light on dark) ----
  if (has("fire")){
    const fx=W*0.44, fy=floor+H*0.20, fr=W*0.11;
    // scorched ground disc (light so the ring + flame read on top)
    pen.paint(()=>{ g.ellipse(fx, fy, fr*1.25, fr*0.55, 0,0,7); }, toneSolid(inkLevel(3)), 4);
    // ring of stones
    for(let i=0;i<9;i++){ const a=Math.PI*(i/8);
      const sx=fx+Math.cos(a)*fr, sy=fy-Math.sin(a)*fr*0.42 + fr*0.10;
      pen.paint(()=>{ g.ellipse(sx, sy, W*0.022, H*0.016, 0,0,7); }, toneSolid(inkLevel(5)), 3); }
    // dark pit
    pen.paint(()=>{ g.ellipse(fx, fy-H*0.005, fr*0.62, fr*0.30, 0,0,7); }, toneSolid(inkLevel(7)), 3);
    // flame tongues, flickering with t (bright => reads as fire against dark pit)
    const embers = st.fireLevel==="embers";
    if (!embers){
      g.fillStyle=inkLevel(2);
      for(let i=-2;i<=2;i++){ const fl=1+0.25*Math.sin(t*3+i);
        const bx=fx+i*W*0.030, h=(i%2?0.135:0.115)*fl;
        g.beginPath(); g.moveTo(bx-W*0.018, fy-H*0.006);
        g.quadraticCurveTo(bx-W*0.026, fy-H*0.07*fl, bx-W*0.005, fy-H*h);
        g.quadraticCurveTo(bx+W*0.008, fy-H*0.07*fl, bx+W*0.018, fy-H*0.006);
        g.closePath(); g.fill(); }
      // dark cores inside the tongues for flame definition
      g.fillStyle=inkLevel(6);
      for(let i=-1;i<=1;i++){ const bx=fx+i*W*0.030;
        g.beginPath(); g.moveTo(bx-W*0.006, fy-H*0.006);
        g.quadraticCurveTo(bx-W*0.008, fy-H*0.04, bx, fy-H*0.06);
        g.quadraticCurveTo(bx+W*0.008, fy-H*0.04, bx+W*0.006, fy-H*0.006);
        g.closePath(); g.fill(); }
    } else {
      g.fillStyle=inkLevel(3);
      g.beginPath(); g.ellipse(fx, fy-H*0.004, fr*0.4, fr*0.16, 0,0,7); g.fill();
    }
  }
}

export const asset = {
  id:"location.polyphemuss-cave",
  type:"LOCATION",
  name:"Polyphemus's Cave",
  statusWord:"COLOSSAL",
  scene:"OD-B09-S05",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude
  layers:["recesses","vault","backwall","entrance","boulder","sleeping",
          "floor","cheese","pens","pails","fire","anchors"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "threshold:entrance":{x:.50,y:.66}, "boulder:door":{x:.72,y:.64},
    "fire:center":{x:.44,y:.86},
    "rack:cheese":{x:.17,y:.56}, "pails:line":{x:.33,y:.76},
    "pen:lambs":{x:.68,y:.83}, "pen:kids":{x:.78,y:.83}, "pen:newborn":{x:.89,y:.83},
    "sleeping:giant":{x:.24,y:.60}, "recess:left":{x:.06,y:.55}, "recess:right":{x:.94,y:.55},
    "entrance:mouth":{x:.50,y:.64}, "exit:mouth":{x:.50,y:.66},
    "camera:wide":{x:.50,y:.48}, "camera:fire":{x:.44,y:.78}, "camera:mouth":{x:.50,y:.60},
  },
  // walkable ground regions (for scene placement / pathing)
  zones:{
    walkable:{ x0:.08,y0:.68,x1:.92,y1:.98 },
    hearth:{ x0:.34,y0:.78,x1:.54,y1:.94 },
    pens:{ x0:.62,y0:.68,x1:.95,y1:.97 },
    sleepLedge:{ x0:.05,y0:.55,x1:.41,y1:.66 },
    threshold:{ x0:.40,y0:.62,x1:.60,y1:.68 },
  },
  states:{
    initial:"open",
    nodes:{
      open:{ preview:{ layers:["recesses","vault","backwall","entrance","boulder","sleeping","floor","cheese","pens","pails","fire"] } },
      sealed:{ preview:{ sealed:true, layers:["recesses","vault","backwall","entrance","sleeping","floor","cheese","pens","pails","fire"] } },
      embers:{ preview:{ fireLevel:"embers", layers:["recesses","vault","backwall","entrance","boulder","sleeping","floor","cheese","pens","pails","fire"] } },
      empty:{ preview:{ layers:["recesses","vault","backwall","entrance","boulder","floor","fire"] } },
    },
    edges:[["open","sealed"],["open","embers"],["sealed","open"],["open","empty"]],
  },
  channels:["reveal","camera","fire","seal","light"],

  preview:()=>({
    layers:["recesses","vault","backwall","entrance","boulder","sleeping","floor","cheese","pens","pails","fire"],
    t:0.6, status:"COLOSSAL", progress:.22,
  }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
