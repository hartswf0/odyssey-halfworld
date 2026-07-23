/* location.phaeacian-royal-chamber — protected princess bedroom of Nausicaa.
   LOCATION asset (empty navigable set — NO baked characters). Built in SOLID
   grays + hard contour into the offscreen ctx; the engine dotify pass supplies
   the halftone. Declares fg/mid/bg depth, walkable zone, door thresholds,
   occlusion layers, placement + camera anchors, and morning/dream states.
   Atlas: OD-B06-S01 — a fine bed, flanking attendant alcoves, twin doorways,
   a window admitting a dream-entry glow, morning light transition. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  floorLevel:0.74,      // horizon / floor line as fraction of H
  alcoves:2,            // flanking attendant alcoves (one each side)
  doorways:2,           // twin doorways in the back wall
  window:true,          // dream-entry window (upper wall)
  bed:true,             // the fine princess bed, foreground-mid
};

/* draw a subset of layers so scene state can reveal/occlude depth + light */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const T = st.t || 0;
  // morning: 0 = pre-dawn dim, 1 = full morning light. dream: extra glow bloom.
  const morning = st.morning != null ? st.morning : 0.55;
  const dream = st.dream != null ? st.dream : 0.0;
  const layers = st.layers || ["backwall","window","doorways","alcoves","floor","bed","dreamfield","anchors"];
  const has = l => layers.includes(l);

  // ---- BACK WALL of the chamber (mid tone, lit lighter toward morning) ----
  if (has("backwall")){
    const wallTone = Math.round(lerp(3.4, 2.4, clamp(morning,0,1))); // brighter wall at morning
    pen.paint(()=>{ g.rect(W*0.05, H*0.10, W*0.90, horizon-H*0.10); }, toneSolid(inkLevel(wallTone)), 5);
    // cornice line near the top
    pen.ink(()=>{ g.moveTo(W*0.05, H*0.16); g.lineTo(W*0.95, H*0.16); }, 3);
    // a low dado rail across the wall
    pen.ink(()=>{ g.moveTo(W*0.05, horizon-H*0.14); g.lineTo(W*0.95, horizon-H*0.14); }, 2);
  }

  // ---- WINDOW admitting a dream-entry glow (upper back wall) ----
  if (has("window") && params.window){
    const wx=W*0.5, wy=H*0.33, ww=W*0.20, wh=H*0.24;
    // frame
    pen.paint(()=>{ g.rect(wx-ww/2, wy-wh/2, ww, wh); }, toneSolid(inkLevel(6)), 5);
    // the lit opening — very light so the halftone reads as glowing sky
    const skyTone = Math.round(lerp(2.0, 1.0, clamp(morning,0,1)));
    pen.paint(()=>{ g.rect(wx-ww/2+ww*0.10, wy-wh/2+wh*0.10, ww*0.80, wh*0.80); }, toneSolid(inkLevel(skyTone)), 3);
    // mullion cross
    pen.ink(()=>{ g.moveTo(wx, wy-wh/2+wh*0.10); g.lineTo(wx, wy+wh/2-wh*0.10); }, 3);
    pen.ink(()=>{ g.moveTo(wx-ww/2+ww*0.10, wy); g.lineTo(wx+ww/2-ww*0.10, wy); }, 3);
    // shafts of morning light spilling down onto the floor
    if (has("window")){
      g.save(); g.globalAlpha = 0.10 + 0.16*clamp(morning,0,1);
      g.fillStyle = inkLevel(1);
      g.beginPath();
      g.moveTo(wx-ww*0.30, wy+wh/2);
      g.lineTo(wx+ww*0.30, wy+wh/2);
      g.lineTo(wx+ww*0.62, horizon);
      g.lineTo(wx-ww*0.62, horizon);
      g.closePath(); g.fill();
      g.restore();
    }
  }

  // ---- TWIN DOORWAYS in the back wall (arched exits toward the outer wall) ----
  if (has("doorways") && params.doorways){
    const dw=W*0.10, dh=H*0.30, dTop=horizon-dh;
    const dxs=[W*0.155, W*0.845];
    for(const dx of dxs){
      // lit jamb / surround (light frame reads as pilasters)
      pen.paint(()=>{ g.rect(dx-dw/2-W*0.026, dTop-H*0.03, dw+W*0.052, dh+H*0.03); }, toneSolid(inkLevel(3)), 5);
      // arched lintel band across the top of the frame (mid tone)
      pen.paint(()=>{ g.ellipse(dx, dTop+H*0.01, dw/2+W*0.026, H*0.045, 0, Math.PI, 0); }, toneSolid(inkLevel(4)), 4);
      // the dark opening — a passage to the hall beyond (arched top)
      pen.paint(()=>{
        g.moveTo(dx-dw/2, horizon);
        g.lineTo(dx-dw/2, dTop+dh*0.20);
        g.quadraticCurveTo(dx-dw/2, dTop+H*0.005, dx, dTop+H*0.005);
        g.quadraticCurveTo(dx+dw/2, dTop+H*0.005, dx+dw/2, dTop+dh*0.20);
        g.lineTo(dx+dw/2, horizon);
        g.closePath();
      }, toneSolid(inkLevel(6)), 4);
      // threshold bar on the floor
      pen.ink(()=>{ g.moveTo(dx-dw/2-W*0.02, horizon); g.lineTo(dx+dw/2+W*0.02, horizon); }, 4);
    }
  }

  // ---- FLANKING ATTENDANT ALCOVES (low niches beside the bed) ----
  if (has("alcoves") && params.alcoves){
    const aw=W*0.12, ah=H*0.17, ay=horizon-ah;
    const axs=[W*0.29, W*0.71];
    for(const ax of axs){
      // niche recess (arched shallow shelf, mid tone)
      pen.paint(()=>{
        g.moveTo(ax-aw/2, horizon);
        g.lineTo(ax-aw/2, ay+ah*0.35);
        g.quadraticCurveTo(ax-aw/2, ay, ax, ay);
        g.quadraticCurveTo(ax+aw/2, ay, ax+aw/2, ay+ah*0.35);
        g.lineTo(ax+aw/2, horizon);
        g.closePath();
      }, toneSolid(inkLevel(4)), 4);
      // inner shadow of the recess
      pen.paint(()=>{ g.rect(ax-aw*0.34, ay+ah*0.34, aw*0.68, ah*0.50); }, toneSolid(inkLevel(5)), 3);
      // a low attendant pallet/stool inside (placement, not a figure)
      pen.paint(()=>{ g.rect(ax-aw*0.32, ay+ah*0.66, aw*0.64, ah*0.22); }, toneSolid(inkLevel(6)), 3);
    }
  }

  // ---- FLOOR (foreground, lightest so it reads as ground) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    // recede lines toward the back wall center
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    for(let i=-5;i<=5;i++){ g.beginPath(); g.moveTo(W*0.5, horizon); g.lineTo(W*0.5+i*W*0.16, H); g.stroke(); }
    for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- the fine BED (foreground-mid, centered ahead of the window) ----
  if (has("bed") && params.bed){
    const bx=W*0.5, by=horizon+H*0.02, bw=W*0.34, bh=H*0.15;
    // headboard (tall, ornate, behind the mattress)
    pen.paint(()=>{ g.rect(bx-bw*0.46, by-bh-H*0.13, bw*0.92, H*0.14); }, toneSolid(inkLevel(5)), 5);
    pen.paint(()=>{ g.ellipse(bx, by-bh-H*0.13, bw*0.46, H*0.04, 0, Math.PI, 0); }, toneSolid(inkLevel(5)), 4);
    // bed frame / base
    pen.paint(()=>{ g.rect(bx-bw/2, by-bh, bw, bh); }, toneSolid(inkLevel(4)), 5);
    // mattress + fine coverlet (lighter — draped linen)
    pen.paint(()=>{ g.rect(bx-bw*0.46, by-bh-H*0.04, bw*0.92, H*0.06); }, toneSolid(inkLevel(2)), 4);
    // pillow at the head
    pen.paint(()=>{ g.ellipse(bx-bw*0.30, by-bh-H*0.03, bw*0.14, H*0.03, 0, 0, 7); }, toneSolid(inkLevel(1)), 3);
    // fold seams across the coverlet
    for(let i=1;i<=3;i++){ const fx=bx-bw*0.5+bw*(i/4);
      pen.ink(()=>{ g.moveTo(fx, by-bh+H*0.005); g.lineTo(fx, by+bh*0.9); }, 2); }
    // foot posts
    pen.paint(()=>{ g.rect(bx-bw/2-W*0.006, by-bh, W*0.02, bh+H*0.03); }, toneSolid(inkLevel(6)), 3);
    pen.paint(()=>{ g.rect(bx+bw/2-W*0.014, by-bh, W*0.02, bh+H*0.03); }, toneSolid(inkLevel(6)), 3);
  }

  // ---- DREAM-ENTRY FIELD — a descending column of light + drifting rings
  //      spilling from the window down onto the sleeper. Reads as Athena's
  //      dream arriving. Blue ACCENT marks the supernatural channel. ----
  if (has("dreamfield") && dream>0.001){
    const wx=W*0.5, wy=H*0.45, bx=W*0.5, by=horizon+H*0.02;
    // soft descending shaft of dream-light (light halftone under the rings)
    g.save();
    g.globalAlpha = 0.18*clamp(dream,0,1);
    g.fillStyle = inkLevel(1);
    g.beginPath();
    g.moveTo(wx-W*0.05, wy);
    g.lineTo(wx+W*0.05, wy);
    g.lineTo(wx+W*0.16, by);
    g.lineTo(wx-W*0.16, by);
    g.closePath(); g.fill();
    g.restore();
    // drifting concentric rings descending window -> bed
    const rings = 6;
    g.save();
    for(let i=0;i<rings;i++){
      const p = ((T*0.22 + i/rings) % 1);
      const cx = lerp(wx, bx, p);
      const cy = lerp(wy, by, p);
      const rr = lerp(W*0.03, W*0.12, p) * (0.6 + 0.6*dream);
      g.globalAlpha = (0.85-0.7*p) * clamp(dream,0,1);
      g.strokeStyle = ACCENT;
      g.lineWidth = 4;
      g.beginPath(); g.ellipse(cx, cy, rr, rr*0.85, 0, 0, 7); g.stroke();
    }
    // a bright landing spark where the dream meets the pillow
    g.globalAlpha = 0.9*clamp(dream,0,1);
    g.fillStyle = ACCENT;
    g.beginPath(); g.arc(bx-W*0.02, by-H*0.01, W*0.012, 0, 7); g.fill();
    g.restore();
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"location.phaeacian-royal-chamber",
  type:"LOCATION",
  name:"Phaeacian Royal Chamber",
  statusWord:"PROTECTED",
  scene:"OD-B06-S01",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["backwall","window","doorways","alcoves","floor","bed","dreamfield","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "bed:nausicaa":{x:.50,y:.72}, "pillow:head":{x:.42,y:.66},
    "alcove:attendant-left":{x:.29,y:.68}, "alcove:attendant-right":{x:.71,y:.68},
    "door:left":{x:.155,y:.72}, "door:right":{x:.845,y:.72},
    "window:dream":{x:.50,y:.33}, "dream:landing":{x:.50,y:.68},
    "entrance:door-left":{x:.155,y:.74}, "exit:door-right":{x:.845,y:.74},
    "camera:wide":{x:.50,y:.50}, "camera:bed":{x:.50,y:.66},
  },
  // walkable ground region (for scene placement / pathing) + alcove sub-zones
  zones:{
    walkable:{ x0:.10,y0:.74,x1:.90,y1:.96 },
    bed:{ x0:.33,y0:.60,x1:.67,y1:.80 },
    "alcove-left":{ x0:.23,y0:.58,x1:.35,y1:.74 },
    "alcove-right":{ x0:.65,y0:.58,x1:.77,y1:.74 },
  },
  states:{
    initial:"night-protected",
    nodes:{
      "night-protected":{ preview:{ layers:["backwall","window","doorways","alcoves","floor","bed"], morning:0.15, dream:0.0 } },
      "dream-entry":{ preview:{ layers:["backwall","window","doorways","alcoves","floor","bed","dreamfield"], morning:0.25, dream:1.0 } },
      "morning":{ preview:{ layers:["backwall","window","doorways","alcoves","floor","bed"], morning:1.0, dream:0.0 } },
    },
    edges:[["night-protected","dream-entry"],["dream-entry","morning"],["morning","night-protected"]],
  },
  channels:["morning","dream","reveal","camera","light","t"],

  preview:()=>({ layers:["backwall","window","doorways","alcoves","floor","bed","dreamfield"], morning:0.55, dream:0.45, t:0.6, status:"PROTECTED", progress:.22 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
