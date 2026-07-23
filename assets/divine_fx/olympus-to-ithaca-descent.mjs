/* divine_fx.olympus-to-ithaca-descent — a rapid vertical flight field/streak
   linking a HIGH divine point (Olympus, top) to a LOW mortal shore (Ithaca,
   bottom). DIVINE_FX asset: procedural supernatural effect with a SOURCE
   (Olympus summit + radiant node), a TARGET (Ithacan shore on the sea), a
   FIELD (near-vertical speed streaks that funnel source -> target), a
   traveling descent body with a comet TRAIL, and a visible CONSEQUENCE
   (impact burst + sea ripples). Animates over state.t (0=poised at Olympus,
   1=arrived/impact at the shore).
   Atlas: OD-B01-S02 — rapid vertical flight field linking divine and mortal.

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const params = {
  source:{ x:0.50, y:0.115 },   // Olympus summit / divine point (normalized)
  target:{ x:0.50, y:0.80  },   // Ithacan shore / mortal point
  horizon:0.80,                 // sea horizon as fraction of H
  streaks:7,                    // count of field streaks in the flight corridor
  spread:1.0,                   // lateral fan of the field at the target
  intensity:1.0,                // overall brightness/energy of the effect
};

const clamp01 = x => clamp(x,0,1);

function drawFX(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const t = clamp01(st.t ?? 0);
  const intensity = st.intensity ?? params.intensity;
  const spread = st.spread ?? params.spread;
  const layers = st.layers || ["sky","sea","shore","link","field","trail","descent","impact","source"];
  const has = l => layers.includes(l);

  const src = { x:W*params.source.x, y:H*params.source.y };
  const tgt = { x:W*params.target.x, y:H*params.target.y };
  const horizon = H*params.horizon;

  // descent kinematics: accelerating fall that settles at the shore
  const te = smooth(t);
  const headY = lerp(src.y, tgt.y, te);
  const headX = lerp(src.x, tgt.x, te);
  const impactAmt = clamp01((te - 0.55)/0.45);   // consequence ramps in near arrival

  // ---------- SKY (lightest tone -> airy, few dots) ----------
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  }

  // ---------- SEA (mortal domain, mid-light) + surface ripples ----------
  if (has("sea")){
    g.fillStyle = inkLevel(3); g.fillRect(0,horizon,W,H-horizon);
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.35;
    for(let j=1;j<=5;j++){ const y=horizon+(H-horizon)*(j/5); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha = 1;
    // impact ripples spreading on the surface at the target
    if (impactAmt>0.02){
      g.strokeStyle = INK; g.lineWidth = 3;
      for(let k=0;k<3;k++){
        const rr = (0.35+k*0.55)*impactAmt*W*0.20;
        g.globalAlpha = 0.5*(1-k*0.25)*impactAmt;
        g.beginPath(); g.ellipse(tgt.x, horizon+H*0.012, rr, rr*0.28, 0, 0, Math.PI*2); g.stroke();
      }
      g.globalAlpha = 1;
    }
  }

  // ---------- SHORE (Ithaca — small mortal landfall at the horizon) ----------
  if (has("shore")){
    pen.paint(()=>{ g.moveTo(tgt.x-W*0.12, horizon);
      g.quadraticCurveTo(tgt.x-W*0.05, horizon-H*0.05, tgt.x, horizon-H*0.055);
      g.quadraticCurveTo(tgt.x+W*0.06, horizon-H*0.05, tgt.x+W*0.13, horizon);
      g.closePath(); }, toneSolid(inkLevel(6)), 4);
  }

  // ---------- LINK: faint central axis binding the two locations ----------
  if (has("link")){
    g.strokeStyle = inkLevel(2); g.lineWidth = 2; g.globalAlpha = 0.8;
    g.beginPath(); g.moveTo(src.x, src.y); g.lineTo(tgt.x, tgt.y); g.stroke();
    g.globalAlpha = 1;
  }

  // ---------- FIELD: near-vertical speed streaks funneling source -> target ----------
  if (has("field")){
    const nf = params.streaks;
    g.save();
    g.lineCap = "round";
    for(let i=0;i<nf;i++){
      const f = nf>1 ? (i/(nf-1))*2-1 : 0;               // -1..1 across the corridor
      const topX = src.x + f*W*0.020;
      const botX = tgt.x + f*W*0.11*spread;
      const midX = lerp(topX,botX,0.5) + f*W*0.012;
      const edge = 1 - Math.abs(f)*0.35;                  // center streaks strongest
      g.strokeStyle = inkLevel(3 + Math.round(edge));     // 3..4
      g.lineWidth = 1.6 + edge*1.6;
      g.setLineDash([H*0.028, H*0.022]);
      g.lineDashOffset = -(t*H*0.9 + i*7);                // dashes stream downward = speed
      g.globalAlpha = (0.55 + 0.35*edge)*intensity;
      g.beginPath();
      g.moveTo(topX, src.y + H*0.03);
      g.quadraticCurveTo(midX, (src.y+tgt.y)/2, botX, tgt.y);
      g.stroke();
    }
    g.setLineDash([]); g.globalAlpha = 1;
    g.restore();
  }

  // ---------- TRAIL: comet wake as a bundle of tapered speed streaks ----------
  // (center streaks longest + darkest, outer ones shorter + lighter -> reads as
  //  rapid motion behind the head, not a solid pillar)
  if (has("trail")){
    const topY = lerp(src.y, headY, 0.05);
    const nT = 5;
    g.lineCap = "round";
    for(let i=0;i<nT;i++){
      const f = nT>1 ? (i/(nT-1))*2-1 : 0;          // -1..1 across the wake
      const cen = 1 - Math.abs(f);                   // 1 center .. 0 edge
      const sY  = lerp(headY, topY, 0.35 + 0.65*cen);// center reaches back to source
      const xTop = headX + f*W*0.024;
      const xHd  = headX + f*W*0.009;
      g.strokeStyle = inkLevel(4 + Math.round(cen*2)); // 4..6
      g.lineWidth = (1.4 + cen*4.2)*(0.55 + 0.45*intensity);
      g.globalAlpha = 0.7 + 0.3*cen;
      g.beginPath();
      g.moveTo(xTop, sY);
      g.quadraticCurveTo(lerp(xTop,xHd,0.5), (sY+headY)/2, xHd, headY);
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  // ---------- DESCENT BODY: the divine flight head (teardrop, pointing down) ----------
  if (has("descent")){
    const hw = W*0.032, hl = W*0.075;
    pen.paint(()=>{
      g.moveTo(headX, headY + hl);
      g.quadraticCurveTo(headX + hw, headY, headX, headY - hw);
      g.quadraticCurveTo(headX - hw, headY, headX, headY + hl);
      g.closePath();
    }, toneSolid(inkLevel(7)), Math.max(2, W*0.007));
    // hot core (bright -> tonal contrast against the black head)
    pen.fillPath(()=>{ g.ellipse(headX, headY, hw*0.34, hw*0.5, 0, 0, Math.PI*2); }, inkLevel(1));
    // short forward speed slashes flanking the head
    g.strokeStyle = inkLevel(5); g.lineWidth = 2; g.lineCap = "round"; g.globalAlpha = 0.85;
    for(const s of [-1,1]){
      g.beginPath();
      g.moveTo(headX + s*hw*1.5, headY - hl*0.2);
      g.lineTo(headX + s*hw*1.9, headY + hl*0.5);
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  // ---------- IMPACT: visible consequence burst at the shore ----------
  if (has("impact") && impactAmt>0.02){
    const cx = tgt.x, cy = horizon - H*0.02;
    // expanding burst rings
    g.strokeStyle = INK; g.lineCap = "round";
    for(let k=0;k<3;k++){
      const rr = (0.4 + k*0.6)*impactAmt*W*0.14;
      g.lineWidth = 3.2*(1-k*0.22);
      g.globalAlpha = 0.85*(1-k*0.25)*impactAmt;
      g.beginPath(); g.arc(cx, cy, rr, Math.PI*1.08, Math.PI*1.92); g.stroke();
    }
    // radial spikes (divine strike)
    g.lineWidth = 3; g.globalAlpha = impactAmt;
    for(let a=0;a<7;a++){
      const ang = Math.PI*1.06 + (a/6)*Math.PI*0.88;
      const r0 = impactAmt*W*0.05, r1 = impactAmt*W*(0.12 + 0.04*(a%2));
      g.beginPath();
      g.moveTo(cx + Math.cos(ang)*r0, cy + Math.sin(ang)*r0);
      g.lineTo(cx + Math.cos(ang)*r1, cy + Math.sin(ang)*r1);
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  // ---------- SOURCE: Olympus summit cloud + radiant divine node (drawn last, crisp) ----------
  if (has("source")){
    // cloud shelf under the summit (light)
    pen.paint(()=>{
      g.ellipse(src.x, src.y + H*0.028, W*0.14, H*0.028, 0, 0, Math.PI*2);
    }, toneSolid(inkLevel(2)), 3);
    // radiant node
    pen.paint(()=>{ g.arc(src.x, src.y, W*0.045, 0, Math.PI*2); }, toneSolid(inkLevel(7)), Math.max(2,W*0.007));
    pen.fillPath(()=>{ g.arc(src.x, src.y, W*0.018, 0, Math.PI*2); }, inkLevel(1));
    // radiating rays
    g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = "round";
    for(let a=0;a<8;a++){
      const ang = (a/8)*Math.PI*2;
      const r0 = W*0.052, r1 = W*(0.078 + 0.02*(a%2));
      g.beginPath();
      g.moveTo(src.x + Math.cos(ang)*r0, src.y + Math.sin(ang)*r0);
      g.lineTo(src.x + Math.cos(ang)*r1, src.y + Math.sin(ang)*r1);
      g.stroke();
    }
  }
}

export const asset = {
  id:"divine_fx.olympus-to-ithaca-descent",
  type:"DIVINE_FX",
  name:"Olympus-to-Ithaca Descent",
  statusWord:"DESCENDING",
  scene:"OD-B01-S02",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["sky","sea","shore","link","field","trail","descent","impact","source"],
  // normalized 0..1 source/target/field/camera anchors
  anchors:{
    "source:olympus":{ x:0.50, y:0.115 },
    "target:ithaca":{  x:0.50, y:0.80  },
    "descent:head":{   x:0.50, y:0.715 },   // representative mid-flight position
    "field:left":{     x:0.44, y:0.50  },
    "field:right":{    x:0.56, y:0.50  },
    "camera:wide":{    x:0.50, y:0.50  },
  },
  // corridor the flight body travels through (normalized band)
  zones:{ corridor:{ x0:0.38, y0:0.12, x1:0.62, y1:0.80 } },
  // transformation states over the descent
  states:{
    initial:"poised",
    nodes:{
      poised:{     preview:{ t:0.0,  status:"POISED",     progress:0.02 } },
      descending:{ preview:{ t:0.5,  status:"DESCENDING", progress:0.50 } },
      arrived:{    preview:{ t:1.0,  status:"ARRIVED",    progress:1.00 } },
    },
    edges:[["poised","descending"],["descending","arrived"]],
  },
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","spread","impact"],

  // neutral preview: mid-late flight — head near the shore, trail spanning the
  // full vertical link, impact just forming (reads unmistakably as a descent)
  preview:()=>({ t:0.78, intensity:1.0, spread:1.0, status:"DESCENDING", progress:0.78 }),
  draw(ctx,W,H,state){ drawFX(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
