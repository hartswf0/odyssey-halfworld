/* divine_fx.poseidons-absence — the missing sea-god's charged empty place.
   DIVINE_FX asset. Scene function (OD-B01-S01): an empty, charged place in the
   Olympian council that visually carries Poseidon's opposition even though he
   is absent — a vacant throne, a dark TRIDENT silhouette standing in it as the
   emblem of who is missing, a pulsing charge FIELD, radiating discharge SPOKES,
   and a floor CONSEQUENCE ripple. Procedural: source (empty seat) -> field
   (charged aura) -> target (the council) -> visible consequence (disturbance).
   Animate everything over state.t. Solid grays + hard contour only; the engine
   POST pass supplies the halftone (do NOT pre-dither). */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  seatLevel:   0.62,   // y of the seat (where the god would sit) as frac of H
  horizon:     0.74,   // floor line as frac of H
  throneW:     0.30,   // throne width as frac of W
  auraRings:   4,      // concentric charge arcs
  spokes:      16,     // radiating discharge lines
  tridentLevel:6,      // ink level of the trident silhouette (0..7)
  intensity:   1.0,    // master charge intensity (channel-driven)
};

const TAU = Math.PI*2;

/* ---- the charged FIELD: concentric broken arcs around the empty seat ---- */
function drawAura(pen,g,W,H,cx,cy,pulse,inten){
  const baseR = W*0.16;
  for(let k=0;k<params.auraRings;k++){
    const r = baseR + k*W*0.085 + pulse*W*0.02*(k+1);
    const lvl = clamp(3 - k*0.6, 1, 3);
    g.strokeStyle = inkLevel(Math.round(lvl));
    g.lineWidth = lerp(6,2,k/params.auraRings);
    g.lineCap = "round";
    // broken arc: several segments with gaps -> reads as unstable charge
    const segs = 7 + k;
    for(let s=0;s<segs;s++){
      const a0 = (s/segs)*TAU + pulse*0.4 + k*0.3;
      const a1 = a0 + (TAU/segs)*0.6;
      const wob = 1 + Math.sin(a0*3 + pulse*TAU)*0.05*inten;
      g.beginPath();
      g.ellipse(cx,cy, r*wob, r*wob*1.02, 0, a0, a1);
      g.stroke();
    }
  }
}

/* ---- radiating discharge SPOKES: jagged sea-charge from the seat outward ---- */
function drawSpokes(pen,g,W,H,cx,cy,pulse,inten){
  const n = params.spokes;
  const rIn = W*0.13, rOut = W*0.46;
  for(let i=0;i<n;i++){
    const a = (i/n)*TAU + pulse*0.15;
    const bright = (i%4===0);
    g.strokeStyle = inkLevel(bright ? 5 : 2);
    g.lineWidth = bright ? 3.5 : 2;
    g.lineCap = "round"; g.lineJoin="round";
    const len = rOut*(0.6 + 0.4*((i*7%5)/5)) * (0.85+0.3*inten);
    // jagged 3-segment bolt
    const px = a, dx=Math.cos(a), dy=Math.sin(a), nx=-dy, ny=dx;
    const p0={x:cx+dx*rIn, y:cy+dy*rIn};
    const j1 = Math.sin(px*5 + pulse*TAU)*W*0.03*inten;
    const j2 = Math.sin(px*3 - pulse*TAU)*W*0.025*inten;
    const p1={x:cx+dx*(rIn+len*0.45)+nx*j1, y:cy+dy*(rIn+len*0.45)+ny*j1};
    const p2={x:cx+dx*(rIn+len*0.75)+nx*j2, y:cy+dy*(rIn+len*0.75)+ny*j2};
    const p3={x:cx+dx*(rIn+len),          y:cy+dy*(rIn+len)};
    g.beginPath(); g.moveTo(p0.x,p0.y); g.lineTo(p1.x,p1.y); g.lineTo(p2.x,p2.y); g.lineTo(p3.x,p3.y); g.stroke();
  }
}

/* ---- the empty THRONE: a place drawn as present but VACANT ---- */
function drawThrone(pen,g,W,H,cx,seatY){
  const tw = W*params.throneW, th = H*0.30;
  const backTop = seatY - th;
  // seat back (mid tone)
  pen.paint(()=>{ g.rect(cx-tw/2, backTop, tw, th); }, toneSolid(inkLevel(3)), 5);
  // arms
  pen.paint(()=>{ g.rect(cx-tw*0.60, seatY-th*0.34, tw*0.16, th*0.44); }, toneSolid(inkLevel(4)), 5);
  pen.paint(()=>{ g.rect(cx+tw*0.44, seatY-th*0.34, tw*0.16, th*0.44); }, toneSolid(inkLevel(4)), 5);
  // seat slab
  pen.paint(()=>{ g.rect(cx-tw*0.60, seatY-th*0.10, tw*1.20, th*0.16); }, toneSolid(inkLevel(4)), 5);
  // the VACANT cushion — bright (near paper) so the eye reads it as EMPTY
  pen.paint(()=>{ g.rect(cx-tw*0.40, seatY-th*0.14, tw*0.80, th*0.14); }, toneSolid(inkLevel(1)), 4);
  // crown finials on the seat back (so the empty seat still reads as a throne)
  pen.paint(()=>{ g.rect(cx-tw*0.52, backTop-H*0.02, tw*0.14, H*0.03); }, toneSolid(inkLevel(4)),4);
  pen.paint(()=>{ g.rect(cx+tw*0.38, backTop-H*0.02, tw*0.14, H*0.03); }, toneSolid(inkLevel(4)),4);
}

/* ---- the TRIDENT silhouette: emblem of the absent god standing in his seat ---- */
function drawTrident(pen,g,W,H,cx,seatY,lvl){
  const tone = toneSolid(inkLevel(lvl));
  const tipY   = H*0.15;         // top of the prongs
  const baseY  = H*0.30;         // where prongs join the shaft (crossbar)
  const footY  = seatY - H*0.02; // shaft foot, planted in the vacant seat
  const spread = W*0.105;        // side-prong spread
  const shaftW = W*0.028;

  // shaft
  pen.paint(()=>{ g.rect(cx-shaftW/2, baseY, shaftW, footY-baseY); }, tone, 5);
  // crossbar
  pen.paint(()=>{ g.rect(cx-spread*1.15, baseY-shaftW*0.6, spread*2.30, shaftW*1.2); }, tone, 5);

  // three prongs as tapered spears with barbs
  const prong = (ox)=>{
    const tx = cx+ox;
    pen.paint(()=>{
      g.moveTo(tx-shaftW*0.42, baseY);
      g.lineTo(tx-shaftW*0.42, tipY+H*0.03);
      g.lineTo(tx,             tipY);          // point
      g.lineTo(tx+shaftW*0.42, tipY+H*0.03);
      g.lineTo(tx+shaftW*0.42, baseY);
      g.closePath();
    }, tone, 5);
    // barb
    pen.paint(()=>{
      g.moveTo(tx-shaftW*0.42, tipY+H*0.05);
      g.lineTo(tx-shaftW*1.5,  tipY+H*0.02);
      g.lineTo(tx-shaftW*0.42, tipY+H*0.09);
      g.closePath();
    }, tone, 3);
    pen.paint(()=>{
      g.moveTo(tx+shaftW*0.42, tipY+H*0.05);
      g.lineTo(tx+shaftW*1.5,  tipY+H*0.02);
      g.lineTo(tx+shaftW*0.42, tipY+H*0.09);
      g.closePath();
    }, tone, 3);
  };
  // side prongs curve outward from the crossbar ends
  const sideProng = (side)=>{
    const ex = cx+side*spread;
    pen.paint(()=>{
      g.moveTo(cx+side*shaftW*0.2, baseY-shaftW*0.2);
      g.quadraticCurveTo(ex, baseY-H*0.02, ex, baseY-H*0.05);
      g.lineTo(ex-side*shaftW*0.42, baseY-H*0.045);
      g.quadraticCurveTo(cx+side*shaftW*0.2, baseY+shaftW*0.4, cx+side*shaftW*0.2, baseY+shaftW*0.2);
      g.closePath();
    }, tone, 4);
  };
  sideProng(-1); sideProng(1);
  prong(-spread); prong(0); prong(spread);

  // a faceted highlight seam down the shaft (structure, not shading)
  pen.seam(()=>{ g.moveTo(cx, baseY); g.lineTo(cx, footY); }, 2);
}

/* ---- floor CONSEQUENCE: the disturbance the absence leaves in the council ---- */
function drawFloor(pen,g,W,H,cx,pulse,inten){
  const hy = H*params.horizon;
  // floor slab (light)
  g.fillStyle = inkLevel(2); g.fillRect(0,hy,W,H-hy);
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 3);
  // expanding ripple rings centered under the seat -> the visible consequence
  const cy = hy + (H-hy)*0.42;
  for(let k=0;k<3;k++){
    const r = W*(0.10 + k*0.14) + pulse*W*0.03;
    g.strokeStyle = inkLevel(3 - k);
    g.lineWidth = lerp(4,2,k/3);
    g.beginPath(); g.ellipse(cx, cy, r, r*0.28, 0, 0, TAU); g.stroke();
  }
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t || 0;
  const inten = (st.intensity!=null?st.intensity:params.intensity);
  const pulse = 0.5 + 0.5*Math.sin(t*1.5);            // 0..1 breathing charge
  const cx = W*0.5;
  const seatY = H*params.seatLevel;
  const fieldCy = H*0.50;                              // charge field center (over the seat)
  const tridentLvl = clamp(Math.round(params.tridentLevel - (1-inten)*2 - pulse*0.6), 3, 7);

  const layers = st.layers || ["floor","aura","spokes","throne","trident","sparks"];
  const has = l => layers.includes(l);

  if (has("floor"))   drawFloor(pen,g,W,H,cx,pulse,inten);
  if (has("aura"))    drawAura(pen,g,W,H,cx,fieldCy,pulse,inten);
  if (has("spokes"))  drawSpokes(pen,g,W,H,cx,fieldCy,pulse,inten);
  if (has("throne"))  drawThrone(pen,g,W,H,cx,seatY);
  if (has("trident")) drawTrident(pen,g,W,H,cx,seatY,tridentLvl);

  // foreground SPARKS — a few bright discharge dots orbiting the empty seat
  if (has("sparks")){
    g.fillStyle = inkLevel(6);
    const n=7;
    for(let i=0;i<n;i++){
      const a=(i/n)*TAU + t*0.6 + i;
      const r=W*(0.20+0.06*Math.sin(t*2+i));
      const x=cx+Math.cos(a)*r, y=fieldCy+Math.sin(a)*r*0.9;
      const rad = 3 + 3*(0.5+0.5*Math.sin(t*3+i*2))*inten;
      g.beginPath(); g.arc(x,y,rad,0,TAU); g.fill();
    }
  }
  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.poseidons-absence",
  type:"DIVINE_FX",
  name:"Poseidon's absence",
  statusWord:"CHARGED",
  scene:"OD-B01-S01",

  params,
  // back -> front; scene state may pass a subset of layers
  layers:["floor","aura","spokes","throne","trident","sparks"],
  // normalized 0..1 anchors: the source seat, the emblem, the field, the consequence
  anchors:{
    "place:poseidon":{x:.50,y:.62},   // source — the empty charged seat
    "emblem:trident-tip":{x:.50,y:.15},// the marker of who is missing
    "field:center":{x:.50,y:.50},     // charge field origin
    "throne:seat":{x:.50,y:.60},
    "target:council":{x:.50,y:.50},   // the opposition is aimed at the assembly
    "consequence:floor":{x:.50,y:.86},// visible disturbance
    "camera:wide":{x:.50,y:.50},
  },
  // affected region on the floor (for scene placement / pathing)
  zones:{ field:{ x0:.16,y0:.28,x1:.84,y1:.74 }, seat:{ x0:.40,y0:.50,x1:.60,y1:.66 } },

  // DIVINE_FX state machine: source -> field -> consequence, with duration
  states:{
    initial:"charged",
    nodes:{
      // dormant: seat still empty but the charge has settled (low intensity)
      dormant:{ preview:{ t:0.0, intensity:0.35, status:"VACANT", progress:.10 } },
      // charged: steady opposition radiating from the empty place (neutral)
      charged:{ preview:{ t:1.6, intensity:1.0,  status:"CHARGED", progress:.42 } },
      // surging: the absence flares — full discharge, consequence ripples out
      surging:{ preview:{ t:2.6, intensity:1.6,  status:"SURGING", progress:.80 } },
    },
    edges:[["dormant","charged"],["charged","surging"],["surging","charged"],["charged","dormant"]],
  },
  duration:6.0,
  channels:["charge","pulse","flicker","intensity","t"],

  preview:()=>({ t:1.6, intensity:1.0, status:"CHARGED", progress:.42,
                 layers:["floor","aura","spokes","throne","trident","sparks"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
