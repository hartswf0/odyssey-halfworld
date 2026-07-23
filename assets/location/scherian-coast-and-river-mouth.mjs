/* location.scherian-coast-and-river-mouth — the Phaeacian shore where
   Odysseus makes landfall. LOCATION asset. Empty navigable set: a dangerous
   REEF coast on the LEFT transitioning to a sheltered RIVER ESTUARY, bank,
   woodland edge, and an olive-bush refuge on the RIGHT. Draws SOLID grays +
   hard contour into the offscreen ctx (the engine dotify pass supplies the
   halftone). Declares depth layers (fg water / mid bank / bg woods), walkable
   zones, a reef-vs-calm split, entrances/exits, and camera anchors.
   Do NOT bake characters in.
   Atlas: OD-B05-S06 — reef coast -> sheltered estuary, bank, woodland edge,
   olive-bush refuge. */
import { makePen, toneSolid, inkLevel, INK, lerp, clamp } from "../../engine/halfworld-engine.mjs";

const params = {
  horizon:0.32,        // sea/land horizon as fraction of H
  reefSide:"left",     // dangerous reef coast on the left
  reefSpan:0.42,       // reef mass extends to this fraction of W
  riverX:0.71,         // river-mouth channel centre (fraction of W)
  refugeX:0.86,        // olive-bush refuge centre (fraction of W)
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const layers = st.layers || ["sky","sea","woods","bank","estuary","reef","olivebush","foam","anchors"];
  const has = l => layers.includes(l);

  // ---- BACKGROUND: sky (lightest tone -> few dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon+H*0.04);
    // a couple of distant cloud steps
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.18+i*0.20), horizon*(0.32+0.14*(i%2)), W*0.11, H*0.020, 0,0,7); g.fill(); }
  }

  // ---- SEA: the whole water field (horizon -> bottom), reads as fg water ----
  if (has("sea")){
    pen.paint(()=>{ g.rect(0,horizon, W, H-horizon); }, toneSolid(inkLevel(3)), 3);
    // hard horizon sightline
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 5);
    // receding swell lines; LEFT (reef) rougher, RIGHT (sheltered) calmer
    g.strokeStyle=INK; g.lineCap="round";
    for(let j=1;j<=8;j++){
      const t=j/8, y=lerp(horizon, H, t*t);
      g.globalAlpha=0.22+0.34*t; g.lineWidth=2+t*1.4;
      g.beginPath();
      for(let x=0;x<=W;x+=W/22){
        const rough = 1 - clamp(x/(W*params.reefSpan),0,1)*0.7;   // calmer to the right
        const yy = y + Math.sin(x/W*9 + j)*H*0.008*rough;
        x===0?g.moveTo(x,yy):g.lineTo(x,yy);
      }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- BACKGROUND WOODS: scalloped woodland edge along the far bank (right) ----
  if (has("woods")){
    const wx0=W*0.36, wbase=horizon+H*0.03, wtop=H*0.14;
    pen.paint(()=>{
      g.moveTo(wx0, wbase);
      const n=9;
      for(let i=0;i<=n;i++){
        const x = wx0 + (W-wx0)*(i/n);
        const crown = wtop + (i%2?H*0.035:0) + Math.abs(Math.sin(i*1.7))*H*0.02;
        if(i===0){ g.lineTo(x, crown); }
        else {
          const px = wx0 + (W-wx0)*((i-0.5)/n);
          g.quadraticCurveTo(px, crown-H*0.055, x, crown);
        }
      }
      g.lineTo(W, wbase); g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    // a darker inner tree-trunk band for depth
    g.fillStyle=inkLevel(5);
    for(let i=0;i<6;i++){ const tx=W*(0.42+i*0.095); g.fillRect(tx, horizon-H*0.01, W*0.012, H*0.05); }
  }

  // ---- BANK: the sheltered far shore landmass (mid depth), light sand ----
  if (has("bank")){
    // land body sweeping from the reef base across to the right, LIGHT so land
    // reads distinct from the mid-tone water; wavy shore front along the water
    pen.paint(()=>{
      g.moveTo(W*0.28, horizon+H*0.02);
      g.lineTo(W, horizon+H*0.04);
      g.lineTo(W, H*0.62);
      g.lineTo(W*0.82, H*0.58);
      g.quadraticCurveTo(W*0.66, H*0.56, W*0.52, H*0.52);
      g.quadraticCurveTo(W*0.42, H*0.495, W*0.34, H*0.46);
      g.closePath();
    }, toneSolid(inkLevel(2)), 5);
    // hard shore contour where the light bank meets the water
    pen.ink(()=>{
      g.moveTo(W*0.34,H*0.46);
      g.quadraticCurveTo(W*0.42,H*0.495,W*0.52,H*0.52);
      g.quadraticCurveTo(W*0.66,H*0.56,W*0.82,H*0.58);
      g.lineTo(W,H*0.62);
    }, 4);
  }

  // ---- ESTUARY: the calm river-mouth channel — water cutting into the bank ----
  if (has("estuary")){
    const rx=W*params.riverX;
    // channel of still water (mid tone, like the sea) notched up into the
    // light bank: wide mouth at the shore, narrowing as it runs inland
    pen.paint(()=>{
      g.moveTo(rx-W*0.095, H*0.585);        // wide mouth, opening to the sea
      g.lineTo(rx+W*0.095, H*0.585);
      g.lineTo(rx+W*0.030, horizon+H*0.075); // narrows going back inland
      g.lineTo(rx-W*0.030, horizon+H*0.075);
      g.closePath();
    }, toneSolid(inkLevel(3)), 4);
    // gentle calm ripples across the channel (still, sheltered water)
    g.strokeStyle=INK; g.lineCap="round"; g.globalAlpha=0.5; g.lineWidth=2;
    for(let j=1;j<=5;j++){
      const t=j/5, y=lerp(horizon+H*0.09, H*0.57, t);
      const half=lerp(W*0.032, W*0.088, t);
      g.beginPath(); g.moveTo(rx-half, y); g.lineTo(rx+half, y); g.stroke();
    }
    g.globalAlpha=1;
    // channel bank edges (seams framing the mouth)
    pen.seam(()=>{ g.moveTo(rx-W*0.095,H*0.585); g.lineTo(rx-W*0.030,horizon+H*0.075); }, 3);
    pen.seam(()=>{ g.moveTo(rx+W*0.095,H*0.585); g.lineTo(rx+W*0.030,horizon+H*0.075); }, 3);
  }

  // ---- REEF: dangerous jagged rock coast on the LEFT (dark, foreground) ----
  if (has("reef")){
    const rs=params.reefSpan;
    // main headland mass, jagged crest, rooted to the bottom-left
    pen.paint(()=>{
      g.moveTo(0, horizon+H*0.06);
      g.lineTo(W*0.06, horizon-H*0.01);
      g.lineTo(W*0.12, horizon+H*0.09);
      g.lineTo(W*0.19, horizon+H*0.02);
      g.lineTo(W*0.27, horizon+H*0.13);
      g.lineTo(W*0.34, horizon+H*0.06);
      g.lineTo(W*rs, H*0.44);
      g.lineTo(W*rs, H);
      g.lineTo(0, H);
      g.closePath();
    }, toneSolid(inkLevel(6)), 5);
    // strata seams down the reef face
    for(let i=1;i<=4;i++){
      const t=i/5;
      pen.seam(()=>{ g.moveTo(0, lerp(horizon+H*0.10,H,t)); g.lineTo(W*(rs*0.9-0.05*t), lerp(horizon+H*0.16,H,t)); }, 3);
    }
    // offshore reef teeth: small jagged rocks breaking the surface
    const teeth=[[0.30,0.70,0.045],[0.40,0.78,0.055],[0.22,0.62,0.038],[0.36,0.88,0.05]];
    for(const [bx,by,bw] of teeth){
      pen.paint(()=>{
        g.moveTo(W*bx-W*bw, H*by);
        g.lineTo(W*bx-W*bw*0.3, H*by-H*bw*1.5);
        g.lineTo(W*bx+W*bw*0.4, H*by-H*bw*1.1);
        g.lineTo(W*bx+W*bw, H*by);
        g.closePath();
      }, toneSolid(inkLevel(7)), 4);
    }
  }

  // ---- OLIVE-BUSH REFUGE: dense rounded bush cluster on the bank (far right) ----
  if (has("olivebush")){
    const ox=W*params.refugeX, oy=H*0.44, r=W*0.10;
    // short trunk grounding it on the bank
    pen.paint(()=>{ g.rect(ox-W*0.012, oy+r*0.4, W*0.024, H*0.06); }, toneSolid(inkLevel(6)), 3);
    // twin-bush leafy mass (a scalloped blob = the refuge thicket)
    pen.paint(()=>{
      const lobes=11;
      for(let i=0;i<=lobes;i++){
        const a=(i/lobes)*Math.PI*2;
        const rr=r*(0.82+0.20*Math.sin(i*2.3));
        const x=ox+Math.cos(a)*rr, y=oy+Math.sin(a)*rr*0.82;
        i===0?g.moveTo(x,y):g.lineTo(x,y);
      }
      g.closePath();
    }, toneSolid(inkLevel(5)), 4);
    // interior leaf clumps for foliage texture
    g.fillStyle=inkLevel(6);
    for(let i=0;i<5;i++){ const a=i*1.3; g.beginPath(); g.arc(ox+Math.cos(a)*r*0.4, oy+Math.sin(a)*r*0.34, r*0.22, 0,7); g.fill(); }
    // dark refuge hollow at the base (the nook Odysseus crawls into)
    g.fillStyle=inkLevel(7);
    g.beginPath(); g.ellipse(ox, oy+r*0.62, r*0.34, r*0.24, 0,0,7); g.fill();
  }

  // ---- FOAM: violent breaking surf where the sea meets the reef (fg) ----
  if (has("foam")){
    const rs=params.reefSpan;
    // white foam wash breaking along the reef edge (a churning band, not a pool)
    pen.paint(()=>{
      g.moveTo(0, horizon+H*0.15);
      for(let x=0;x<=W*rs;x+=W*0.025){ g.lineTo(x, horizon+H*0.17 + Math.sin(x/W*26)*H*0.016); }
      g.lineTo(W*rs, H*0.50);
      for(let x=W*rs;x>=0;x-=W*0.025){ g.lineTo(x, horizon+H*0.245 + Math.sin(x/W*22+1.5)*H*0.014); }
      g.closePath();
    }, toneSolid(inkLevel(1)), 3);
    // spray flecks bursting off the reef teeth
    g.fillStyle=inkLevel(4);
    for(let i=0;i<10;i++){
      const x=W*(0.05+i*0.036), y=horizon+H*0.15+Math.sin(i*2.1)*H*0.02;
      g.beginPath(); g.arc(x, y, W*0.006, 0,7); g.fill();
    }
  }
}

export const asset = {
  id:"location.scherian-coast-and-river-mouth",
  type:"LOCATION",
  name:"Scherian Coast and River Mouth",
  statusWord:"SHELTERED",
  scene:"OD-B05-S06",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","sea","woods","bank","estuary","reef","olivebush","foam","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "reef:break":{x:0.14,y:0.58},          // dangerous breaking surf on the reef
    "reef:point":{x:0.36,y:0.70},           // outer reef teeth
    "rivermouth:channel":{x:0.71,y:0.62},   // calm channel — the safe way in
    "bank:landing":{x:0.64,y:0.52},         // sheltered landing on the bank
    "woodland:edge":{x:0.58,y:0.30},        // tree line at the top of the bank
    "refuge:olive-bush":{x:0.86,y:0.50},    // the olive-bush thicket he hides in
    "sightline:sea":{x:0.26,y:0.28},        // open sea he is swept in from
    "swim:approach":{x:0.50,y:0.90},         // foreground water, swimming in
    "entrance:sea":{x:0.06,y:0.94},          // arrives from the open sea (fg-left)
    "exit:woods":{x:0.94,y:0.34},            // leaves inland into the woods
    "camera:wide":{x:0.50,y:0.50},
    "camera:rivermouth":{x:0.72,y:0.56},
  },
  // navigable regions + the reef-vs-calm split (for scene placement / pathing)
  zones:{
    water:{ x0:0.00,y0:0.50,x1:1.00,y1:1.00 },        // full navigable water
    reef:{ x0:0.00,y0:0.44,x1:0.42,y1:1.00 },          // dangerous — do not land
    calm:{ x0:0.60,y0:0.50,x1:0.84,y1:0.62 },          // sheltered estuary channel
    walkable:{ x0:0.34,y0:0.44,x1:1.00,y1:0.58 },      // the bank
    refuge:{ x0:0.78,y0:0.42,x1:0.96,y1:0.58 },        // olive-bush thicket
  },
  states:{
    initial:"landfall",
    nodes:{
      landfall:{ preview:{ layers:["sky","sea","woods","bank","estuary","reef","olivebush","foam"] } },
      "reef-danger":{ preview:{ layers:["sky","sea","woods","bank","reef","olivebush","foam"] } }, // no calm channel
      sheltered:{ preview:{ layers:["sky","sea","woods","bank","estuary","olivebush"] } },          // reef/foam quieted
      hidden:{ preview:{ layers:["sky","sea","woods","bank","estuary","olivebush"] } },
    },
    edges:[["landfall","reef-danger"],["reef-danger","sheltered"],["sheltered","hidden"],["hidden","sheltered"]],
  },
  channels:["reveal","camera","tide","wind","light"],

  preview:()=>({ layers:["sky","sea","woods","bank","estuary","reef","olivebush","foam"], status:"SHELTERED", progress:0.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
