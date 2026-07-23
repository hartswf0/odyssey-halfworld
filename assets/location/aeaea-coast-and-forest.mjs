/* location.aeaea-coast-and-forest — the wooded island of Circe seen from the
   landing shore. LOCATION asset for OD-B10-S03. An EMPTY navigable set drawn in
   SOLID grays + hard contour into the offscreen ctx (the engine dotify pass
   supplies the halftone). Depth reads fg beach / mid forest / bg palace-smoke:
   a foreground ship-beach with the galley hauled out and a small rest camp; a
   dense treeline band with a worn forest path running inland through a gap and a
   fainter stag trail branching off; a high lookout hill rising on the left with a
   marked vantage cairn; and far off, above the trees, the roof of Circe's palace
   with a thread of smoke rising. NO baked characters — anchors + zones only.
   Atlas: ship beach · rest camp · high lookout · stag trail · dense forest path ·
   distant palace smoke · empty navigable set. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  skyLevel:0.24,        // sky / distant-land haze line as fraction of H
  ridgeLevel:0.47,      // top of the forest band (treeline crest, jagged)
  forestBase:0.60,      // where the forest meets the beach
  surfLevel:0.91,       // beach / surf line at the foreground bottom
  treeCount:22,         // crowns stippling the treeline
  lookoutSide:-1,       // high lookout hill on the left
  palace:true,          // distant palace roof + smoke thread above the trees
  stagTrail:true,       // secondary game trail branching off the forest path
};

/* a galley hauled out on the sand: crescent hull resting on prop logs, curled
   stern + prow posts, furled sail on the mast, oar ticks. No water reflection —
   it is beached. */
function beachedShip(pen, g, sx, baseY, hw, hh, dir){
  // prop logs under the keel (it is hauled out of the water)
  pen.paint(()=>{ g.ellipse(sx-hw*0.45, baseY+hh*0.35, hw*0.12, hh*0.28, 0,0,7); }, toneSolid(inkLevel(4)), 3);
  pen.paint(()=>{ g.ellipse(sx+hw*0.45, baseY+hh*0.35, hw*0.12, hh*0.28, 0,0,7); }, toneSolid(inkLevel(4)), 3);
  // hull body (crescent)
  pen.paint(()=>{
    g.moveTo(sx-hw, baseY-hh*0.15);
    g.quadraticCurveTo(sx, baseY+hh, sx+hw, baseY-hh*0.15);        // rounded underside
    g.quadraticCurveTo(sx, baseY-hh*0.7, sx-hw, baseY-hh*0.15);    // gunwale line back
    g.closePath();
  }, toneSolid(inkLevel(6)), 5);
  // stern post curling up (landward)
  pen.paint(()=>{
    g.moveTo(sx-hw, baseY-hh*0.15);
    g.quadraticCurveTo(sx-hw-dir*hw*0.10, baseY-hh*1.6, sx-hw+dir*hw*0.06, baseY-hh*1.7);
    g.quadraticCurveTo(sx-hw+dir*hw*0.02, baseY-hh*1.0, sx-hw+hw*0.10, baseY-hh*0.4);
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  // prow post (seaward beak)
  pen.paint(()=>{
    g.moveTo(sx+hw, baseY-hh*0.15);
    g.quadraticCurveTo(sx+hw+dir*hw*0.14, baseY-hh*1.9, sx+hw+dir*hw*0.30, baseY-hh*1.5);
    g.quadraticCurveTo(sx+hw+dir*hw*0.08, baseY-hh*1.1, sx+hw-hw*0.08, baseY-hh*0.4);
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  // oar-port ticks along the hull
  g.strokeStyle=INK; g.lineWidth=2;
  for(let i=-3;i<=3;i++){ const ox=sx+i*hw*0.24; g.beginPath();
    g.moveTo(ox, baseY-hh*0.28); g.lineTo(ox, baseY+hh*0.05); g.stroke(); }
  // mast + furled sail bundle
  pen.ink(()=>{ g.moveTo(sx, baseY-hh*0.5); g.lineTo(sx, baseY-hh*4.4); }, 4);
  pen.ink(()=>{ g.moveTo(sx-hw*0.5, baseY-hh*3.7); g.lineTo(sx+hw*0.5, baseY-hh*3.7); }, 3);
  pen.paint(()=>{ g.rect(sx-hw*0.32, baseY-hh*3.7, hw*0.64, hh*0.85); }, toneSolid(inkLevel(4)), 3);
  // stays from masthead to the posts
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
  g.beginPath(); g.moveTo(sx, baseY-hh*4.4); g.lineTo(sx-hw*0.85, baseY-hh*0.5); g.stroke();
  g.beginPath(); g.moveTo(sx, baseY-hh*4.4); g.lineTo(sx+hw*0.9, baseY-hh*0.5); g.stroke();
  g.globalAlpha=1;
}

/* a simple A-frame tent on the sand */
function tent(pen, g, cx, baseY, w, h){
  pen.paint(()=>{
    g.moveTo(cx, baseY-h);
    g.lineTo(cx+w*0.5, baseY);
    g.lineTo(cx-w*0.5, baseY);
    g.closePath();
  }, toneSolid(inkLevel(5)), 4);
  // door slit + ridge seam
  pen.seam(()=>{ g.moveTo(cx, baseY-h); g.lineTo(cx, baseY); }, 3);
  pen.paint(()=>{
    g.moveTo(cx, baseY-h*0.55); g.lineTo(cx+w*0.12, baseY);
    g.lineTo(cx-w*0.12, baseY); g.closePath();
  }, toneSolid(inkLevel(7)), 2);
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const skyY   = H*params.skyLevel;
  const ridgeY = H*params.ridgeLevel;
  const forY   = H*params.forestBase;
  const surfY  = H*params.surfLevel;
  const layers = st.layers || ["sky","hills","palace","forest","trail","beach","ship","camp","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY + distant haze (lightest -> sparse dots) ----
  if (has("sky")){
    g.fillStyle=inkLevel(1); g.fillRect(0,0,W,ridgeY+H*0.01);
    // soft cloud steps
    g.fillStyle=inkLevel(2);
    for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(W*(0.18+i*0.22), skyY*(0.5+0.12*(i%2)), W*0.10, H*0.02, 0,0,7); g.fill(); }
  }

  // ---- HIGH LOOKOUT HILL (left, a tall mid-light mass rising over the trees) ----
  if (has("hills")){
    const s=params.lookoutSide, bx = s<0 ? 0 : W;
    pen.paint(()=>{
      g.moveTo(bx, forY);
      g.lineTo(bx, H*0.30);
      g.quadraticCurveTo(bx - s*W*0.10, H*0.19, bx - s*W*0.20, H*0.205);   // shoulder up to the vantage
      g.quadraticCurveTo(bx - s*W*0.30, H*0.24, bx - s*W*0.34, H*0.36);    // long grassy slope down
      g.quadraticCurveTo(bx - s*W*0.37, H*0.42, bx - s*W*0.30, forY);
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // ridge contour
    pen.ink(()=>{
      g.moveTo(bx, H*0.30);
      g.quadraticCurveTo(bx - s*W*0.10, H*0.19, bx - s*W*0.20, H*0.205);
      g.quadraticCurveTo(bx - s*W*0.30, H*0.24, bx - s*W*0.34, H*0.36);
      g.quadraticCurveTo(bx - s*W*0.37, H*0.42, bx - s*W*0.30, forY);
    }, 4);
    // a right-side low headland for balance
    pen.paint(()=>{
      g.moveTo(W, forY);
      g.quadraticCurveTo(W*0.90, ridgeY-H*0.02, W*0.78, forY);
      g.lineTo(W, forY); g.closePath();
    }, toneSolid(inkLevel(3)), 4);
    // LOOKOUT vantage: a flat ledge + a cairn on the hill crown
    const lx = bx - s*W*0.20, ly = H*0.205;
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.55;
    g.beginPath(); g.ellipse(lx, ly+H*0.006, W*0.045, H*0.012, 0,0,7); g.stroke(); g.globalAlpha=1;
    pen.paint(()=>{ g.ellipse(lx, ly-H*0.006, W*0.016, H*0.014, 0,0,7); }, toneSolid(inkLevel(6)), 3);   // cairn base
    pen.paint(()=>{ g.ellipse(lx, ly-H*0.024, W*0.010, H*0.010, 0,0,7); }, toneSolid(inkLevel(7)), 3);   // cairn cap
  }

  // ---- DISTANT PALACE ROOF + SMOKE THREAD, cresting clear above the trees ----
  if (has("palace") && params.palace){
    const px=W*0.66, roofY=ridgeY-H*0.075;           // sits above the treeline against sky
    // roof block cresting above the woods
    pen.paint(()=>{ g.rect(px-W*0.045, roofY, W*0.09, H*0.05); }, toneSolid(inkLevel(6)), 3);
    pen.paint(()=>{                                                     // gable roof
      g.moveTo(px-W*0.056, roofY); g.lineTo(px, roofY-H*0.026);
      g.lineTo(px+W*0.056, roofY); g.closePath();
    }, toneSolid(inkLevel(7)), 3);
    // rising smoke thread — a clear vertical column of light drifting puffs
    let sx=px+W*0.02, sy=roofY-H*0.02;
    for(let i=0;i<6;i++){
      const t=i/5, r=lerp(W*0.014, W*0.034, t);
      sx += Math.sin(i*1.2)*W*0.014;
      sy -= H*0.030;
      g.fillStyle=inkLevel(3);
      g.beginPath(); g.ellipse(sx, sy, r, r*0.82, 0,0,7); g.fill();
    }
  }

  // ---- DENSE FOREST band (a textured mid-tone treeline, not a solid blob) ----
  if (has("forest")){
    const N=params.treeCount;
    // jagged crown crest along the top of the band
    const crest = x => ridgeY + Math.sin(x*Math.PI*7)*H*0.012 + Math.sin(x*Math.PI*2.3)*H*0.018 - H*0.006;
    g.beginPath();
    g.moveTo(0, crest(0));
    for(let s=0;s<=80;s++){ const x=s/80; g.lineTo(x*W, crest(x)); }
    g.lineTo(W, forY); g.lineTo(0, forY); g.closePath();
    g.fillStyle=inkLevel(4); g.fill();                 // lighter body so it reads as woods, not wall
    g.strokeStyle=INK; g.lineWidth=3; g.stroke();
    // lighter understory strip at the forest foot lifts it off the beach
    g.fillStyle=inkLevel(3); g.fillRect(0, forY-H*0.03, W, H*0.03);
    // individual crowns riding the crest for texture (darker)
    for(let i=0;i<N;i++){
      const t=(i+0.5)/N, x=t*W;
      // leave a gap for the forest-path mouth near center
      if (x>W*0.42 && x<W*0.56) continue;
      const cy=crest(t)-H*0.004 - ((i*29%7)/7)*H*0.022;
      const cw=W*0.045*(0.7+((i*17%5)/5)*0.6), ch=H*0.055*(0.7+((i*23%5)/5)*0.7);
      pen.paint(()=>{
        g.moveTo(x, cy-ch);
        g.quadraticCurveTo(x+cw, cy+ch*0.3, x+cw*0.5, cy+ch*0.4);
        g.lineTo(x-cw*0.5, cy+ch*0.4);
        g.quadraticCurveTo(x-cw, cy+ch*0.3, x, cy-ch);
      }, toneSolid(inkLevel(6)), 3);
    }
    // vertical trunk striping breaks up the mass into individual trees
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let i=0;i<16;i++){ const x=((i*61+13)%100)/100*W;
      if (x>W*0.42 && x<W*0.56) continue;
      g.beginPath(); g.moveTo(x, forY-H*0.005); g.lineTo(x, crest(x/W)+H*0.03); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- FOREST PATH inland (worn light ribbon through the treeline gap) ----
  if (has("trail")){
    // main path: mouth at the beach/treeline, receding up into the gap
    const mouthX=W*0.49, mouthY=forY+H*0.02;
    const pts=[ [mouthX, mouthY], [W*0.50, forY-H*0.02], [W*0.48, ridgeY+H*0.04],
                [W*0.46, ridgeY-H*0.01] ];
    // pale worn band, tapering as it recedes
    g.lineCap="round"; g.lineJoin="round";
    for(let i=0;i<pts.length-1;i++){
      const w = lerp(W*0.075, W*0.018, i/(pts.length-1));
      g.strokeStyle=inkLevel(1); g.lineWidth=w;
      g.beginPath(); g.moveTo(pts[i][0],pts[i][1]); g.lineTo(pts[i+1][0],pts[i+1][1]); g.stroke();
    }
    // dark seating edges
    g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.5;
    g.beginPath(); g.moveTo(pts[0][0]-W*0.035, pts[0][1]);
    for(let i=1;i<pts.length;i++) g.lineTo(pts[i][0]-W*0.01*(pts.length-i), pts[i][1]); g.stroke();
    g.beginPath(); g.moveTo(pts[0][0]+W*0.035, pts[0][1]);
    for(let i=1;i<pts.length;i++) g.lineTo(pts[i][0]+W*0.01*(pts.length-i), pts[i][1]); g.stroke();
    g.globalAlpha=1; g.lineCap="butt";

    // STAG TRAIL: a fainter game trail branching off to the right through the trees
    if (params.stagTrail){
      const sp=[ [W*0.53, forY-H*0.01], [W*0.62, forY-H*0.03], [W*0.68, ridgeY+H*0.06], [W*0.72, ridgeY+H*0.02] ];
      g.strokeStyle=inkLevel(2); g.lineWidth=W*0.020; g.lineCap="round"; g.lineJoin="round";
      g.beginPath(); g.moveTo(sp[0][0],sp[0][1]);
      for(let i=1;i<sp.length;i++) g.lineTo(sp[i][0],sp[i][1]); g.stroke();
      // dashed hoof-scuff centerline so it reads as a game trail
      g.strokeStyle=INK; g.lineWidth=2; g.setLineDash([6,7]); g.globalAlpha=0.55;
      g.beginPath(); g.moveTo(sp[0][0],sp[0][1]);
      for(let i=1;i<sp.length;i++) g.lineTo(sp[i][0],sp[i][1]); g.stroke();
      g.setLineDash([]); g.globalAlpha=1; g.lineCap="butt";
    }
  }

  // ---- BEACH (foreground light sand from the treeline down to the surf) ----
  if (has("beach")){
    const topY = x=> forY + Math.sin(x*Math.PI*3)*H*0.006 + Math.sin(x*Math.PI*1.4)*H*0.005;
    g.beginPath();
    g.moveTo(0, topY(0)); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); }
    g.lineTo(W, H); g.lineTo(0, H); g.closePath();
    g.fillStyle=inkLevel(2); g.fill();
    // treeline shadow contour where forest meets sand
    pen.ink(()=>{ g.moveTo(0,topY(0)); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } }, 3);
    // ---- SURF strip at the very foreground bottom ----
    g.fillStyle=inkLevel(3); g.fillRect(0, surfY, W, H-surfY);
    // foam scallops along the waterline
    pen.ink(()=>{ g.moveTo(0,surfY); g.lineTo(W,surfY); }, 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let x=0;x<W;x+=W*0.055){ g.beginPath(); g.arc(x+W*0.027, surfY+H*0.004, W*0.024, Math.PI, 0); g.stroke(); }
    // drift lines in the dry sand
    g.globalAlpha=0.24;
    for(let j=1;j<=3;j++){ const y=lerp(forY+H*0.08, surfY-H*0.02, j/3);
      g.beginPath(); for(let s=0;s<=20;s++){ const x=W*s/20, yy=y+Math.sin(s*0.7+j)*H*0.005; s?g.lineTo(x,yy):g.moveTo(x,yy);} g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- BEACHED SHIP hauled out on the sand ----
  if (has("ship")){
    beachedShip(pen, g, W*0.32, H*0.80, W*0.17, H*0.042, 1);
  }

  // ---- REST CAMP: a pair of tents + a campfire ring on the beach ----
  if (has("camp")){
    tent(pen, g, W*0.585, H*0.86, W*0.11, H*0.075);
    tent(pen, g, W*0.70, H*0.885, W*0.095, H*0.062);
    // campfire ring: a circle of stones + a small flame + smoke wisp
    const fx=W*0.51, fy=H*0.90;
    g.strokeStyle=INK; g.lineWidth=2;
    for(let a=0;a<8;a++){ const ang=a/8*Math.PI*2;
      pen.paint(()=>{ g.ellipse(fx+Math.cos(ang)*W*0.028, fy+Math.sin(ang)*H*0.012, W*0.008, H*0.006, 0,0,7); }, toneSolid(inkLevel(5)), 2); }
    pen.paint(()=>{                                                     // flame
      g.moveTo(fx, fy-H*0.03); g.quadraticCurveTo(fx+W*0.012, fy-H*0.006, fx, fy);
      g.quadraticCurveTo(fx-W*0.012, fy-H*0.006, fx, fy-H*0.03);
    }, toneSolid(inkLevel(7)), 2);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    g.beginPath(); g.moveTo(fx, fy-H*0.032);
    g.quadraticCurveTo(fx+W*0.02, fy-H*0.06, fx-W*0.01, fy-H*0.09); g.stroke();
    g.globalAlpha=1;
    // a stacked supply block beside the camp
    pen.paint(()=>{ g.rect(W*0.64, H*0.91, W*0.05, H*0.03); }, toneSolid(inkLevel(6)), 3);
  }
}

export const asset = {
  id:"location.aeaea-coast-and-forest",
  type:"LOCATION",
  name:"Aeaea Coast and Forest",
  statusWord:"WATCHFUL",
  scene:"OD-B10-S03",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","hills","palace","forest","trail","beach","ship","camp","anchors"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "beach:ship":{x:.32,y:.80},               // the hauled-out galley on the sand
    "camp:rest":{x:.62,y:.86},                // the rest camp tents + fire
    "camp:fire":{x:.51,y:.90},                // campfire ring
    "lookout:vantage":{x:.20,y:.205},         // the marked cairn on the high hill
    "trail:mouth":{x:.49,y:.66},              // forest-path mouth at the treeline
    "trail:inland":{x:.46,y:.44},             // path receding inland into the woods
    "trail:stag":{x:.66,y:.58},               // the branching game/stag trail
    "palace:smoke":{x:.60,y:.14},             // distant palace roof + rising smoke
    "threshold:treeline":{x:.49,y:.62},       // beach -> forest threshold
    "entrance:shore":{x:.20,y:.94},           // the landing shore at the surf
    "exit:inland":{x:.46,y:.42},              // path exit deeper inland
    "camera:wide":{x:.50,y:.50}, "camera:beach":{x:.42,y:.80}, "camera:lookout":{x:.22,y:.28},
  },
  // walkable / interaction regions for scene placement + pathing
  zones:{
    beach:{ x0:.04,y0:.66,x1:.96,y1:.99 },
    forest:{ x0:.00,y0:.42,x1:1.0,y1:.66 },
    trail:{ x0:.38,y0:.42,x1:.74,y1:.68 },
    lookout:{ x0:.02,y0:.18,x1:.34,y1:.44 },
  },
  states:{
    initial:"landfall",
    nodes:{
      landfall:{ preview:{ layers:["sky","hills","palace","forest","trail","beach","ship","camp"] } },
      "camp-made":{ preview:{ layers:["sky","hills","palace","forest","beach","ship","camp"] } },
      "scouting":{ preview:{ layers:["sky","hills","palace","forest","trail","beach","ship"] } },
      "empty-set":{ preview:{ layers:["sky","hills","palace","forest","beach"] } },
    },
    edges:[["landfall","camp-made"],["landfall","scouting"],["camp-made","scouting"],["landfall","empty-set"]],
  },
  channels:["reveal","camera","wind","light"],

  preview:()=>({ layers:["sky","hills","palace","forest","trail","beach","ship","camp"], status:"WATCHFUL", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
