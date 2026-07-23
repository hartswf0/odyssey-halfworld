/* divine_fx.ithaca-memory-landscape — home, recalled across the water.
   DIVINE_FX asset. Scene function (OD-B09-S01): the memory of Ithaca surfaces
   as a faint recalled vista — a distant rocky island crowned by Mount Neriton,
   a scatter of surrounding islets on the swell, a curl of hearth smoke rising
   from the home fire, and a longing glow that pulses outward from that hearth
   like home tugging across the sea.

   Procedural DIVINE_FX: SOURCE (the hearth / home fire — the one crisp mark, the
   thing that emits both the smoke and the longing) -> FIELD (the recalled sky,
   sea, island, and islets) -> TRANSFORM (how vividly the memory stands clear of
   the mist, by state / t) -> visible CONSEQUENCE (the longing glow pulses, the
   smoke curls and drifts, the islets bob, and the mist advances or retreats so
   the whole vista surfaces and recedes). Everything animates over state.t.

   Drawn in SOLID grays + contour into the offscreen ctx; the engine POST pass
   supplies the halftone (do NOT pre-dither). The island holds a moderate contour
   so it reads as land; every other stratum is drawn at LOW ink so the vista stays
   "faintly recalled" — never a black blob, never empty. A translucent white wash
   (`mist`) whitens the whole field to push it back into memory. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);
const pr = (i,s=1)=> frac(Math.sin(i*12.9898 + s*78.233)*43758.5453);

const params = {
  horizon:  0.62,    // sea line (frac of H)
  islandCx: 0.50,    // main island center x
  peakY:    0.285,   // Mount Neriton summit (frac of H)
  hearthX:  0.405,   // home fire on the island's near flank
  hearthY:  0.475,
  glowCx:   0.47,    // longing-glow center (over the peak's shoulder)
  glowCy:   0.36,
  glowRings:4,       // rings of longing radiating from home
  islets:   4,       // surrounding islets on the swell
  smokeSegs:12,      // hearth-smoke plume segments
};

/* ridge profile of the main island: [xfrac, yfrac] from near the left waterline
   up the rocky steps to Mount Neriton's summit, over a saddle to a secondary
   shoulder, then down to the right waterline. Hand-authored so it always reads. */
const RIDGE = [
  [0.155,0.620],[0.210,0.548],[0.262,0.505],[0.315,0.452],[0.365,0.402],
  [0.412,0.338],[0.455,0.285],            // <- Mount Neriton summit
  [0.498,0.352],[0.542,0.318],            // saddle -> secondary shoulder
  [0.598,0.400],[0.660,0.470],[0.722,0.540],[0.798,0.598],[0.845,0.620],
];

/* a faint memory fill: flat gray body + optional same-family contour so a
   silhouette holds its edge but stays low under the halftone. */
function ghost(g, pathFn, fillL, edgeL=null, lw=2){
  g.beginPath(); pathFn();
  g.fillStyle = inkLevel(clamp(fillL,0,7)); g.fill();
  if (edgeL!=null){ g.strokeStyle = inkLevel(clamp(edgeL,1,7)); g.lineWidth = lw; g.lineJoin="round"; g.stroke(); }
}

/* ---- FIELD: the recalled sky over the recalled sea, with a soft horizon and
   a few low striations so the water reads as distance, not blank paper. ---- */
function drawField(g,W,H){
  const hz = H*params.horizon;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hz);        // sky of memory
  g.fillStyle = inkLevel(2); g.fillRect(0,hz,W,H-hz);     // sea of memory
  // the far horizon the island sits against
  g.strokeStyle = inkLevel(3); g.lineWidth = 2;
  g.beginPath(); g.moveTo(0,hz); g.lineTo(W,hz); g.stroke();
  // faint receding swell lines on the near water
  g.strokeStyle = inkLevel(3); g.lineWidth = 1.4; g.globalAlpha = 0.6;
  for(let j=1;j<=4;j++){
    const y = hz + (H-hz)*(j*j)/22;
    g.beginPath();
    for(let x=0;x<=W;x+=W/12){ const wob = Math.sin(x*0.03 + j)*2.2; (x===0?g.moveTo(x,y+wob):g.lineTo(x,y+wob)); }
    g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---- longing GLOW: a halo of concentric rings centered on the summit and
   welling out into the sky, pulsing slowly on t — home's pull radiating across
   the water. Drawn faint but present so it reads as an aura behind the peak. --*/
function drawGlow(g,W,H,t){
  const cx = W*params.glowCx, cy = H*params.glowCy;
  const pulse = 0.5 + 0.5*Math.sin(t*1.3);
  // soft halo body behind the peak
  g.save(); g.globalAlpha = 0.30 + pulse*0.10; g.fillStyle = inkLevel(2);
  g.beginPath(); g.ellipse(cx, cy, W*0.22, H*0.17, 0, 0, TAU); g.fill(); g.restore();
  // radiating rings of longing, reaching up into the sky around the summit
  for(let k=0;k<params.glowRings;k++){
    const rr = W*0.14 + k*W*0.060 + pulse*W*0.020*(k+1);
    g.strokeStyle = inkLevel(clamp(3, 1, 4));
    g.lineWidth = lerp(3.2, 1.4, k/params.glowRings);
    g.globalAlpha = clamp(0.42 - k*0.07 + pulse*0.12, 0.12, 0.55);
    g.beginPath(); g.ellipse(cx, cy, rr, rr*0.80, 0, 0, TAU); g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---- surrounding ISLETS: small rocky humps scattered on the swell, flanking
   the main island, fainter than it and bobbing gently on t. ---- */
function drawIslets(g,W,H,t){
  const hz = H*params.horizon;
  const spots = [
    [0.135,0.632,0.055], [0.255,0.648,0.038],
    [0.795,0.636,0.048], [0.905,0.650,0.036],
  ];
  for(let i=0;i<Math.min(params.islets,spots.length);i++){
    const [fx,fy,fs] = spots[i];
    const bob = Math.sin(t*1.1 + i*1.7)*H*0.004;
    const x = W*fx, y = H*fy + bob, s = W*fs;
    ghost(g, ()=>{
      g.moveTo(x-s, y);
      g.quadraticCurveTo(x-s*0.5, y-s*0.7, x-s*0.1, y-s*0.72);
      g.quadraticCurveTo(x+s*0.4, y-s*0.75, x+s*0.7, y-s*0.35);
      g.quadraticCurveTo(x+s*0.95, y-s*0.05, x+s, y);
      g.closePath();
    }, 3, 4, 1.6);
    // a low reflection smear beneath
    g.fillStyle = inkLevel(2); g.globalAlpha = 0.5;
    g.beginPath(); g.ellipse(x, y+s*0.16, s*0.8, s*0.10, 0, 0, TAU); g.fill();
    g.globalAlpha = 1;
  }
}

/* ---- the main ISLAND: a distant rocky mass crowned by Mount Neriton. A
   two-tone silhouette (sunlit near face vs shadowed far face) with a moderate
   contour and a few interior ridge seams so the rock reads faceted, not flat. */
function drawIsland(g,W,H){
  const hz = H*params.horizon;
  const px = i => W*RIDGE[i][0], py = i => H*RIDGE[i][1];
  const summit = 6; // index of the Neriton summit in RIDGE

  // faint reflection of the island in the water below the horizon (mirrored,
  // compressed, broken by the swell) — fills the recalled sea, doubles the vista
  g.save();
  g.globalAlpha = 0.45; g.fillStyle = inkLevel(3);
  g.beginPath();
  g.moveTo(px(0), hz);
  for(let i=1;i<RIDGE.length;i++){ const h = hz - py(i); g.lineTo(px(i), hz + h*0.55); }
  g.lineTo(px(RIDGE.length-1), hz);
  g.closePath(); g.fill();
  g.restore();
  // horizontal water streaks that break the reflection into ripples
  g.save(); g.fillStyle = "#ffffff"; g.globalAlpha = 0.7;
  for(let j=0;j<5;j++){ const y = hz + H*(0.02 + j*0.028); g.fillRect(0, y, W, H*0.012); }
  g.restore();

  // full silhouette body (near-face tone) — kept light so it reads as a
  // faintly recalled distance, not a black blob
  ghost(g, ()=>{
    g.moveTo(px(0), py(0));
    for(let i=1;i<RIDGE.length;i++) g.lineTo(px(i), py(i));
    g.lineTo(px(RIDGE.length-1), hz);
    g.lineTo(px(0), hz);
    g.closePath();
  }, 3);

  // shadowed FAR face: from the summit down the right ridge to the waterline
  ghost(g, ()=>{
    g.moveTo(px(summit), py(summit));
    for(let i=summit+1;i<RIDGE.length;i++) g.lineTo(px(i), py(i));
    g.lineTo(px(RIDGE.length-1), hz);
    g.lineTo(px(summit), hz);
    g.closePath();
  }, 4);

  // moderate contour along the ridge so it holds as land against the mist
  g.strokeStyle = inkLevel(6); g.lineWidth = 2.6; g.lineJoin="round"; g.lineCap="round";
  g.beginPath();
  g.moveTo(px(0), py(0));
  for(let i=1;i<RIDGE.length;i++) g.lineTo(px(i), py(i));
  g.stroke();

  // interior ridge seams dropping from the summit + shoulder — faceted rock
  g.strokeStyle = inkLevel(6); g.lineWidth = 1.8; g.globalAlpha = 0.8;
  const seam=(ax,ay,bx,by)=>{ g.beginPath(); g.moveTo(W*ax,H*ay); g.lineTo(W*bx,H*by); g.stroke(); };
  seam(0.455,0.285, 0.470,0.470);   // summit -> mid
  seam(0.470,0.470, 0.520,0.600);   // mid -> waterline
  seam(0.455,0.285, 0.360,0.470);   // summit -> near shoulder
  seam(0.542,0.318, 0.560,0.480);   // secondary shoulder -> down
  g.globalAlpha = 1;

  // summit accent mark (a tiny notch of highest rock)
  ghost(g, ()=>{ g.moveTo(W*0.442,H*0.300); g.lineTo(W*0.455,H*0.285); g.lineTo(W*0.468,H*0.300);
    g.lineTo(W*0.455,H*0.312); g.closePath(); }, 6);
}

/* ---- SOURCE: the HEARTH / home fire — the one crisp mark on the island, the
   emitter of both the smoke and the longing. A small solid ember ringed by its
   own warm light and a couple of short flame ticks (no white core / eye). ---- */
function drawHearth(g,W,H,t){
  const hx = W*params.hearthX, hy = H*params.hearthY;
  const flick = 0.5 + 0.5*Math.sin(t*6.0);
  // warm firelight ring around the ember
  g.save(); g.globalAlpha = 0.35 + flick*0.10; g.fillStyle = inkLevel(3);
  g.beginPath(); g.ellipse(hx, hy, W*0.030, H*0.020, 0, 0, TAU); g.fill(); g.restore();
  // the ember itself — a small solid dark mark (crisp anchor)
  const pen = makePen(g,{outline:true});
  pen.paint(()=> g.ellipse(hx, hy, W*0.012, H*0.007, 0, 0, TAU), toneSolid(inkLevel(6)), 2.2);
  // short flame ticks licking up
  g.strokeStyle = inkLevel(5); g.lineWidth = 2.2; g.lineCap="round";
  for(let k=-1;k<=1;k++){
    g.beginPath();
    g.moveTo(hx+k*W*0.008, hy-H*0.003);
    g.lineTo(hx+k*W*0.006, hy-H*0.013 - flick*H*0.006);
    g.stroke();
  }
}

/* ---- hearth SMOKE: a curling ribbon rising from the home fire, wavering on t
   and leaning up-and-left into the open sky so it stands clear of the dark peak.
   Drawn as a smooth two-pass ribbon (soft halo + darker core) plus dwindling
   puffs, so the curl reads legibly yet stays a faint recollection. ---- */
function drawSmoke(g,W,H,t){
  const hx = W*params.hearthX, hy = H*params.hearthY - H*0.014;
  const n = params.smokeSegs;
  const pts = [];
  for(let i=0;i<=n;i++){
    const u = i/n;                                    // 0 at hearth .. 1 high
    const rise = u*H*0.34;
    // an S-curl (two sine lobes) plus a steady up-left lean into open sky
    const curl = (Math.sin(t*1.3 + u*5.0)*u + Math.sin(u*9.0)*0.4*u) * W*0.032;
    const lean = -u*u*W*0.11;
    pts.push([hx + curl + lean, hy - rise]);
  }
  const smoothPath = ()=>{
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for(let i=1;i<pts.length-1;i++){
      const mx=(pts[i][0]+pts[i+1][0])/2, my=(pts[i][1]+pts[i+1][1])/2;
      g.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
    }
    g.lineTo(pts[pts.length-1][0], pts[pts.length-1][1]);
  };
  g.lineCap="round"; g.lineJoin="round";
  // soft halo pass (wide, faint)
  g.strokeStyle = inkLevel(3); g.lineWidth = W*0.028; g.globalAlpha = 0.28;
  smoothPath(); g.stroke();
  // darker core pass (narrow, tapering), tone fading up the plume
  for(let i=1;i<pts.length;i++){
    const u=i/n;
    g.strokeStyle = inkLevel(clamp(Math.round(5 - u*2.5), 1, 5));
    g.lineWidth = lerp(6.0, 1.4, u);
    g.globalAlpha = clamp(0.85 - u*0.55, 0.20, 0.85);
    g.beginPath(); g.moveTo(pts[i-1][0],pts[i-1][1]); g.lineTo(pts[i][0],pts[i][1]); g.stroke();
  }
  // dwindling puffs riding the upper plume
  for(let i=0;i<4;i++){
    const u = 0.4 + i*0.18;
    const [x,y] = pts[Math.min(pts.length-1, Math.round(u*n))];
    g.fillStyle = inkLevel(clamp(Math.round(4-i*0.8),1,4));
    g.globalAlpha = clamp(0.55 - i*0.11, 0.12, 0.55);
    g.beginPath(); g.ellipse(x, y, W*(0.020+u*0.014), H*(0.012+u*0.010), 0, 0, TAU); g.fill();
  }
  g.globalAlpha = 1;
}

/* ---- MIST: a translucent white wash that whitens the whole vista, pushing it
   back into memory. Higher `mist` = the recollection is only surfacing or
   already receding; low = it stands clear. Plus a denser band along the horizon
   for atmosphere. ---- */
function drawMist(g,W,H,mist){
  const hz = H*params.horizon;
  // localized horizon haze (always a touch, so the island floats in distance)
  g.save(); g.fillStyle="#ffffff";
  for(let b=0;b<3;b++){
    g.globalAlpha = 0.16 - b*0.04;
    g.fillRect(0, hz - H*0.05 + b*H*0.02, W, H*0.05);
  }
  g.restore();
  // global recollection wash
  if (mist>0){
    g.save(); g.globalAlpha = clamp(mist,0,0.85); g.fillStyle="#ffffff";
    g.fillRect(0,0,W,H); g.restore();
  }
}

function drawFX(ctx,W,H,st){
  const g = ctx;
  const t = st.t || 0;
  const mist = (st.mist!=null) ? st.mist : 0.05;
  const layers = st.layers || ["field","glow","islets","island","hearth","smoke","mist"];
  const has = l => layers.includes(l);

  if (has("field"))  drawField(g,W,H);
  if (has("glow"))   drawGlow(g,W,H,t);
  if (has("islets")) drawIslets(g,W,H,t);
  if (has("island")) drawIsland(g,W,H);
  if (has("hearth")) drawHearth(g,W,H,t);
  if (has("smoke"))  drawSmoke(g,W,H,t);
  if (has("mist"))   drawMist(g,W,H,mist);
  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.ithaca-memory-landscape",
  type:"DIVINE_FX",
  name:"Ithaca Memory Landscape",
  statusWord:"LONGING",
  scene:"OD-B09-S01",

  params,
  // back -> front; scene state may pass a subset to isolate a stratum
  layers:["field","glow","islets","island","hearth","smoke","mist"],
  // normalized 0..1 anchors: the source hearth, the peak, the glow field, the
  // flanking islets, the horizon, and camera
  anchors:{
    "source:hearth":{x:0.405,y:0.475},
    "summit:neriton":{x:0.455,y:0.285},
    "field:glow":{x:0.470,y:0.400},
    "islet:left":{x:0.135,y:0.632},
    "islet:right":{x:0.795,y:0.636},
    "horizon:sea":{x:0.500,y:0.620},
    "camera:wide":{x:0.500,y:0.500},
  },
  // affected regions of the field (for scene placement / occlusion)
  zones:{
    sky:{ x0:0, y0:0,    x1:1, y1:0.62 },
    sea:{ x0:0, y0:0.62, x1:1, y1:1 },
    island:{ x0:0.155, y0:0.285, x1:0.845, y1:0.62 },
  },

  // DIVINE_FX state machine: the memory SURFACES from mist, stands clear in
  // LONGING, then RECEDES back into mist — a transform over t + mist depth.
  states:{
    initial:"longing",
    nodes:{
      // surfacing: island only half-present, glow weak, heavy mist (low t)
      surfacing:{ preview:{ t:0.5, mist:0.42, status:"SURFACING", progress:0.20,
        layers:["field","glow","islets","island","hearth","smoke","mist"] } },
      // longing: the vista stands clear, glow pulsing, smoke full-curl (neutral)
      longing:{ preview:{ t:2.6, mist:0.05, status:"LONGING", progress:0.55,
        layers:["field","glow","islets","island","hearth","smoke","mist"] } },
      // receding: the mist reclaims it, the memory dims and slips away (high t)
      receding:{ preview:{ t:5.2, mist:0.50, status:"RECEDING", progress:0.85,
        layers:["field","glow","islets","island","hearth","smoke","mist"] } },
    },
    edges:[["surfacing","longing"],["longing","receding"],
           ["receding","surfacing"],["longing","surfacing"]],
  },
  duration:8.0,
  channels:["surface","mist","glow","smoke","t"],

  preview:()=>({ t:2.6, mist:0.05, status:"LONGING", progress:0.55,
    layers:["field","glow","islets","island","hearth","smoke","mist"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
