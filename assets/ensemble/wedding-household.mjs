/* ensemble.wedding-household — a great house mid-celebration.
   ENSEMBLE asset. A repeatable group built from ONE separable member
   template whose ROLE selects a distinct silhouette + prop + pose:
   kinsmen, a bride + groom pair, a bard with lyre, tumblers, servants
   bearing jugs, and a stable attendant with a horse — instanced N times
   across depth bands with formation / density / attention / reaction-wave
   and foreground/background controls. Drawn in SOLID grays + hard contour
   into the offscreen ctx; the engine dotify POST pass supplies the halftone.
   Do NOT bake in named characters.
   Atlas OD-B04-S01 — kinsmen, brides, grooms, bard, tumblers, servants,
   stable attendants in layered celebration. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

/* ---- the celebrant roles the scene requires ---- */
const ROLES = ["kinsman","bride","groom","bard","tumbler","servant","stable"];

/* roster: a separable template applied to a deterministic list.
   band 0=back(small,light) .. 2=front(large,dark). x is normalized 0..1.
   flip: +1 faces right, -1 faces left. */
const MEMBERS = [
  // ---- back band: the kinfolk crowd + a serving hand ----
  { role:"kinsman", band:0, x:0.13, flip:1  },
  { role:"servant", band:0, x:0.38, flip:1  },
  { role:"kinsman", band:0, x:0.61, flip:-1 },
  { role:"kinsman", band:0, x:0.87, flip:-1 },
  // ---- mid band: bard, the wedded pair, and the stable hand w/ horse ----
  { role:"bard",    band:1, x:0.13, flip:1  },
  { role:"bride",   band:1, x:0.41, flip:1  },
  { role:"groom",   band:1, x:0.58, flip:-1 },
  { role:"stable",  band:1, x:0.83, flip:1  },
  // ---- front band: tumblers vaulting in the foreground ----
  { role:"tumbler", band:2, x:0.25, flip:1  },
  { role:"tumbler", band:2, x:0.70, flip:-1 },
];

const params = {
  count: MEMBERS.length,
  bands: 3,
  floorLevel: 0.42,          // horizon fraction of H
  focus: { x:0.49, y:0.66 }, // the wedded pair — where attention turns
  attention: 0.55,           // 0 all busy .. 1 all turned to the couple
  spread: 1.0,               // formation width multiplier about centre
  density: 1.0,              // 0 front band only .. 1 full household
  garlands: true,            // festal swags across the back wall
};

const BAND_Y   = [0.575, 0.735, 0.945];   // footline per band
const BAND_S   = [150, 205, 280];         // member height px per band
const BAND_LVL = [3, 4, 4];               // garment ink level per band

/* two-segment arm from a shoulder to a wrist target, via a bent elbow. */
function armTo(pen,g,sh,wr,bend,s,tone,cw){
  const mx=(sh.x+wr.x)/2 + bend.x, my=(sh.y+wr.y)/2 + bend.y;
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(mx,my); g.lineTo(wr.x,wr.y); }, tone, s*0.052);
  pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.032,0,7); }, toneSolid(inkLevel(2)), cw*0.7);
  return wr;
}

/* ============================================================
   MEMBER TEMPLATE — one celebrant, drawn deterministically.
   cx/footY/s in px; role selects garment tone + headwear + arms + prop.
   ============================================================ */
function celebrant(pen, g, cx, footY, s, role, lvl, m, opt){
  const F = m.flip;
  const skin = toneSolid(inkLevel(2));
  const hair = toneSolid(inkLevel(6));
  const cw   = Math.max(3, s*0.020);

  // TUMBLER is a wholly different rig (airborne) — handle first.
  if (role==="tumbler"){ drawTumbler(pen,g,cx,footY,s,F,skin,cw,opt); return; }
  // STABLE attendant brings a horse rendered beside the figure.
  if (role==="stable"){ drawHorse(pen,g,cx,footY,s,F,cw); }

  // garment tone per role (bride pale, groom/bard mid, kin darker-mid)
  let gLvl = lvl;
  if (role==="bride") gLvl = 2;
  else if (role==="bard") gLvl = 3;
  else if (role==="groom") gLvl = lvl;
  const cloth = toneSolid(inkLevel(gLvl));

  const hemY = footY;
  const torsoH = s*0.60;
  const shoulderY = hemY - torsoH;
  const shoulderW = s*0.30;
  const hemW = s*0.42;
  const headR = s*0.125;
  const headCy = shoulderY - headR*1.15;
  const hx = cx + (opt.headDX||0);
  const hy = headCy - (opt.headUp||0);

  // ground shadow
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, hemY+s*0.015, hemW*0.62, s*0.045, 0,0,7); g.fill();

  // bride veil BACK layer (drapes behind shoulders) — drawn before torso
  if (role==="bride"){
    pen.paint(()=>{
      g.moveTo(hx-headR*1.15, hy);
      g.quadraticCurveTo(cx-hemW*0.8, shoulderY, cx-hemW*0.55, hemY-s*0.04);
      g.lineTo(cx+hemW*0.55, hemY-s*0.04);
      g.quadraticCurveTo(cx+hemW*0.8, shoulderY, hx+headR*1.15, hy);
      g.quadraticCurveTo(hx, hy-headR*1.4, hx-headR*1.15, hy);
    }, toneSolid(inkLevel(1)), cw*0.9);
  }

  // --- TORSO tunic (blocky trapezoid) ---
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2, shoulderY);
    g.lineTo(cx+shoulderW/2, shoulderY);
    g.lineTo(cx+hemW/2, hemY);
    g.lineTo(cx-hemW/2, hemY);
    g.closePath();
  }, cloth, cw);
  // belt + a vertical fold seam
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.52,shoulderY+torsoH*0.42); g.lineTo(cx+shoulderW*0.52,shoulderY+torsoH*0.42); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx, shoulderY+torsoH*0.5); g.lineTo(cx, hemY); }, cw*0.55);

  // --- NECK + HEAD ---
  pen.limb(()=>{ g.moveTo(cx,shoulderY+s*0.01); g.lineTo(hx,hy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0,7); }, skin, cw);

  // headwear / hair per role
  if (role==="bride"){
    // pale veil crown over the head
    pen.paint(()=>{ g.arc(hx, hy-headR*0.05, headR*1.12, Math.PI*0.98, Math.PI*2.02); }, toneSolid(inkLevel(2)), cw*0.8);
  } else {
    // hair cap over the crown
    pen.paint(()=>{ g.arc(hx, hy-headR*0.05, headR*1.02, Math.PI*(1.02), Math.PI*(1.98)); }, hair, cw*0.8);
  }
  if (role==="groom"){
    // celebratory wreath: a ring of small leaves round the crown
    for(let i=0;i<7;i++){ const a=Math.PI*(1.06+ i*0.13);
      const rx=hx+Math.cos(a)*headR*1.02, ry=hy+Math.sin(a)*headR*1.02;
      pen.paint(()=>{ g.ellipse(rx,ry,headR*0.16,headR*0.10, a,0,7); }, toneSolid(inkLevel(5)), cw*0.6);
    }
  }

  // --- ROLE ARMS + PROP ---
  const shL={x:cx-shoulderW*0.44, y:shoulderY+s*0.05};
  const shR={x:cx+shoulderW*0.44, y:shoulderY+s*0.05};

  if (role==="kinsman"){
    // one arm raised in a toast, cup in hand; other hand on hip
    const upSh = F>0 ? shR : shL;
    const dnSh = F>0 ? shL : shR;
    const wr={x:upSh.x+F*s*0.10, y:shoulderY-s*0.14};
    armTo(pen,g,upSh,wr,{x:F*s*0.05,y:-s*0.02},s,cloth,cw);
    // cup
    pen.paint(()=>{ g.moveTo(wr.x-s*0.045,wr.y-s*0.02); g.lineTo(wr.x+s*0.045,wr.y-s*0.02); g.lineTo(wr.x+s*0.03,wr.y-s*0.09); g.lineTo(wr.x-s*0.03,wr.y-s*0.09); g.closePath(); }, toneSolid(inkLevel(6)), cw*0.7);
    // resting arm to hip
    const wr2={x:dnSh.x-F*s*0.02, y:shoulderY+s*0.30};
    armTo(pen,g,dnSh,wr2,{x:-F*s*0.04,y:0},s,cloth,cw);
  }
  else if (role==="bride" || role==="groom"){
    // the pair reach inward toward one another; outer hand at side
    const inSh = F>0 ? shR : shL;     // flip aims inward
    const outSh= F>0 ? shL : shR;
    const wrIn={x:cx+F*s*0.24, y:shoulderY+s*0.22};
    armTo(pen,g,inSh,wrIn,{x:F*s*0.02,y:s*0.02},s,cloth,cw);
    const wrOut={x:outSh.x-F*s*0.02, y:shoulderY+s*0.34};
    armTo(pen,g,outSh,wrOut,{x:-F*s*0.03,y:0},s,cloth,cw);
  }
  else if (role==="bard"){
    // a lyre held at the chest, one hand plucking the strings
    const lx=cx+F*s*0.20, ly=shoulderY+s*0.20;
    // holding arm (far) cradles the frame
    armTo(pen,g,F>0?shL:shR,{x:lx-F*s*0.10,y:ly+s*0.06},{x:0,y:s*0.02},s,cloth,cw);
    // lyre body: a U-yoke with two arms and a crossbar of strings
    pen.paint(()=>{ g.moveTo(lx-s*0.11,ly+s*0.10); g.quadraticCurveTo(lx,ly+s*0.20,lx+s*0.11,ly+s*0.10); }, toneSolid(inkLevel(1)), cw*0.9);
    pen.limb(()=>{ g.moveTo(lx-s*0.11,ly+s*0.10); g.lineTo(lx-s*0.14,ly-s*0.12); }, toneSolid(inkLevel(6)), s*0.03);
    pen.limb(()=>{ g.moveTo(lx+s*0.11,ly+s*0.10); g.lineTo(lx+s*0.14,ly-s*0.12); }, toneSolid(inkLevel(6)), s*0.03);
    pen.limb(()=>{ g.moveTo(lx-s*0.14,ly-s*0.12); g.lineTo(lx+s*0.14,ly-s*0.12); }, toneSolid(inkLevel(6)), s*0.028);
    for(let i=0;i<4;i++){ const sx=lx-s*0.075+i*s*0.05;
      pen.ink(()=>{ g.moveTo(sx,ly-s*0.10); g.lineTo(sx,ly+s*0.11); }, cw*0.4); }
    // plucking arm (near)
    armTo(pen,g,F>0?shR:shL,{x:lx-F*s*0.02,y:ly},{x:F*s*0.02,y:0},s,cloth,cw);
  }
  else if (role==="servant"){
    // a wine jug lifted on one shoulder-high arm
    const upSh = F>0 ? shR : shL;
    const wr={x:upSh.x+F*s*0.14, y:shoulderY-s*0.02};
    armTo(pen,g,upSh,wr,{x:F*s*0.06,y:-s*0.04},s,cloth,cw);
    // amphora jug (bellied, with a neck + handle)
    pen.paint(()=>{ g.ellipse(wr.x+F*s*0.02, wr.y-s*0.10, s*0.07, s*0.11, 0,0,7); }, toneSolid(inkLevel(5)), cw*0.8);
    pen.paint(()=>{ g.rect(wr.x+F*s*0.02-s*0.02, wr.y-s*0.24, s*0.04, s*0.06); }, toneSolid(inkLevel(5)), cw*0.7);
    pen.ink(()=>{ g.arc(wr.x+F*s*0.09, wr.y-s*0.15, s*0.045, -Math.PI*0.5, Math.PI*0.5); }, cw*0.6);
    // steadying arm below
    const wr2={x:cx+F*s*0.10, y:shoulderY+s*0.26};
    armTo(pen,g,F>0?shL:shR,wr2,{x:0,y:s*0.02},s,cloth,cw);
  }
  else if (role==="stable"){
    // one hand out holding the rein toward the horse (drawn earlier), other at side
    const outSh = F>0 ? shR : shL;
    const wr={x:cx+F*s*0.26, y:shoulderY+s*0.16};
    armTo(pen,g,outSh,wr,{x:F*s*0.04,y:0},s,cloth,cw);
    pen.ink(()=>{ g.moveTo(wr.x,wr.y); g.lineTo(cx+F*s*0.62, footY-s*0.52); }, cw*0.6); // rein line to muzzle
    const wr2={x:cx-F*s*0.04, y:shoulderY+s*0.30};
    armTo(pen,g,F>0?shL:shR,wr2,{x:0,y:0},s,cloth,cw);
  }
}

/* ---- TUMBLER: an airborne acrobat mid-cartwheel — hips are the hub, head +
   two arms fan UP-and-out, two legs kick DOWN-and-out in a clear spread. ---- */
function drawTumbler(pen,g,cx,footY,s,F,skin,cw,opt){
  const hub = { x:cx, y:footY - s*0.40 };     // hips, hovering above the floor
  const tone = toneSolid(inkLevel(4));
  // faint ground shadow (they are up)
  g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, footY+s*0.005, s*0.13, s*0.028, 0,0,7); g.fill();
  // a slim leaning torso from hips up to the shoulders
  const sh = { x:hub.x - F*s*0.06, y:hub.y - s*0.24 };
  pen.limb(()=>{ g.moveTo(hub.x,hub.y); g.lineTo(sh.x,sh.y); }, tone, s*0.085);
  // two arms fan up-and-outward from the shoulders
  const arm=(dx,dy)=>{ pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(sh.x+dx,sh.y+dy); }, tone, s*0.05);
    pen.paint(()=>{ g.arc(sh.x+dx,sh.y+dy,s*0.03,0,7); }, skin, cw*0.7); };
  arm(-F*s*0.26, -s*0.10); arm(-F*s*0.10, -s*0.24);
  // two legs kick down-and-outward from the hips
  const leg=(dx,dy)=>{ pen.limb(()=>{ g.moveTo(hub.x,hub.y); g.lineTo(hub.x+dx,hub.y+dy); }, tone, s*0.06);
    pen.paint(()=>{ g.ellipse(hub.x+dx,hub.y+dy,s*0.05,s*0.026, Math.atan2(dy,dx),0,7); }, toneSolid(inkLevel(6)), cw*0.7); };
  leg( F*s*0.30, s*0.16); leg( F*s*0.12, s*0.30);
  // head clearly ON TOP at the shoulder end
  const hd={ x:sh.x - F*s*0.02, y:sh.y - s*0.15 };
  pen.paint(()=>{ g.arc(hd.x, hd.y, s*0.088, 0,7); }, skin, cw);
  pen.paint(()=>{ g.arc(hd.x, hd.y-s*0.01, s*0.09, Math.PI*1.02, Math.PI*1.98); }, toneSolid(inkLevel(6)), cw*0.7);
  // a short motion arc trailing the spin (kept well clear of the card)
  pen.ink(()=>{ g.arc(hub.x, hub.y, s*0.22, Math.PI*(1.15), Math.PI*(1.72)); }, cw*0.4);
}

/* ---- HORSE: a blocky standing horse beside the stable attendant ---- */
function drawHorse(pen,g,cx,footY,s,F,cw){
  const hx=cx+F*s*0.50, hy=footY;               // horse centred to the outer side
  const bodyW=s*0.46, bodyH=s*0.26;
  const tone=toneSolid(inkLevel(4));
  const dark=toneSolid(inkLevel(6));
  // shadow
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(hx, hy+s*0.01, bodyW*0.55, s*0.04,0,0,7); g.fill();
  // legs
  for(const lx of [-0.36,-0.12,0.12,0.36]){
    pen.limb(()=>{ g.moveTo(hx+lx*bodyW, hy-bodyH*0.5); g.lineTo(hx+lx*bodyW, hy); }, tone, s*0.045);
  }
  // barrel body
  pen.paint(()=>{ g.ellipse(hx, hy-bodyH*0.75, bodyW*0.5, bodyH*0.55, 0,0,7); }, tone, cw);
  // neck rising toward the attendant (inward = -F)
  const nx=hx-F*bodyW*0.42, ny=hy-bodyH*0.95;
  pen.paint(()=>{
    g.moveTo(nx-F*s*0.02, ny+bodyH*0.2);
    g.lineTo(nx-F*s*0.10, ny-s*0.28);
    g.lineTo(nx-F*s*0.20, ny-s*0.30);
    g.lineTo(nx-F*s*0.08, ny+bodyH*0.35);
    g.closePath();
  }, tone, cw);
  // head/muzzle
  pen.paint(()=>{ g.ellipse(nx-F*s*0.20, ny-s*0.28, s*0.10, s*0.055, F*0.4,0,7); }, tone, cw*0.9);
  // ears + mane
  pen.limb(()=>{ g.moveTo(nx-F*s*0.10,ny-s*0.30); g.lineTo(nx-F*s*0.08,ny-s*0.36); }, dark, s*0.02);
  pen.limb(()=>{ g.moveTo(nx-F*s*0.10,ny-s*0.24); g.lineTo(nx-F*s*0.04,ny+bodyH*0.3); }, dark, s*0.03);
  // tail
  pen.limb(()=>{ g.moveTo(hx+F*bodyW*0.5, hy-bodyH*0.9); g.lineTo(hx+F*bodyW*0.6, hy-s*0.02); }, dark, s*0.035);
}

/* ============================================================
   STAGE — festive hall (garlanded back wall + floor) then N members.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const attention = st.attention ?? params.attention;
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const wave      = st.wave ?? 0;
  const garlands  = st.garlands ?? params.garlands;
  const focus     = st.focus || params.focus;
  const focusX    = focus.x * W;

  // ---- back wall (mid-light) ----
  g.fillStyle=inkLevel(2); g.fillRect(0,0,W,horizon);
  pen.paint(()=>{ g.rect(W*0.04, horizon-H*0.26, W*0.92, H*0.26); }, toneSolid(inkLevel(3)), 4);
  pen.ink(()=>{ g.moveTo(W*0.04,horizon-H*0.26); g.lineTo(W*0.96,horizon-H*0.26); }, 3);
  // side pilasters
  for(const fx of [0.12,0.88]){
    pen.paint(()=>{ g.rect(W*fx-W*0.015, horizon-H*0.26, W*0.03, H*0.26); }, toneSolid(inkLevel(3)), 3);
  }

  // ---- festal GARLANDS: swagged loops with hanging drops along the wall ----
  if (garlands){
    const gy=horizon-H*0.235, n=5, x0=W*0.10, x1=W*0.90, span=(x1-x0)/n;
    for(let i=0;i<n;i++){
      const a={x:x0+i*span,y:gy}, b={x:x0+(i+1)*span,y:gy};
      pen.paint(()=>{ g.moveTo(a.x,a.y); g.quadraticCurveTo((a.x+b.x)/2, gy+H*0.055, b.x,b.y);
        g.quadraticCurveTo((a.x+b.x)/2, gy+H*0.030, a.x,a.y); }, toneSolid(inkLevel(5)), 3);
      // little hanging drop at each knot
      pen.paint(()=>{ g.ellipse(a.x, gy+H*0.006, W*0.006, H*0.014, 0,0,7); }, toneSolid(inkLevel(6)), 2);
    }
    pen.paint(()=>{ g.ellipse(x1, gy+H*0.006, W*0.006, H*0.014, 0,0,7); }, toneSolid(inkLevel(6)), 2);
  }

  // ---- floor (lightest, receding) ----
  g.fillStyle=inkLevel(1); g.fillRect(0,horizon,W,H-horizon);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.32;
  for(let i=-5;i<=5;i++){ g.beginPath(); g.moveTo(W*0.5,horizon); g.lineTo(W*0.5+i*W*0.17,H); g.stroke(); }
  for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // ---- members, back band -> front band (painter's order) ----
  const backCut = Math.round((1-density)*(params.bands-1));
  const roster = MEMBERS
    .map((m,i)=>({ m, i }))
    .filter(({m})=> density>=1 ? true : m.band >= backCut)
    .sort((a,b)=> a.m.band - b.m.band);

  roster.forEach(({m})=>{
    const footY = BAND_Y[m.band]*H;
    const s     = BAND_S[m.band];
    const lvl   = BAND_LVL[m.band];
    // formation: spread members about centre
    const nx = 0.5 + (m.x-0.5)*spread;
    const cx = clamp(nx,0.05,0.95)*W;
    // attention: turn head toward the wedded pair (tumblers exempt)
    const headDX = m.role==="tumbler" ? 0 : clamp((focusX-cx)*0.10*attention, -s*0.09, s*0.09);
    // reaction-wave: a lift that sweeps across the hall by member x
    const local = clamp(1 - Math.abs(wave - m.x)*4, 0, 1);
    const headUp = local * s*0.05 * (st.reacting?1:0);
    celebrant(pen, g, cx, footY, s, m.role, lvl, m, { headDX, headUp });
  });
}

export const asset = {
  id:"ensemble.wedding-household",
  type:"ENSEMBLE",
  name:"Wedding household",
  statusWord:"FESTAL",
  scene:"OD-B04-S01",

  params,
  // one member template + a role rig, instanced across depth bands
  member:{ template:"celebrant", roles:ROLES, roster:MEMBERS },
  // back -> front draw order
  layers:["backwall","garlands","pilasters","floor","band-back","band-mid","band-front"],
  // normalized placement / camera / focus anchors (NOT baked characters)
  anchors:{
    "focus:wedded-pair":{x:.49,y:.66},
    "place:bride":{x:.41,y:.74}, "place:groom":{x:.58,y:.74},
    "place:bard":{x:.13,y:.74},
    "place:stable":{x:.85,y:.74},
    "floor:tumblers":{x:.50,y:.90},
    "camera:wide":{x:.50,y:.55}, "camera:pair":{x:.49,y:.66},
    "entrance:left":{x:.05,y:.92}, "exit:right":{x:.95,y:.92},
  },
  // walkable celebration floor for scene pathing/placement
  zones:{ walkable:{ x0:.05,y0:.48,x1:.95,y1:.99 }, dancefloor:{ x0:.14,y0:.80,x1:.86,y1:.98 } },
  states:{
    initial:"celebrating",
    nodes:{
      celebrating:{ preview:{ attention:0.5, spread:1.0, density:1.0, reacting:false } },
      toast:{       preview:{ attention:1.0, spread:1.0, density:1.0, reacting:true, wave:0.5 } },
      thinning:{    preview:{ attention:0.3, spread:1.25, density:0.6, reacting:false } },
    },
    edges:[["celebrating","toast"],["toast","celebrating"],["celebrating","thinning"]],
  },
  channels:["attention","reaction","formation","density","light"],

  preview:()=>({ attention:0.55, spread:1.0, density:1.0, reacting:false, status:"FESTAL", progress:.24 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
