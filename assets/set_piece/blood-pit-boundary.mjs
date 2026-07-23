/* set_piece.blood-pit-boundary — the Nekyia trench (bothros) + ward line.
   SET_PIECE. A dug ritual trench cut into the ground of the underworld shore:
   a raised earthen rim of spoil around a dark pit that holds the sacrificial
   BLOOD pool, with a sword-drawn boundary line scored into the near earth that
   separates the LIVING speaker (foreground) from the WAITING DEAD (a faint row
   of shades massed on the far side). The line is what maintains drink-permission
   and separation — the dead may not cross it or drink until bidden.
   States: FILLED (blood in the pit, dead pressing) / DRAINED (pit gone dry, a
   dark stain and cracks left). Drawn as a separable component in SOLID grays +
   hard contour; the engine dotify pass supplies the halftone. Declares placement
   / collision, the boundary line, contact + approach anchors, and a depth layer.
   Atlas: OD-B11-S02 — ritual trench holding drink-permission and the separation
   of the living speaker from the waiting dead. (Matches the DARK BLOOD trench.) */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

/* ---------- normalized layout (anchors + draw share these fractions of W,H) ---------- */
const L = {
  horizon:   0.275,   // far edge of the ground plane -> underworld dark above
  trenchCX:  0.500,   // trench centre column
  trenchCY:  0.585,   // *H
  trenchRX:  0.315,   // *W  outer earthen rim radius
  trenchRY:  0.110,   // *H  (foreshortened — the pit read on a ground plane)
  boundaryY: 0.760,   // *H  the sword-scored ward line across the near earth
  deadY:     0.470,   // *H  standing line of the waiting dead
};

const params = {
  clods:     14,      // clods of dug spoil heaped on the rim
  shades:    11,      // waiting-dead silhouettes massed on the far side
  wardTicks: 15,      // fringe ticks hung below the ward line
  runnels:   3,       // blood runnels creeping toward the living side
  captions:  true,    // LIVING / DEAD / BLOOD tags + blue boundary mark
};

/* ---------- helpers ---------- */
function tracked(g, text, x, y, size, track, color){
  g.save(); g.fillStyle=color; g.textBaseline="middle";
  g.font=`800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let cx=x; for(const ch of text){ g.fillText(ch,cx,y); cx+=g.measureText(ch).width+track; }
  g.restore();
}
/* an irregular closed blob around (cx,cy) with per-vertex radius jitter */
function blob(g, cx, cy, rx, ry, rng, jitter, n=20){
  g.beginPath();
  for(let i=0;i<=n;i++){
    const a=(i/n)*Math.PI*2;
    const j=1 - jitter + rng()*jitter*2;
    const x=cx+Math.cos(a)*rx*j, y=cy+Math.sin(a)*ry*j;
    if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
  }
  g.closePath();
}
/* a gently bowed ground line across the whole width (perspective sag) */
function groundLine(g, W, y, bow){
  g.moveTo(0, y - bow);
  g.quadraticCurveTo(W*0.5, y + bow, W, y - bow);
}

/* ---------- the set ---------- */
function drawTrench(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const phase  = st.phase || "filled";                 // filled | drained
  const layers = st.layers || ["ground","deadside","trench","blood","boundary"];
  const has = l => layers.includes(l);

  const hz  = L.horizon*H;
  const cx  = L.trenchCX*W, cy = L.trenchCY*H;
  const rx  = L.trenchRX*W, ry = L.trenchRY*H;
  const inRx = rx*0.74, inRy = ry*0.70;                 // the open pit mouth
  const by  = L.boundaryY*H;

  /* ---- GROUND: near living earth (light) under a dark underworld sky/void ---- */
  if (has("ground")){
    // gloom of Erebos above the horizon — mid tone, not a heavy void
    pen.paint(()=>{ g.rect(0,0,W,hz); }, toneSolid(inkLevel(3)), 4);
    // a lighter haze band just over the horizon so it isn't a flat block
    g.save(); g.globalAlpha=0.6;
    pen.fillPath(()=>{ g.rect(0,hz-H*0.05,W,H*0.05); }, inkLevel(1));
    g.restore();
    // a few darker vertical fissures in the far dark for texture
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.4; g.lineWidth=3;
    for(const fx of [0.18,0.40,0.63,0.83]){ g.beginPath();
      g.moveTo(fx*W, H*0.02); g.lineTo(fx*W+W*0.015, hz*0.9); g.stroke(); }
    g.restore();
    // the ground plane (lightest -> reads as trodden earth)
    pen.paint(()=>{
      g.moveTo(0,hz); g.lineTo(W,hz); g.lineTo(W,H); g.lineTo(0,H); g.closePath();
    }, toneSolid(inkLevel(2)), 4);
    // scored ground furrows fanning toward the viewer (perspective)
    g.save(); g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
    for(let i=-5;i<=5;i++){
      g.beginPath(); g.moveTo(cx + i*W*0.03, hz);
      g.lineTo(cx + i*W*0.15, H); g.stroke();
    }
    g.restore();
  }

  /* ---- DEAD SIDE: far band + a faint row of waiting shades (abstract, not baked) ---- */
  if (has("deadside")){
    // the far ground beyond the trench, a shade lighter than the sky (their standing ground)
    pen.paint(()=>{
      g.moveTo(0,hz); g.lineTo(W,hz);
      g.lineTo(W, cy-ry*1.05); g.lineTo(0, cy-ry*1.05); g.closePath();
    }, toneSolid(inkLevel(2)), 3);
    // the massed dead — a crowd of shrouded upright forms pressing to the pit edge
    const sr = rnd(1101);
    const dy = L.deadY*H;
    for(let i=0;i<params.shades;i++){
      const t=(i+0.5)/params.shades;
      const sx=lerp(W*0.08, W*0.92, t) + (sr()-0.5)*W*0.02;
      const depth=Math.abs(t-0.5)*2;                    // edges recede a little
      const sh=lerp(H*0.125,H*0.090,depth) * (0.88+sr()*0.24);
      const sw=sh*0.30;
      const sy=dy + (sr()-0.5)*H*0.015 - depth*H*0.015; // rank curves away
      g.save(); g.globalAlpha=lerp(0.9,0.6,depth);
      // shrouded body (dark solid -> reads clearly against the pale far ground)
      pen.paint(()=>{
        g.moveTo(sx-sw, sy);
        g.quadraticCurveTo(sx-sw*0.95, sy-sh*0.72, sx, sy-sh);
        g.quadraticCurveTo(sx+sw*0.95, sy-sh*0.72, sx+sw, sy);
        g.closePath();
      }, toneSolid(inkLevel(5)), 3);
      // bowed head
      pen.paint(()=>{ g.ellipse(sx, sy-sh*0.90, sw*0.55, sh*0.16, 0,0,7); }, toneSolid(inkLevel(6)), 2.5);
      g.restore();
    }
  }

  /* ---- TRENCH: raised earthen rim of dug spoil around the open pit ---- */
  if (has("trench")){
    // raised rim / bank of excavated earth (mid tone)
    pen.paint(()=>{ g.ellipse(cx, cy, rx, ry, 0, 0, 7); }, toneSolid(inkLevel(5)), 5);
    // clods of dug spoil heaped around the rim -> reads as freshly dug
    const cr = rnd(707);
    for(let i=0;i<params.clods;i++){
      const a=(i/params.clods)*Math.PI*2 + cr()*0.2;
      const px=cx+Math.cos(a)*rx*(0.86+cr()*0.18);
      const py=cy+Math.sin(a)*ry*(0.86+cr()*0.18);
      pen.paint(()=>{ blob(g,px,py, rx*lerp(0.05,0.11,cr()), ry*lerp(0.16,0.30,cr()), cr, 0.4, 8); },
        toneSolid(inkLevel(cr()<0.4?6:4)), 3);
    }
    // the open pit mouth (dark) cut into the rim
    pen.paint(()=>{ g.ellipse(cx, cy+ry*0.06, inRx, inRy, 0, 0, 7); }, toneSolid(inkLevel(6)), 4);
    // cast-shadow crescent along the far inner lip -> depth of the cut
    g.save(); g.globalAlpha=0.7;
    pen.fillPath(()=>{
      g.ellipse(cx, cy+ry*0.06 - inRy*0.30, inRx*0.94, inRy*0.55, 0, Math.PI, Math.PI*2);
    }, inkLevel(7));
    g.restore();
  }

  /* ---- BLOOD: the pool state carried inside the pit ---- */
  if (has("blood")){
    const br = rnd(1141);
    if (phase==="filled"){
      // the dark blood pool nearly to the brim (darkest solid -> heavy dot field)
      pen.paint(()=>{ blob(g, cx, cy+ry*0.10, inRx*0.96, inRy*0.92, br, 0.10, 28); },
        toneSolid(inkLevel(7)), 3);
      // liquid meniscus: a thin bright rim along the near surface edge
      g.save(); g.strokeStyle=inkLevel(2); g.lineWidth=Math.max(2,W*0.004); g.globalAlpha=0.8;
      g.beginPath(); g.ellipse(cx, cy+ry*0.10, inRx*0.80, inRy*0.72, 0, 0.15*Math.PI, 0.85*Math.PI); g.stroke();
      g.restore();
      // a sheen highlight where the light catches the surface
      g.save(); g.globalAlpha=0.85;
      pen.fillPath(()=>{ blob(g, cx-inRx*0.28, cy-inRy*0.10, inRx*0.22, inRy*0.16, br, 0.3, 12); }, inkLevel(3));
      g.restore();
      // runnels of blood that have crept over the near rim toward the living side
      for(let i=0;i<params.runnels;i++){
        const dx=lerp(-0.5,0.5,(i+0.5)/params.runnels);
        const sx=cx+dx*inRx*0.9, sy=cy+inRy*0.55;
        pen.paint(()=>{
          g.moveTo(sx-W*0.012, sy);
          g.quadraticCurveTo(sx+dx*W*0.03, sy+H*0.05, sx+dx*W*0.02, sy+H*0.085);
          g.quadraticCurveTo(sx+dx*W*0.01, sy+H*0.045, sx+W*0.012, sy);
          g.closePath();
        }, toneSolid(inkLevel(7)), 2.5);
      }
    } else { // drained
      // dry dark bottom of the emptied pit
      pen.paint(()=>{ g.ellipse(cx, cy+ry*0.06, inRx*0.88, inRy*0.84, 0, 0, 7); },
        toneSolid(inkLevel(4)), 3);
      // a residual dark stain soaked into the pit floor
      g.save(); g.globalAlpha=0.8;
      pen.fillPath(()=>{ blob(g, cx, cy+ry*0.10, inRx*0.6, inRy*0.55, br, 0.3, 18); }, inkLevel(6));
      g.restore();
      // radial dried cracks across the floor
      g.save(); g.strokeStyle=inkLevel(6); g.lineWidth=2.4; g.lineCap="round";
      for(let i=0;i<7;i++){
        const a=(i/7)*Math.PI*2 + 0.3;
        g.beginPath(); g.moveTo(cx,cy+ry*0.08);
        g.lineTo(cx+Math.cos(a)*inRx*0.85, cy+ry*0.08+Math.sin(a)*inRy*0.8); g.stroke();
      }
      g.restore();
    }
  }

  /* ---- BOUNDARY: the sword-drawn ward line separating living from dead ---- */
  if (has("boundary")){
    const bow=H*0.020;
    // the scored groove — a hard black cut with a bright hairline inside it
    g.save();
    g.strokeStyle=INK; g.lineWidth=Math.max(5,W*0.012); g.lineCap="round";
    g.beginPath(); groundLine(g, W, by, bow); g.stroke();
    g.strokeStyle=inkLevel(1); g.lineWidth=Math.max(2,W*0.004);
    g.beginPath(); groundLine(g, W, by, bow); g.stroke();
    g.restore();
    // ward ticks hung below the line -> the barrier the dead may not cross
    g.save(); g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.005); g.lineCap="round";
    for(let i=0;i<params.wardTicks;i++){
      const t=(i+0.5)/params.wardTicks;
      const tx=lerp(W*0.05,W*0.95,t);
      const ty=by + bow*(1 - 4*(t-0.5)*(t-0.5)) - bow;  // follow the sag
      const len=H*0.016*(0.7+0.6*(1-Math.abs(t-0.5)*2));
      g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx, ty+len); g.stroke();
    }
    g.restore();

    // the SWORD laid along the boundary — the blade that scored the line
    const swx=cx, swy=by - bow*0.2;
    const bl=W*0.30, ang=-0.04;                          // near-horizontal along the ground
    const dxu=Math.cos(ang), dyu=Math.sin(ang);
    const tipX=swx+dxu*bl*0.62,  tipY=swy+dyu*bl*0.62;   // point toward the pit side
    const gX =swx-dxu*bl*0.30,   gY =swy-dyu*bl*0.30;    // guard
    const hX =swx-dxu*bl*0.46,   hY =swy-dyu*bl*0.46;    // hilt end
    // blade
    pen.paint(()=>{
      const nx=-dyu, ny=dxu, wgt=H*0.012;
      g.moveTo(gX+nx*wgt, gY+ny*wgt);
      g.lineTo(tipX+nx*wgt*0.15, tipY+ny*wgt*0.15);
      g.lineTo(tipX, tipY);                              // point
      g.lineTo(tipX-nx*wgt*0.15, tipY-ny*wgt*0.15);
      g.lineTo(gX-nx*wgt, gY-ny*wgt);
      g.closePath();
    }, toneSolid(inkLevel(2)), 3);
    // fuller line down the blade
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.6; g.lineWidth=2;
    g.beginPath(); g.moveTo(gX,gY); g.lineTo(tipX,tipY); g.stroke(); g.restore();
    // crossguard
    pen.paint(()=>{
      const nx=-dyu, ny=dxu, gw=H*0.030;
      g.rect(0,0,0,0); // no-op to open path cleanly
      g.moveTo(gX+nx*gw, gY+ny*gw); g.lineTo(gX-nx*gw, gY-ny*gw);
      g.lineTo(gX-nx*gw-dxu*W*0.012, gY-ny*gw-dyu*W*0.012);
      g.lineTo(gX+nx*gw-dxu*W*0.012, gY+ny*gw-dyu*W*0.012);
      g.closePath();
    }, toneSolid(inkLevel(6)), 3);
    // grip + pommel
    pen.limb(()=>{ g.moveTo(gX,gY); g.lineTo(hX,hY); }, toneSolid(inkLevel(6)), H*0.012);
    pen.paint(()=>{ g.arc(hX-dxu*W*0.006, hY-dyu*W*0.006, H*0.011, 0, 7); }, toneSolid(inkLevel(7)), 3);
  }

  /* ---- CAPTIONS + blue boundary mark ---- */
  if (params.captions){
    if (has("deadside")) tracked(g, "DEAD",   W*0.055, hz+H*0.035,  W*0.024, W*0.006, INK);
    if (has("blood") && phase==="filled")
      tracked(g, "BLOOD", cx-rx*0.18, cy+ry+H*0.028, W*0.022, W*0.005, INK);
    if (has("ground")) tracked(g, "LIVING", W*0.055, H*0.945,  W*0.026, W*0.006, INK);
    if (has("boundary")){
      g.fillStyle=ACCENT; g.fillRect(W*0.90, by-H*0.028, W*0.018, H*0.006);
      tracked(g, "WARD", W*0.80, by-H*0.030, W*0.020, W*0.005, ACCENT);
    }
  }
}

export const asset = {
  id:"set_piece.blood-pit-boundary",
  type:"SET_PIECE",
  name:"Blood-Pit Boundary",
  statusWord:"WARDED",
  scene:"OD-B11-S02",

  params,
  // back -> front depth layers; scene state can pass a subset
  layers:["ground","deadside","trench","blood","boundary"],
  // normalized 0..1 placement / contact / camera anchors
  anchors:{
    "trench:center":  { x:L.trenchCX, y:L.trenchCY },
    "blood:surface":  { x:L.trenchCX, y:L.trenchCY+0.02 },
    "boundary:left":  { x:0.05, y:L.boundaryY },
    "boundary:mid":   { x:0.50, y:L.boundaryY },
    "boundary:right": { x:0.95, y:L.boundaryY },
    "sword:planted":  { x:0.50, y:L.boundaryY-0.01 },
    "stand:speaker":  { x:0.50, y:0.905 },      // the living speaker's ground (near side)
    "muster:dead":    { x:0.50, y:L.deadY },    // where the waiting dead press (far side)
    "approach:left":  { x:0.14, y:0.88 },
    "approach:right": { x:0.86, y:0.88 },
    "camera:wide":    { x:0.50, y:0.52 },
    "camera:trench":  { x:L.trenchCX, y:L.trenchCY },
  },
  // collision boundaries + walkable ground (normalized boxes)
  zones:{
    living:   { x0:0.04, y0:L.boundaryY, x1:0.96, y1:0.98 },   // speaker may stand
    dead:     { x0:0.04, y0:L.horizon,   x1:0.96, y1:L.trenchCY-0.10 }, // dead muster here
    barrier:  { x0:0.0,  y0:L.boundaryY-0.02, x1:1.0, y1:L.boundaryY+0.02 }, // the ward line
    pit:      { x0:L.trenchCX-L.trenchRX, y0:L.trenchCY-L.trenchRY,
                x1:L.trenchCX+L.trenchRX, y1:L.trenchCY+L.trenchRY },       // no-walk hole
  },
  // the explicit separation line the scene enforces
  boundary:{ y:L.boundaryY, kind:"sword-drawn", permits:"speaker-only", crossable:false },
  states:{
    initial:"filled",
    nodes:{
      // blood in the pit, dead pressing to the line, permission withheld
      filled:{ preview:{ phase:"filled",
        layers:["ground","deadside","trench","blood","boundary"], status:"WARDED", progress:.55 } },
      // pit gone dry — blood drunk/spent, only stain and cracks remain
      drained:{ preview:{ phase:"drained",
        layers:["ground","deadside","trench","blood","boundary"], status:"DRAINED", progress:.90 } },
    },
    edges:[["filled","drained"],["drained","filled"]],
  },
  channels:["fill","ward","muster","light"],

  preview:()=>({
    phase:"filled",
    layers:["ground","deadside","trench","blood","boundary"],
    status:"WARDED", progress:.55,
  }),
  draw(ctx,W,H,state){ drawTrench(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones, boundary:asset.boundary }; },
};
export default asset;
