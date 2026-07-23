/* divine_fx.imagined-armed-odysseus — the absent king, conjured at his own gate.
   DIVINE_FX asset. Scene function (OD-B01-S05): a brief THOUGHT-IMAGE of the
   missing Odysseus flashes at the palace gates — a ghostly, OUTLINED apparition
   (never a solid figure) of a crested-helmeted hoplite with a round shield and
   twin spears. Procedural:
     source  = the imaginer at the threshold (a mind at the gate)
     field   = a shimmering halo the vision hangs inside
     target  = the empty gateway where the king should stand
     duration= a brief flash: forming -> present -> fading
     consequence = a ghost echo + immaterial shimmer that never fully lands.
   The apparition is drawn as pure CONTOUR over near-paper fill so the engine
   POST pass renders it as a translucent line-image, not a solid body. Solid
   grays + hard contour only; do NOT pre-dither. Animate over state.t. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  gateLevel:   0.14,   // top of the gateposts as frac of H
  floorLevel:  0.86,   // threshold floor line as frac of H
  postX:       0.16,   // gatepost inset from each side (frac of W)
  haloRings:   4,      // concentric shimmer arcs of the vision field
  solidity:    1.0,    // how manifest the apparition is (channel-driven, 0..1)
  shimmer:     1.0,    // immateriality flicker gain
};

const TAU = Math.PI*2;

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t || 0;
  const solidity = clamp(st.solidity!=null?st.solidity:params.solidity, 0, 1);
  const shimGain = st.shimmer!=null?st.shimmer:params.shimmer;
  const pulse = 0.5 + 0.5*Math.sin(t*1.6);              // 0..1 breathing vision
  const flick = 0.85 + 0.15*Math.sin(t*7.0);            // fast flicker

  const cx     = W*0.50;
  const floorY = H*params.floorLevel;

  // figure metrics (a standing hoplite in the gateway)
  const ghost  = toneSolid(inkLevel(1));                // near-paper interior => translucent
  const headCy = H*0.295, hw = W*0.056, hh = H*0.050;
  const shoulderY = H*0.355, waistY = H*0.545;
  const shoulderW = W*0.115, waistW = W*0.078;
  const hipY = H*0.600, kneeY = H*0.710, footY = H*0.830;

  const layers = st.layers || ["gate","halo","thought","echo","figure","shimmer"];
  const has = l => layers.includes(l);

  /* ---------- GATE: the palace threshold (the target place) ---------- */
  function drawGate(){
    const postW = W*0.085, postTop = H*params.gateLevel;
    // threshold floor (light ground)
    g.fillStyle = inkLevel(2); g.fillRect(0,floorY,W,H-floorY);
    pen.ink(()=>{ g.moveTo(0,floorY); g.lineTo(W,floorY); }, 3);
    // lintel across the top of the gateway
    pen.paint(()=>{ g.rect(W*0.09, postTop-H*0.055, W*0.82, H*0.05); }, toneSolid(inkLevel(3)), 5);
    pen.paint(()=>{ g.rect(W*0.06, postTop-H*0.075, W*0.88, H*0.022); }, toneSolid(inkLevel(4)), 4);
    // two gateposts
    for(const s of [-1,1]){
      const px = cx + s*W*(0.5-params.postX-0.02);
      pen.paint(()=>{ g.rect(px-postW/2, postTop, postW, floorY-postTop); }, toneSolid(inkLevel(3)), 5);
      // capital + base
      pen.paint(()=>{ g.rect(px-postW*0.74, postTop, postW*1.48, H*0.028); }, toneSolid(inkLevel(4)), 4);
      pen.paint(()=>{ g.rect(px-postW*0.74, floorY-H*0.030, postW*1.48, H*0.030); }, toneSolid(inkLevel(4)), 4);
      // a couple of block seams up the shaft
      for(let j=1;j<=4;j++){ const yy=postTop+(floorY-postTop)*j/5; pen.seam(()=>{ g.moveTo(px-postW/2,yy); g.lineTo(px+postW/2,yy); }, 2); }
    }
  }

  /* ---------- HALO: the shimmering vision field the image hangs in ---------- */
  function drawHalo(){
    const hcx=cx, hcy=H*0.44;
    for(let k=0;k<params.haloRings;k++){
      const r = W*0.20 + k*W*0.058 + pulse*W*0.014*(k+1);
      g.strokeStyle = inkLevel(clamp(Math.round(2 - k*0.4),1,2));
      g.lineWidth = lerp(4,1.5,k/params.haloRings); g.lineCap="round";
      const segs = 9 + k*2;
      for(let s=0;s<segs;s++){
        const a0 = (s/segs)*TAU + pulse*0.3 + k*0.45;
        const a1 = a0 + (TAU/segs)*0.52;
        g.beginPath(); g.ellipse(hcx,hcy,r,r*1.16,0,a0,a1); g.stroke();
      }
    }
  }

  /* ---------- THOUGHT: the imaginer at the threshold + connective puffs ----------
     the source of the vision — a mind at the gate reaching for the absent king */
  function drawThought(){
    const sx=W*0.205, sy=H*0.795;
    g.fillStyle = inkLevel(4); g.beginPath(); g.arc(sx,sy,W*0.013,0,TAU); g.fill();   // the imaginer
    // dashed arc up to the apparition
    g.strokeStyle = inkLevel(3); g.lineWidth=2; g.setLineDash([5,9]);
    g.beginPath(); g.moveTo(sx,sy); g.quadraticCurveTo(W*0.30,H*0.52,cx-hw*1.2,headCy+hh); g.stroke();
    g.setLineDash([]);
    // three swelling thought puffs along the line
    g.strokeStyle = inkLevel(2); g.lineWidth=2;
    for(let i=1;i<=3;i++){
      const u=i/4, x=lerp(sx,cx-hw*1.2,u)+Math.sin(u*3)*W*0.02, y=lerp(sy,headCy+hh,u*u);
      g.beginPath(); g.arc(x,y,W*(0.010+0.006*i),0,TAU); g.stroke();
    }
  }

  /* ---------- ECHO: the ghost trail — the image never fully lands ---------- */
  function drawEcho(){
    const dx = W*0.012 + Math.sin(t*1.3)*W*0.010*shimGain;
    g.save(); g.translate(dx,0); g.globalAlpha=0.55*solidity;
    g.strokeStyle=inkLevel(3); g.lineWidth=3; g.lineCap="round"; g.lineJoin="round";
    g.beginPath(); g.ellipse(cx,headCy,hw,hh,0,0,TAU); g.stroke();               // helmet echo
    g.beginPath();
    g.moveTo(cx-shoulderW,shoulderY);
    g.lineTo(cx-waistW,waistY); g.lineTo(cx-W*0.052,footY);
    g.lineTo(cx+W*0.052,footY); g.lineTo(cx+waistW,waistY);
    g.lineTo(cx+shoulderW,shoulderY); g.stroke();                                // body echo
    g.restore(); g.globalAlpha=1;
  }

  /* ---------- FIGURE: the OUTLINED armed apparition ---------- */
  function drawFigure(){
    g.save();
    g.globalAlpha = (0.62 + 0.38*solidity) * flick;      // manifest level -> translucency

    // --- legs (outlined limbs, light core) ---
    for(const s of [-1,1]){
      const hx=cx+s*W*0.040, kx=cx+s*W*0.050, fx=cx+s*W*0.050;
      pen.limb(()=>{ g.moveTo(hx,hipY); g.lineTo(kx,kneeY); }, ghost, W*0.030);
      pen.limb(()=>{ g.moveTo(kx,kneeY); g.lineTo(fx,footY); }, ghost, W*0.026);
      pen.seam(()=>{ g.moveTo(fx-W*0.024,kneeY); g.lineTo(fx+W*0.024,kneeY); }, 2);   // greave rim
      pen.paint(()=>{ g.ellipse(fx, footY+H*0.006, W*0.042, H*0.013,0,0,TAU); }, toneSolid(inkLevel(2)), 3);
    }

    // --- pteruges (skirt strips) ---
    pen.paint(()=>{ g.rect(cx-waistW*1.06, waistY, waistW*2.12, hipY-waistY); }, ghost, 4);
    for(let i=-3;i<=3;i++){ const xx=cx+i*(waistW*2.12/7); pen.seam(()=>{ g.moveTo(xx,waistY+H*0.006); g.lineTo(xx,hipY); }, 2); }

    // --- cuirass torso ---
    const midY=(shoulderY+waistY)/2;
    pen.paint(()=>{
      g.moveTo(cx-shoulderW, shoulderY);
      g.quadraticCurveTo(cx-shoulderW*1.12, midY, cx-waistW, waistY);
      g.lineTo(cx+waistW, waistY);
      g.quadraticCurveTo(cx+shoulderW*1.12, midY, cx+shoulderW, shoulderY);
      g.quadraticCurveTo(cx, shoulderY-H*0.022, cx-shoulderW, shoulderY);
      g.closePath();
    }, ghost, 5);
    // muscle / plate seams
    pen.seam(()=>{ g.moveTo(cx-shoulderW*0.6, shoulderY+H*0.028); g.quadraticCurveTo(cx, shoulderY+H*0.058, cx+shoulderW*0.6, shoulderY+H*0.028); }, 2);
    pen.seam(()=>{ g.moveTo(cx, shoulderY+H*0.030); g.lineTo(cx, waistY); }, 2);
    for(let i=1;i<=3;i++){ const yy=shoulderY+H*0.070+i*H*0.030; pen.seam(()=>{ g.moveTo(cx-waistW*0.72,yy); g.lineTo(cx+waistW*0.72,yy); }, 2); }

    // --- neck ---
    pen.limb(()=>{ g.moveTo(cx, headCy+hh*0.6); g.lineTo(cx, shoulderY); }, ghost, W*0.028);

    // --- far (shield) arm, drawn before the shield so the shield fronts it ---
    pen.limb(()=>{ g.moveTo(cx-shoulderW*0.85, shoulderY+H*0.010); g.lineTo(cx-W*0.088, H*0.470); }, ghost, W*0.028);

    // --- ROUND SHIELD (hoplon) on the far arm ---
    const sc={x:cx-W*0.095,y:H*0.478}, R=W*0.140;
    pen.paint(()=>{ g.arc(sc.x,sc.y,R,0,TAU); }, ghost, 5);
    pen.ink(()=>{ g.arc(sc.x,sc.y,R*0.80,0,TAU); }, 2);
    pen.ink(()=>{ g.arc(sc.x,sc.y,R*0.52,0,TAU); }, 2);
    pen.paint(()=>{ g.arc(sc.x,sc.y,R*0.16,0,TAU); }, toneSolid(inkLevel(5)), 3);   // central boss (accent)
    // a simple blazon spoke pattern
    for(let i=0;i<6;i++){ const a=(i/6)*TAU + Math.PI/6; pen.ink(()=>{ g.moveTo(sc.x+Math.cos(a)*R*0.16,sc.y+Math.sin(a)*R*0.16); g.lineTo(sc.x+Math.cos(a)*R*0.52,sc.y+Math.sin(a)*R*0.52); }, 1.5); }

    // --- near (spear) arm ---
    const rsh={x:cx+shoulderW*0.85,y:shoulderY+H*0.010};
    const rel={x:cx+W*0.115,y:H*0.445};
    const rwr={x:cx+W*0.140,y:H*0.520};
    pen.limb(()=>{ g.moveTo(rsh.x,rsh.y); g.lineTo(rel.x,rel.y); }, ghost, W*0.028);
    pen.limb(()=>{ g.moveTo(rel.x,rel.y); g.lineTo(rwr.x,rwr.y); }, ghost, W*0.024);
    pen.paint(()=>{ g.arc(rwr.x,rwr.y,W*0.020,0,TAU); }, ghost, 3);   // gripping fist

    // --- HELMET (Corinthian) + crest ---
    // dome
    pen.paint(()=>{ g.ellipse(cx, headCy, hw, hh, 0, 0, TAU); }, ghost, 4);
    // cheek / face guard drops
    pen.paint(()=>{
      g.moveTo(cx-hw*0.92, headCy);
      g.quadraticCurveTo(cx-hw*0.9, headCy+hh*1.15, cx-hw*0.4, headCy+hh*1.05);
      g.lineTo(cx-hw*0.35, headCy+hh*0.4);
      g.lineTo(cx-hw*0.92, headCy);
      g.closePath();
    }, ghost, 3);
    // nose guard
    pen.seam(()=>{ g.moveTo(cx, headCy-hh*0.25); g.lineTo(cx, headCy+hh*0.95); }, 3);
    // eye slits (small dark accents => the vision "looks back")
    g.fillStyle=inkLevel(6);
    g.beginPath(); g.ellipse(cx-hw*0.42, headCy-hh*0.05, hw*0.16, hh*0.11, 0,0,TAU); g.fill();
    g.beginPath(); g.ellipse(cx+hw*0.42, headCy-hh*0.05, hw*0.16, hh*0.11, 0,0,TAU); g.fill();
    // crest stalk + tall arching plume (a Corinthian horsehair crest, waves with t)
    const wave = Math.sin(t*2.0)*hw*0.18;
    pen.paint(()=>{ g.rect(cx-hw*0.12, headCy-hh*1.35, hw*0.24, hh*0.55); }, ghost, 2);   // crest stalk
    // the plume: a bold crescent sweeping up and back off the helmet crown
    pen.paint(()=>{
      g.moveTo(cx-hw*0.28, headCy-hh*0.95);
      g.quadraticCurveTo(cx-hw*0.55, headCy-hh*3.15, cx+hw*0.60+wave, headCy-hh*3.05);
      g.quadraticCurveTo(cx+hw*1.55+wave, headCy-hh*2.95, cx+hw*1.30+wave, headCy-hh*1.20);
      g.quadraticCurveTo(cx+hw*1.05, headCy-hh*2.05, cx+hw*0.30, headCy-hh*1.95);
      g.quadraticCurveTo(cx-hw*0.05, headCy-hh*1.55, cx+hw*0.20, headCy-hh*0.92);
      g.closePath();
    }, ghost, 3);
    // horsehair combing ridges along the plume
    g.strokeStyle=inkLevel(4); g.lineWidth=2;
    for(let i=0;i<8;i++){ const u=i/8;
      const bx=lerp(cx-hw*0.1, cx+hw*1.25+wave, u), by=lerp(headCy-hh*1.05, headCy-hh*3.0, Math.sin(u*1.5));
      g.beginPath(); g.moveTo(bx,by); g.lineTo(bx+hw*0.18, by+hh*0.45); g.stroke(); }

    // --- TWIN SPEARS held at the fist ---
    for(const off of [-W*0.006, W*0.026]){
      const bx = rwr.x + off, topY = H*0.085, botY = H*0.780;
      pen.limb(()=>{ g.moveTo(bx, topY); g.lineTo(bx, botY); }, toneSolid(inkLevel(3)), W*0.009);
      // leaf spearhead (bold dark accent so it reads as a weapon)
      pen.paint(()=>{
        g.moveTo(bx, topY-H*0.048);
        g.lineTo(bx-W*0.020, topY-H*0.004);
        g.lineTo(bx, topY+H*0.028);
        g.lineTo(bx+W*0.020, topY-H*0.004);
        g.closePath();
      }, toneSolid(inkLevel(6)), 3);
      pen.seam(()=>{ g.moveTo(bx, topY-H*0.044); g.lineTo(bx, topY+H*0.024); }, 1.5);   // blade midrib
      // socket collar
      pen.paint(()=>{ g.rect(bx-W*0.010, topY+H*0.028, W*0.020, H*0.012); }, toneSolid(inkLevel(4)), 2);
      // butt-spike (sauroter)
      pen.ink(()=>{ g.moveTo(bx, botY); g.lineTo(bx, botY+H*0.02); }, 2);
    }

    g.restore();
  }

  /* ---------- SHIMMER: the immaterial scan + sparks (visible consequence) ---------- */
  function drawShimmer(){
    const x0=cx-W*0.24, x1=cx+W*0.24, y0=H*0.19, y1=H*0.83;
    g.strokeStyle=inkLevel(2); g.lineWidth=1.5;
    const phase=(t*0.14)%1;
    for(let i=0;i<7;i++){ const yy=y0+(((i/7)+phase)%1)*(y1-y0);
      g.globalAlpha=0.45*shimGain; g.beginPath(); g.moveTo(x0,yy); g.lineTo(x1,yy); g.stroke(); }
    g.globalAlpha=1;
    // orbiting sparks -> the flash never settling
    g.fillStyle=inkLevel(5);
    const n=9;
    for(let i=0;i<n;i++){
      const a=(i/n)*TAU + t*0.6 + i;
      const r=W*(0.17+0.05*Math.sin(t*2+i));
      const x=cx+Math.cos(a)*r, y=H*0.44+Math.sin(a)*r*1.12;
      const rad=(1.5+2.2*(0.5+0.5*Math.sin(t*3+i*2)))*shimGain;
      g.beginPath(); g.arc(x,y,Math.max(0.6,rad),0,TAU); g.fill();
    }
  }

  if (has("gate"))    drawGate();
  if (has("halo"))    drawHalo();
  if (has("thought")) drawThought();
  if (has("echo"))    drawEcho();
  if (has("figure"))  drawFigure();
  if (has("shimmer")) drawShimmer();

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.imagined-armed-odysseus",
  type:"DIVINE_FX",
  name:"Imagined armed Odysseus",
  statusWord:"CONJURED",
  scene:"OD-B01-S05",

  params,
  // back -> front; scene state may pass a subset of layers
  layers:["gate","halo","thought","echo","figure","shimmer"],
  // normalized 0..1 anchors: source, field, target, the apparition + its arms
  anchors:{
    "source:imaginer":{x:.205,y:.795},     // the mind at the threshold (source)
    "field:halo":{x:.50,y:.44},            // the vision field
    "target:gateway":{x:.50,y:.50},        // where the absent king should stand
    "apparition:head":{x:.50,y:.295},
    "apparition:heart":{x:.50,y:.45},
    "apparition:feet":{x:.50,y:.83},
    "prop:shield":{x:.405,y:.478},
    "prop:spear-tip":{x:.55,y:.085},
    "gate:left":{x:.16,y:.50}, "gate:right":{x:.84,y:.50},
    "gate:threshold":{x:.50,y:.86},
    "camera:wide":{x:.50,y:.50},
  },
  // affected regions (for scene placement / pathing)
  zones:{
    apparition:{ x0:.26,y0:.20,x1:.74,y1:.84 },
    gateway:{ x0:.20,y0:.14,x1:.80,y1:.86 },
  },

  // DIVINE_FX state machine: a BRIEF flash — forming -> present -> fading
  states:{
    initial:"present",
    nodes:{
      // forming: the image coalesces out of the shimmer, barely there
      forming:{ preview:{ t:0.4, solidity:0.30, shimmer:1.4, status:"FORMING", progress:.12 } },
      // present: the armed king stands clear in the gateway (neutral card state)
      present:{ preview:{ t:1.6, solidity:1.00, shimmer:0.9, status:"CONJURED", progress:.48 } },
      // fading: the thought releases — echo and shimmer outlast the body
      fading:{  preview:{ t:2.8, solidity:0.45, shimmer:1.6, status:"FADING",  progress:.82 } },
    },
    edges:[["forming","present"],["present","fading"],["fading","present"],["fading","forming"]],
  },
  duration:4.0,
  channels:["manifest","solidity","shimmer","flicker","t"],

  preview:()=>({ t:1.6, solidity:1.0, shimmer:0.9, status:"CONJURED", progress:.48,
                 layers:["gate","halo","thought","echo","figure","shimmer"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
