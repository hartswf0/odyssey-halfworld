/* divine_fx.shared-mourning — one grief moves through four bodies at once.
   DIVINE_FX. Scene function (OD-B04-S02): at Menelaus' hall the name of the
   dead is spoken and sorrow takes the whole table synchronously — four
   mourners at four positions VEIL themselves in their cloaks, TEARS fall, the
   torso COLLAPSES forward, and a radiant grief-field of collapse-lines binds
   the four through a common center. Then, over t, it RECEDES: veils lower,
   tears stop, the spines lift — a shared recovery.

   Procedural DIVINE_FX: SOURCE (the spoken name — a pulse at the field center)
   -> FIELD (four bound mourner-positions + the radiating collapse-lattice)
   -> TRANSFORM (grief g(t) rises, holds, then recovers; every body reads the
   same g at the same instant — the synchrony IS the effect) -> CONSEQUENCE
   (cloak-veil / falling tears / posture-collapse, released on recovery).
   Solid grays + hard contour into the offscreen ctx; the engine POST pass
   supplies the halftone — do NOT pre-dither. Robes carry a crisp silhouette;
   the lattice + tears stay tonal so grief reads as a field, not a drawing. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);
const smooth = t => { t = clamp(t,0,1); return t*t*(3-2*t); };

const params = {
  period: 9.0,          // seconds: onset -> shared mourning -> recovery
  center: { x:0.50, y:0.55 },   // where the spoken name gathers the four
  tears:  5,            // falling tears per mourner at full grief
  // four bound positions (feet points, frac of W/H). A near/far quad so the
  // collapse-lattice reads with depth; each mourner faces the common center.
  // Kept small + well-separated so the grief-field (lattice + source) reads in
  // the open center and the four never merge into one mass.
  seats: [
    { x:0.310, y:0.455, h:0.220, key:"far-left"  },   // far pair (smaller)
    { x:0.690, y:0.455, h:0.220, key:"far-right" },
    { x:0.230, y:0.900, h:0.290, key:"near-left" },   // near pair (larger)
    { x:0.770, y:0.900, h:0.290, key:"near-right"},
  ],
};

/* grief intensity 0..1 over t: onset (rise) -> mourning (hold) -> recovery
   (release). Every mourner samples this same value, so the field is synchronous. */
function griefAt(t){
  const p = frac(t/params.period);
  if (p < 0.22) return smooth(p/0.22);            // onset: sorrow takes hold
  if (p < 0.58) return 1;                          // shared mourning: full
  return 1 - smooth((p-0.58)/0.42);                // recovery: released together
}

/* ---- faint ground/field wash so the mourners sit in a room of memory ---- */
function drawField(g,W,H,grief){
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  // a low floor band the near mourners stand on
  const fy = H*0.66;
  g.fillStyle = inkLevel(2); g.fillRect(0,fy,W,H-fy);
  g.strokeStyle = inkLevel(3); g.lineWidth = 2;
  g.beginPath(); g.moveTo(0,fy); g.lineTo(W,fy); g.stroke();
}

/* ---- the SOURCE: the spoken name gathered at the field center — a small
   crisp node with radiating pulse rings that drive the shared collapse. ---- */
function drawSource(pen,g,W,H,t,grief){
  const cx = params.center.x*W, cy = params.center.y*H;
  const pulse = 0.5 + 0.5*Math.sin(t*2.0);
  for(let k=0;k<3;k++){
    const r = (W*0.03 + k*W*0.045 + pulse*W*0.012) ;
    g.strokeStyle = inkLevel(clamp(Math.round((4-k)*grief),1,4));
    g.lineWidth = lerp(3,1.4,k/3); g.lineCap="round";
    g.beginPath(); g.ellipse(cx,cy,r,r*0.86,0,0,TAU); g.stroke();
  }
  // the node itself — the one hard mark anchoring the field
  pen.paint(()=> g.arc(cx,cy,W*0.016,0,TAU), toneSolid(inkLevel(clamp(Math.round(3+grief*3),3,6))), 3);
}

/* ---- the radiating COLLAPSE-LATTICE: lines binding the four positions
   through the center. Intensity + a slow travelling dash rise with grief, so
   the four read as one synchronised body of sorrow. ---- */
function drawLattice(pen,g,W,H,t,grief){
  if (grief < 0.02) return;
  const cx = params.center.x*W, cy = params.center.y*H;
  const nodes = params.seats.map(s => ({ x:s.x*W, y:s.y*H - s.h*H*0.62 }));  // chest height
  const lvl = clamp(Math.round(2 + grief*3), 2, 5);
  g.strokeStyle = inkLevel(lvl); g.lineWidth = lerp(1.6,3.0,grief); g.lineCap="round";
  // spokes: each position to the common center
  for(let i=0;i<nodes.length;i++){
    g.setLineDash([9,7]); g.lineDashOffset = -t*18 - i*4;
    g.beginPath(); g.moveTo(nodes[i].x,nodes[i].y); g.lineTo(cx,cy); g.stroke();
  }
  // rim: the four bound to each other (the shared edge of grief)
  g.setLineDash([6,9]); g.lineDashOffset = t*12;
  const order = [0,1,3,2];   // trace the quad
  g.strokeStyle = inkLevel(clamp(lvl-1,1,4)); g.lineWidth = lerp(1.2,2.2,grief);
  g.beginPath();
  for(let i=0;i<=order.length;i++){ const n=nodes[order[i%order.length]]; if(i===0) g.moveTo(n.x,n.y); else g.lineTo(n.x,n.y); }
  g.stroke();
  g.setLineDash([]);
}

/* ---- one MOURNER at a seat. Local build in robe-silhouette + veil + tears.
   grief drives: forward posture-collapse, veil raised over the face, tear
   count/length. dir faces the figure toward the common center. ---- */
function mourner(pen,g,W,H,seat,t,grief){
  const ox = seat.x*W, gy = seat.y*H, h = seat.h*H;
  const dir = ox < params.center.x*W ? 1 : -1;    // face inward
  const lw = h*0.05;
  const collapse = grief*0.9;                       // forward fold amount

  // local frame: y up from feet (gy), x*dir toward center
  const P = (lx,ly)=>({ x: ox + lx*h*dir, y: gy - ly*h });
  const hipY = 0.42, shBase = 0.74;
  const lean = collapse*0.30;                        // torso pitches toward center
  const hip  = P(0, hipY);
  const sh   = P(lean, shBase - collapse*0.10);      // shoulders drop + go forward
  const neck = P(lean*1.15, (shBase - collapse*0.10) + 0.05);
  const headC= P(lean*1.35, (shBase - collapse*0.10) + 0.05 + 0.115);
  const hr   = h*0.115;

  const near = seat.h > 0.26;
  const robe = toneSolid(inkLevel(near?4:3));   // near robes a touch darker
  const dark = toneSolid(inkLevel(near?5:4));

  // ---- ROBE body: a bell from a narrow hem to the folded shoulders ----
  const hemW = h*0.34, hemY = 0.0;
  pen.paint(()=>{
    g.moveTo(ox - hemW, gy - hemY*h);
    g.quadraticCurveTo(hip.x - h*0.30, hip.y, sh.x - h*0.24, sh.y);
    g.quadraticCurveTo(sh.x, sh.y - h*0.04, sh.x + h*0.24, sh.y);
    g.quadraticCurveTo(hip.x + h*0.30, hip.y, ox + hemW, gy - hemY*h);
    g.closePath();
  }, robe, Math.max(3,lw));
  // hem shadow
  pen.seam(()=>{ g.moveTo(ox-hemW, gy); g.quadraticCurveTo(ox, gy-h*0.04, ox+hemW, gy); }, 3);

  // ---- neck + HEAD ----
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(neck.x,neck.y); }, robe, lw*1.1);
  pen.paint(()=> g.arc(headC.x, headC.y, hr, 0, TAU), toneSolid(inkLevel(3)), Math.max(3,lw*0.9));

  // ---- CLOAK-VEIL: a hood drawn over the crown that, as grief rises, is
  //      pulled DOWN across the face (the Homeric gesture of covering to weep).
  const veil = clamp(grief,0,1);
  const drop = hr*(0.10 + veil*0.95);                // how far the veil covers the face (capped so a head still reads)
  pen.paint(()=>{
    // crown arc
    g.moveTo(headC.x - hr*1.18, headC.y + hr*0.10);
    g.quadraticCurveTo(headC.x, headC.y - hr*1.75, headC.x + hr*1.18, headC.y + hr*0.10);
    // down the inward-facing front to the veil edge
    g.quadraticCurveTo(headC.x + dir*hr*1.15, headC.y + drop, headC.x + dir*hr*0.35, headC.y + drop);
    // across the veil hem
    g.quadraticCurveTo(headC.x - dir*hr*0.55, headC.y + drop*0.9, headC.x - hr*1.18, headC.y + hr*0.10);
    g.closePath();
  }, dark, Math.max(3,lw*0.9));
  // veil fold lines
  g.strokeStyle = inkLevel(near?6:5); g.lineWidth = Math.max(1.5,lw*0.4); g.lineCap="round";
  for(let k=-1;k<=1;k++){ g.beginPath();
    g.moveTo(headC.x + k*hr*0.5, headC.y - hr*0.9);
    g.lineTo(headC.x + k*hr*0.35 + dir*hr*0.2, headC.y + drop*0.6); g.stroke(); }

  // ---- FALLING TEARS: droplets from the veil edge to the robe, dwindling.
  //      count + length scale with grief; they fall on their own phases over t.
  const n = Math.round(params.tears*grief);
  const tearY = headC.y + drop*0.82;                 // fall from the veil hem
  for(let i=0;i<n;i++){
    const side = (i%2)?1:-1;                          // tears from both covered eyes
    const tearX = headC.x + side*hr*0.42;
    const ph = frac(t*0.9 + i*0.37 + seat.x*3.1);    // 0 at eye .. 1 fallen away
    const fallLen = h*(0.36 + 0.10*((i%2)));
    const y = tearY + ph*fallLen;
    const x = tearX + Math.sin(i*2.0)*h*0.015;
    const r = lerp(h*0.030, h*0.014, ph) * (0.6+0.4*grief);
    g.fillStyle = inkLevel(clamp(Math.round(7 - ph*3),3,7));
    g.beginPath();
    // teardrop: round bottom, tapered top
    g.moveTo(x, y - r*1.7);
    g.quadraticCurveTo(x + r, y, x, y + r);
    g.quadraticCurveTo(x - r, y, x, y - r*1.7);
    g.fill();
  }

  // ---- POSTURE-COLLAPSE stress marks: short radiant lines off the bowed
  //      shoulders/spine, stronger as the body folds — the collapse made visible.
  if (grief > 0.15){
    g.strokeStyle = inkLevel(clamp(Math.round(2+grief*3),2,5));
    g.lineWidth = Math.max(1.4, lw*0.4); g.lineCap="round";
    const sx = sh.x, sy = sh.y;
    for(let k=0;k<3;k++){
      const a = (-0.55 - k*0.5)*dir;                 // fan back over the bent spine
      const L = h*(0.10 + grief*0.10);
      g.beginPath(); g.moveTo(sx, sy);
      g.lineTo(sx - Math.sin(a)*L, sy - Math.cos(a)*L*0.6 - h*0.02*k);
      g.stroke();
    }
  }
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t || 0;
  const grief = (typeof st.grief==="number") ? clamp(st.grief,0,1) : griefAt(t);

  const layers = st.layers || ["field","lattice","source","mourners"];
  const has = l => layers.includes(l);

  if (has("field"))    drawField(g,W,H,grief);
  if (has("lattice"))  drawLattice(pen,g,W,H,t,grief);
  if (has("source"))   drawSource(pen,g,W,H,t,grief);
  if (has("mourners")) for(const seat of params.seats) mourner(pen,g,W,H,seat,t,grief);
  return { anchors: asset.anchors, grief };
}

export const asset = {
  id:"divine_fx.shared-mourning",
  type:"DIVINE_FX",
  name:"Shared mourning",
  statusWord:"GRIEVING",
  scene:"OD-B04-S02",

  params,
  // back -> front; scene state may pass a subset (e.g. field-only, or drop the
  // lattice for a plain group weep)
  layers:["field","lattice","source","mourners"],
  // normalized 0..1 anchors: the source (spoken name), each bound position, and
  // the common center the collapse-lattice radiates through
  anchors:{
    "source:spoken-name":{x:.50,y:.60},
    "center:field":{x:.50,y:.60},
    "pos:far-left":{x:.285,y:.505},
    "pos:far-right":{x:.715,y:.505},
    "pos:near-left":{x:.205,y:.905},
    "pos:near-right":{x:.795,y:.905},
    "camera:wide":{x:.50,y:.50},
  },
  // affected regions (the four mourner cells + the field they share)
  zones:{
    field:{ x0:.08,y0:.30,x1:.92,y1:.98 },
    "cell:far-left":{ x0:.14,y0:.30,x1:.42,y1:.56 },
    "cell:far-right":{ x0:.58,y0:.30,x1:.86,y1:.56 },
    "cell:near-left":{ x0:.04,y0:.55,x1:.40,y1:.98 },
    "cell:near-right":{ x0:.60,y0:.55,x1:.96,y1:.98 },
  },

  // DIVINE_FX state machine: source (name spoken) -> field synchronises ->
  // transform (grief rises, holds) -> recovery (released together).
  states:{
    initial:"mourning",
    nodes:{
      // the name is spoken; sorrow just taking hold (early t / low grief)
      onset:{ preview:{ grief:0.35, t:1.2, status:"NAMED", progress:.20,
        layers:["field","lattice","source","mourners"] } },
      // full synchronised grief — veils up, tears falling, spines bowed (neutral)
      mourning:{ preview:{ grief:1.0, t:3.6, status:"GRIEVING", progress:.55,
        layers:["field","lattice","source","mourners"] } },
      // released together: veils lowered, tears spent, spines lifting (late t)
      recovery:{ preview:{ grief:0.35, t:7.6, status:"RECOVERING", progress:.85,
        layers:["field","lattice","source","mourners"] } },
    },
    edges:[["onset","mourning"],["mourning","recovery"],
           ["recovery","onset"],["mourning","onset"]],
  },
  duration:9.0,
  channels:["t","grief","veil","tears","posture","recovery"],

  preview:()=>({ grief:1.0, t:3.6, status:"GRIEVING", progress:.55,
    layers:["field","lattice","source","mourners"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
