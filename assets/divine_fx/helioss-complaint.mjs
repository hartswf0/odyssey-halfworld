/* divine_fx.helioss-complaint — Helios's complaint rendered as an ASCENDING
   complaint-line. DIVINE_FX asset.

   Scene function (OD-B12-S06): after the crew slaughters the cattle of the Sun,
   Helios's grievance climbs the sky. A SOURCE report rises from the ISLAND
   (bottom, Thrinakia in the sea), up to the radiant SUN-GOD FACE (middle, Helios
   — a rayed disc with a scowling complaint), and then ONWARD to a ZEUS / THUNDER
   symbol at the top (a storm cloud with a lightning-bolt PUNISHMENT-DEMAND glyph).

   DIVINE_FX contract: SOURCE (island report token) -> FIELD (the ascending
   complaint corridor of upward-streaming dashes) -> TRANSFORM (report reaches
   Helios, becomes a punishment-demand) -> visible CONSEQUENCE (the thunderbolt
   glyph ignites at Zeus). Animates over state.t:
     0.0  report just leaving the island
     0.5  report arriving at the Sun-god face
     1.0  demand delivered to Zeus, thunderbolt struck.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* normalized node positions (0..1 asset space, portrait) */
const NODE = {
  island:{ x:0.50, y:0.845 },   // Thrinakia in the sea — the report's origin
  sun:{    x:0.50, y:0.435 },   // radiant sun-god face (Helios), the intermediary
  zeus:{   x:0.50, y:0.150 },   // Zeus / thunder symbol at the top of the sky
};

const params = {
  node:NODE,
  horizon:0.90,     // sea horizon as fraction of H
  streaks:7,        // ascending complaint-corridor streaks
  rays:12,          // sun-god face rays
  flow:22,          // marching-ants speed along the field
  intensity:1.0,
};

function drawFX(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const t = clamp01(st.t ?? 0);
  const intensity = st.intensity ?? params.intensity;
  const layers = st.layers || ["sky","sea","island","link","field","trail","report","sun","thunder"];
  // draw order: report rises first, then the Sun-god face and the Zeus glyph
  // are stamped on top so the punishment-demand bolt stays fully legible.
  const has = l => layers.includes(l);

  const isl = { x:W*NODE.island.x, y:H*NODE.island.y };
  const sun = { x:W*NODE.sun.x,    y:H*NODE.sun.y };
  const zeu = { x:W*NODE.zeus.x,   y:H*NODE.zeus.y };
  const horizon = H*params.horizon;

  // ascent kinematics: two legs — island->sun (report), sun->zeus (demand)
  const te = smooth(t);
  let head, phase, legT;
  if (te < 0.5){ legT = te/0.5;         head = { x:lerp(isl.x,sun.x,legT), y:lerp(isl.y,sun.y,legT) }; phase="report"; }
  else         { legT = (te-0.5)/0.5;   head = { x:lerp(sun.x,zeu.x,legT), y:lerp(sun.y,zeu.y,legT) }; phase="demand"; }
  const strikeAmt = clamp01((te-0.45)/0.55);    // thunderbolt consequence ramps as the demand climbs
  const flowOff = -(t*params.flow*12);          // dashes stream UPWARD

  // ---------- SKY (lightest tone -> airy, few dots) ----------
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  }

  // ---------- SEA (mortal domain, mid-light) + surface ripples ----------
  if (has("sea")){
    g.fillStyle = inkLevel(3); g.fillRect(0,horizon,W,H-horizon);
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.35;
    for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha = 1;
  }

  // ---------- ISLAND (Thrinakia — the mortal landfall the report rises from) ----------
  if (has("island")){
    pen.paint(()=>{
      g.moveTo(isl.x-W*0.20, horizon+2);
      g.quadraticCurveTo(isl.x-W*0.10, horizon-H*0.055, isl.x-W*0.02, horizon-H*0.052);
      g.quadraticCurveTo(isl.x+W*0.02, horizon-H*0.075, isl.x+W*0.07, horizon-H*0.050);
      g.quadraticCurveTo(isl.x+W*0.14, horizon-H*0.030, isl.x+W*0.20, horizon+2);
      g.closePath();
    }, toneSolid(inkLevel(6)), 4);
    // a couple of the Sun's cattle as tiny marks on the island (the grievance)
    g.fillStyle = inkLevel(2);
    for(const dx of [-0.05, 0.03]){
      g.beginPath(); g.ellipse(isl.x+W*dx, horizon-H*0.030, W*0.014, H*0.008, 0,0,TAU); g.fill();
    }
  }

  // ---------- LINK: the faint ascending complaint-axis binding island->sun->zeus ----------
  if (has("link")){
    g.strokeStyle = inkLevel(2); g.lineWidth = 2; g.globalAlpha = 0.8;
    g.beginPath(); g.moveTo(isl.x, isl.y-H*0.03); g.lineTo(sun.x, sun.y); g.lineTo(zeu.x, zeu.y); g.stroke();
    g.globalAlpha = 1;
  }

  // ---------- FIELD: ascending complaint corridor (upward-streaming dashes) ----------
  if (has("field")){
    const nf = params.streaks;
    g.save(); g.lineCap = "round";
    // two segments so the corridor kinks slightly at the sun
    const segs = [ [ {x:isl.x,y:isl.y-H*0.03}, sun ], [ sun, zeu ] ];
    for(let s=0;s<segs.length;s++){
      const a = segs[s][0], b = segs[s][1];
      const dx = b.x-a.x, dy = b.y-a.y, len = Math.hypot(dx,dy)||1;
      const nx = -dy/len, ny = dx/len;              // corridor normal
      const wide = (s===0? W*0.075 : W*0.045);
      for(let i=0;i<nf;i++){
        const f = nf>1 ? (i/(nf-1))*2-1 : 0;        // -1..1 across corridor
        const off = f*wide*(1-Math.abs(f)*0.25);
        const edge = 1 - Math.abs(f)*0.35;           // center streaks strongest
        g.strokeStyle = inkLevel(3 + Math.round(edge));   // 3..4
        g.lineWidth = 1.5 + edge*1.5;
        g.setLineDash([H*0.026, H*0.020]);
        g.lineDashOffset = flowOff + i*7 + s*13;
        g.globalAlpha = (0.5 + 0.35*edge)*intensity;
        g.beginPath();
        g.moveTo(a.x+nx*off, a.y+ny*off);
        g.lineTo(b.x+nx*off, b.y+ny*off);
        g.stroke();
      }
    }
    g.setLineDash([]); g.globalAlpha = 1; g.restore();
  }

  // ---------- TRAIL: rising wake of the report token (tapered speed streaks) ----------
  if (has("trail")){
    const anchor = phase==="report" ? isl : sun;    // wake trails back toward the last node
    const nT = 5;
    g.lineCap = "round";
    for(let i=0;i<nT;i++){
      const f = nT>1 ? (i/(nT-1))*2-1 : 0;
      const cen = 1 - Math.abs(f);
      const sX = lerp(head.x, anchor.x, 0.20 + 0.55*cen);
      const sY = lerp(head.y, anchor.y, 0.20 + 0.55*cen);
      const xTop = head.x + f*W*0.020;
      g.strokeStyle = inkLevel(4 + Math.round(cen*2));  // 4..6
      g.lineWidth = (1.3 + cen*3.6)*(0.55 + 0.45*intensity);
      g.globalAlpha = 0.6 + 0.35*cen;
      g.beginPath();
      g.moveTo(sX, sY);
      g.quadraticCurveTo(lerp(xTop,head.x,0.5), (sY+head.y)/2, head.x, head.y);
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  // ---------- REPORT TOKEN: the rising grievance (small tablet/scroll) ----------
  // drawn under the Sun-god face + Zeus glyph so those nodes read cleanly when
  // the token arrives at them.
  if (has("report")){
    const tw = W*0.045, th = H*0.028;
    pen.paint(()=>{
      g.moveTo(head.x-tw*0.5, head.y+th*0.5);
      g.lineTo(head.x-tw*0.5, head.y-th*0.3);
      g.lineTo(head.x,        head.y-th*0.6);          // gabled top -> reads as "rising"
      g.lineTo(head.x+tw*0.5, head.y-th*0.3);
      g.lineTo(head.x+tw*0.5, head.y+th*0.5);
      g.closePath();
    }, toneSolid(inkLevel(phase==="demand"?7:6)), Math.max(2,W*0.006));
    // report ruling lines (a written complaint)
    g.strokeStyle = inkLevel(1); g.lineWidth = Math.max(1.4,W*0.004); g.lineCap="round";
    for(let k=0;k<3;k++){
      const yy = head.y-th*0.1 + k*th*0.22;
      g.beginPath(); g.moveTo(head.x-tw*0.28, yy); g.lineTo(head.x+tw*0.28, yy); g.stroke();
    }
  }

  // ---------- SUN-GOD FACE (Helios — rayed disc with a scowling complaint) ----------
  if (has("sun")){
    const r = W*0.115;
    // radiating rays (drawn behind the disc)
    g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = "round";
    for(let a=0;a<params.rays;a++){
      const ang = (a/params.rays)*TAU;
      const r0 = r*1.06, r1 = r*(1.34 + 0.16*(a%2));
      g.beginPath();
      g.moveTo(sun.x+Math.cos(ang)*r0, sun.y+Math.sin(ang)*r0);
      g.lineTo(sun.x+Math.cos(ang)*r1, sun.y+Math.sin(ang)*r1);
      g.stroke();
    }
    // the solar disc (bright, so it reads as radiant against the dark rays/face marks)
    pen.paint(()=>{ g.arc(sun.x, sun.y, r, 0, TAU); }, toneSolid(inkLevel(2)), Math.max(3,W*0.008));
    // FACE — a complaint: scowling brows, hard eyes, a downturned mouth
    const ex = r*0.40, ey = -r*0.14;
    g.fillStyle = INK;
    for(const s of [-1,1]){
      g.beginPath(); g.ellipse(sun.x+s*ex, sun.y+ey, r*0.10, r*0.12, 0,0,TAU); g.fill();
    }
    // furrowed brows angled down toward the nose (angry/aggrieved)
    g.strokeStyle = INK; g.lineWidth = Math.max(3,W*0.008); g.lineCap="round";
    for(const s of [-1,1]){
      g.beginPath();
      g.moveTo(sun.x+s*(ex+r*0.20), sun.y+ey-r*0.34);
      g.lineTo(sun.x+s*(ex-r*0.14), sun.y+ey-r*0.10);
      g.stroke();
    }
    // downturned complaining mouth
    g.beginPath(); g.lineWidth = Math.max(3,W*0.009);
    g.moveTo(sun.x-r*0.32, sun.y+r*0.44);
    g.quadraticCurveTo(sun.x, sun.y+r*0.20, sun.x+r*0.32, sun.y+r*0.44);
    g.stroke();
  }

  // ---------- ZEUS / THUNDER symbol (storm cloud + PUNISHMENT-DEMAND bolt) ----------
  if (has("thunder")){
    const cw = W*0.15, ch = H*0.045;
    // storm cloud shelf (mid tone), a row of lobes
    pen.paint(()=>{
      g.moveTo(zeu.x-cw, zeu.y+ch);
      g.arc(zeu.x-cw*0.55, zeu.y, ch*0.95, Math.PI*0.9, Math.PI*1.9);
      g.arc(zeu.x,          zeu.y-ch*0.35, ch*1.15, Math.PI*1.05, Math.PI*1.95);
      g.arc(zeu.x+cw*0.55, zeu.y, ch*0.95, Math.PI*1.1, Math.PI*2.1);
      g.lineTo(zeu.x+cw, zeu.y+ch);
      g.closePath();
    }, toneSolid(inkLevel(5)), 4);

    // the lightning-bolt punishment-demand glyph, hanging below the cloud
    const by = zeu.y+ch*1.1, bh = H*0.075;
    const bolt = [
      { x:zeu.x+cw*0.06, y:by },
      { x:zeu.x-cw*0.20, y:by+bh*0.42 },
      { x:zeu.x+cw*0.02, y:by+bh*0.44 },
      { x:zeu.x-cw*0.22, y:by+bh },
      { x:zeu.x+cw*0.18, y:by+bh*0.40 },
      { x:zeu.x-cw*0.04, y:by+bh*0.38 },
    ];
    // ignition: dim before the demand lands, hot + accented after the strike
    const lit = 0.35 + 0.65*strikeAmt;
    pen.paint(()=>{
      g.moveTo(bolt[0].x, bolt[0].y);
      for(let i=1;i<bolt.length;i++) g.lineTo(bolt[i].x, bolt[i].y);
      g.closePath();
    }, toneSolid(inkLevel(strikeAmt>0.5?7:4)), Math.max(2,W*0.006));

    // strike flash — radial spikes + a blue demand-tick at full strike
    if (strikeAmt>0.02){
      g.strokeStyle = INK; g.lineCap="round"; g.lineWidth = 3; g.globalAlpha = lit;
      for(let a=0;a<8;a++){
        const ang = (a/8)*TAU;
        const r0 = cw*0.30, r1 = cw*(0.42 + 0.14*(a%2))*strikeAmt + cw*0.30;
        g.beginPath();
        g.moveTo(zeu.x+Math.cos(ang)*r0, zeu.y+Math.sin(ang)*r0);
        g.lineTo(zeu.x+Math.cos(ang)*r1, zeu.y+Math.sin(ang)*r1);
        g.stroke();
      }
      g.globalAlpha = 1;
      if (strikeAmt>0.6){
        g.fillStyle = ACCENT;
        g.beginPath(); g.arc(bolt[bolt.length-1].x, bolt[bolt.length-1].y+H*0.006, W*0.012, 0, TAU); g.fill();
      }
    }
  }
}

export const asset = {
  id:"divine_fx.helioss-complaint",
  type:"DIVINE_FX",
  name:"Helios's complaint",
  statusWord:"AGGRIEVED",
  scene:"OD-B12-S06",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["sky","sea","island","link","field","trail","report","sun","thunder"],
  // normalized 0..1 source/target/field/camera anchors
  anchors:{
    "source:island":{ x:0.50, y:0.845 },   // the report's origin (Thrinakia)
    "relay:helios":{  x:0.50, y:0.435 },    // the sun-god face (intermediary)
    "target:zeus":{   x:0.50, y:0.150 },    // punishment-demand recipient
    "glyph:bolt":{    x:0.49, y:0.230 },    // the thunderbolt demand glyph
    "report:head":{   x:0.50, y:0.640 },    // representative mid-ascent position
    "camera:wide":{   x:0.50, y:0.50  },
  },
  // corridor the complaint travels through (normalized band)
  zones:{ corridor:{ x0:0.40, y0:0.14, x1:0.60, y1:0.85 } },
  // source/target/field/transform states over the ascent
  states:{
    initial:"reporting",
    nodes:{
      reporting:{ preview:{ t:0.22, status:"REPORTING", progress:0.22 } },  // rising from island
      appealing:{ preview:{ t:0.50, status:"APPEALING", progress:0.50 } },  // at the sun-god face
      demanding:{ preview:{ t:0.80, status:"DEMANDING", progress:0.80 } },  // climbing to Zeus
      struck:{    preview:{ t:1.00, status:"STRUCK",    progress:1.00 } },  // thunderbolt granted
    },
    edges:[["reporting","appealing"],["appealing","demanding"],["demanding","struck"]],
  },
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","strike","flow"],

  // neutral preview: late-ascent — report climbing from Helios toward Zeus, the
  // island + sun-god face + forming thunderbolt all legible in one frame
  preview:()=>({ t:0.72, intensity:1.0, status:"DEMANDING", progress:0.72 }),
  draw(ctx,W,H,state){ drawFX(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
