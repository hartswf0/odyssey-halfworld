/* environment.sea-foam-and-following-wind-potential — a responsive shoreline
   field that can intensify into the voyage-driving west wind.
   ENVIRONMENT asset (procedural world force). Scene function (OD-B02-S05):
   a calm shoreline reads as latent POTENTIAL — foam lines lapping the beach,
   sea ripple, and faint gust arrows hanging in the air — and then, driven by
   the `intensity` channel, that latent field GATHERS into a steady following
   west wind: the gust arrows lengthen and darken, the foam crests stack and
   drive shoreward, the sea ripples steepen. One field, animatable over t, with
   source (west edge) / direction (eastward) / intensity / affected region.
   Solid grays + hard contour only — the engine POST pass supplies the halftone
   (do NOT pre-dither). */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;

const params = {
  horizon:    0.40,   // sea/sky line as frac of H
  shoreLevel: 0.86,   // where the foam laps the beach as frac of H
  dir:        1,      // wind/foam drive direction (+1 = eastward = to the right)
  source:    "west",  // the wind's origin edge
  foamLines:  6,      // scalloped foam crests stacked between horizon and shore
  rippleRows: 7,      // horizontal ripple bands across the sea
  gusts:      5,      // latent gust streamlines in the air
  intensity:  0.5,    // master field strength (channel-driven, 0=latent..~1.6=driving)
};

/* ---- SKY: the airspace the wind gathers in (lightest tone) ---- */
function drawSky(pen,g,W,H){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hy);
}

/* ---- SEA: base water + horizontal ripple bands that steepen with intensity ---- */
function drawSea(pen,g,W,H,t,inten){
  const hy = H*params.horizon, shoreY = H*params.shoreLevel;
  // water body: light so foam crests read as brighter bands on top of it
  g.fillStyle = inkLevel(2); g.fillRect(0,hy,W,shoreY-hy);
  // a slightly darker seam band right at the horizon so the far water recedes
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H*0.05);
  // wet-sand beach below the shore line (light, with faint reflected wash lines)
  g.fillStyle = inkLevel(1); g.fillRect(0,shoreY,W,H-shoreY);
  for(let k=1;k<=3;k++){
    const y = lerp(shoreY, H, k/4);
    g.strokeStyle = inkLevel(2); g.lineWidth = 2;
    g.beginPath();
    for(let x=-10;x<=W+10;x+=10){ const yy=y+Math.sin((x+t*15)/90*TAU)*3; if(x===-10)g.moveTo(x,yy);else g.lineTo(x,yy); }
    g.stroke();
  }
  // horizon seam
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 4);

  // ripple bands: wavy horizontal lines, denser + steeper toward shore
  const n = params.rippleRows;
  g.lineCap = "round";
  for(let r=0;r<n;r++){
    const f = r/(n-1);                          // 0 at horizon .. 1 at shore
    const y = lerp(hy+H*0.02, shoreY-H*0.03, f);
    const amp = lerp(2, 10, f) * (0.6 + 0.5*inten);
    const wl  = lerp(120, 60, f);               // wavelength shortens toward shore
    const lvl = Math.round(lerp(2, 4, f));
    g.strokeStyle = inkLevel(lvl);
    g.lineWidth = lerp(2, 4, f);
    g.beginPath();
    const drift = t*22*params.dir*(0.4+inten);
    for(let x=-10;x<=W+10;x+=8){
      const yy = y + Math.sin((x+drift)/wl*TAU)*amp;
      if (x===-10) g.moveTo(x,yy); else g.lineTo(x,yy);
    }
    g.stroke();
  }
}

/* ---- FOAM: scalloped bright crests lapping shoreward. Bright fill (reads as
   white foam under the halftone) with a hard contour edge. More + higher-
   contrast crests as the field intensifies. ---- */
function drawFoam(pen,g,W,H,t,inten){
  const hy = H*params.horizon, shoreY = H*params.shoreLevel;
  const active = Math.max(2, Math.round(params.foamLines * (0.45 + 0.6*clamp(inten,0,1.6))));
  for(let i=0;i<active;i++){
    const f = i/(params.foamLines-1);            // 0 near horizon .. 1 at shore
    const baseY = lerp(hy+H*0.10, shoreY, f);
    const bumps = Math.round(lerp(7, 13, f));
    const amp   = lerp(4, 12, f) * (0.7 + 0.4*inten);
    const phase = t*0.6*params.dir + i*0.9;
    // scalloped crest: a run of bumps; fill the sliver above it bright
    g.beginPath();
    g.moveTo(-10, baseY+amp);
    for(let b=0;b<=bumps;b++){
      const x0 = lerp(-10, W+10, b/bumps);
      const x1 = lerp(-10, W+10, (b+0.5)/bumps);
      const crest = baseY - amp*(0.6+0.4*Math.sin(b*1.7+phase));
      g.quadraticCurveTo(x0, crest, x1, baseY+amp);
    }
    g.lineTo(W+10, baseY+amp+18);
    g.lineTo(-10, baseY+amp+18);
    g.closePath();
    // brightness: near-shore foam whiter; far foam a touch grayer
    g.fillStyle = inkLevel(Math.round(lerp(2,1,f)));
    g.fill();
    // hard scalloped contour edge
    g.strokeStyle = INK; g.lineWidth = lerp(2.5,4,f); g.lineJoin="round";
    g.beginPath();
    for(let b=0;b<=bumps;b++){
      const x0 = lerp(-10, W+10, b/bumps);
      const x1 = lerp(-10, W+10, (b+0.5)/bumps);
      const crest = baseY - amp*(0.6+0.4*Math.sin(b*1.7+phase));
      if (b===0) g.moveTo(-10, baseY+amp);
      g.quadraticCurveTo(x0, crest, x1, baseY+amp);
    }
    g.stroke();
    // a scatter of foam flecks above the crest, more with intensity
    const flecks = Math.round(lerp(3,9,f)*(0.5+inten));
    g.fillStyle = inkLevel(6);
    for(let k=0;k<flecks;k++){
      const fx = (k*97.3 + i*53.1)%(W);
      const fy = baseY - amp - (k*13.7%18) - 2;
      g.beginPath(); g.arc(fx, fy, 1.4+ (k%2), 0, TAU); g.fill();
    }
  }
}

/* ---- WIND: latent gust arrows that GATHER into the following west wind.
   At low intensity: short, faint chevrons hanging in the air (potential).
   At high intensity: long, dark streamlines with strong arrowheads, all
   pointing eastward — the voyage-driving wind. ---- */
function drawWind(pen,g,W,H,t,inten){
  const hy = H*params.horizon;
  const dir = params.dir;
  const n = params.gusts;
  const strength = clamp(inten,0,1.6);
  const lvl = Math.round(lerp(2, 6, clamp(strength/1.3,0,1)));
  g.lineCap="round"; g.lineJoin="round";
  for(let i=0;i<n;i++){
    const fy = (i+0.5)/n;
    const y = lerp(hy*0.16, hy*0.92, fy) + Math.sin(t*1.1+i)*4;
    const len = lerp(W*0.14, W*0.62, clamp(strength,0,1.4)) * (0.7+0.3*Math.sin(i*1.3));
    // streamline sweeps in from the WEST (source) edge, drifting with t
    const march = ((t*40*(0.3+strength) + i*57) % (W*0.5));
    const x0 = dir>0 ? (W*0.06 + march) : (W*0.94 - march);
    const x1 = x0 + dir*len;
    const wob = lerp(3, 10, clamp(strength,0,1));
    g.strokeStyle = inkLevel(lvl);
    g.lineWidth = lerp(2.5, 6, clamp(strength/1.3,0,1));
    // gently curved streamline
    g.beginPath();
    g.moveTo(x0, y);
    g.quadraticCurveTo((x0+x1)/2, y - wob, x1, y);
    g.stroke();
    // arrowhead (chevron) at the leading tip, pointing in wind direction
    const ah = lerp(7, 20, clamp(strength/1.2,0,1));
    g.beginPath();
    g.moveTo(x1 - dir*ah, y - ah*0.7);
    g.lineTo(x1, y);
    g.lineTo(x1 - dir*ah, y + ah*0.7);
    g.stroke();
  }
  // SOURCE mark: a faint clustered gust bloom on the west edge (where wind is born)
  const sx = dir>0 ? W*0.03 : W*0.97;
  g.strokeStyle = inkLevel(Math.round(lerp(1,4,clamp(strength,0,1))));
  g.lineWidth = 2.5;
  for(let k=0;k<3;k++){
    const yk = hy*0.5 + (k-1)*hy*0.22;
    g.beginPath();
    g.moveTo(sx, yk);
    g.quadraticCurveTo(sx+dir*W*0.05, yk-6, sx+dir*W*0.10*(0.5+strength), yk);
    g.stroke();
  }
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t || 0;
  const inten = (st.intensity!=null ? st.intensity : params.intensity);
  const layers = st.layers || ["sky","sea","foam","wind","source"];
  const has = l => layers.includes(l);

  if (has("sky"))  drawSky(pen,g,W,H);
  if (has("sea"))  drawSea(pen,g,W,H,t,inten);
  if (has("foam")) drawFoam(pen,g,W,H,t,inten);
  if (has("wind") || has("source")) drawWind(pen,g,W,H,t,inten);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"environment.sea-foam-and-following-wind-potential",
  type:"ENVIRONMENT",
  name:"Sea foam and following wind potential",
  statusWord:"LATENT",
  scene:"OD-B02-S05",

  params,
  // back -> front; scene state may pass a subset of layers
  layers:["sky","sea","foam","wind","source"],
  // normalized 0..1 field anchors: source edge, direction target, affected zones
  anchors:{
    "source:west-wind":{x:.04,y:.20},   // where the following wind is born
    "direction:east":{x:.96,y:.20},     // the voyage heading the wind drives toward
    "field:air":{x:.50,y:.20},          // the airspace the gusts gather in
    "foam:shore":{x:.50,y:.86},         // the lapping foam line at the beach
    "sea:surface":{x:.50,y:.60},        // the rippling water region
    "camera:wide":{x:.50,y:.50},
  },
  // affected regions (for scene placement / pathing / wind exposure)
  zones:{
    air:{ x0:.00,y0:.02,x1:1.0,y1:.40 },
    water:{ x0:.00,y0:.40,x1:1.0,y1:.90 },
    shore:{ x0:.00,y0:.78,x1:1.0,y1:.94 },
  },

  // ENVIRONMENT state machine: latent potential -> rising -> driving following wind
  states:{
    initial:"latent",
    nodes:{
      // latent: calm shore, faint hanging gusts — the POTENTIAL, no drive yet
      latent:{ preview:{ t:0.4, intensity:0.35, status:"LATENT", progress:.12 } },
      // rising: the field gathers — gusts lengthen, foam begins to stack shoreward
      rising:{ preview:{ t:1.4, intensity:0.85, status:"RISING", progress:.48 } },
      // following-wind: full voyage-driving west wind, foam driven shoreward
      "following-wind":{ preview:{ t:2.6, intensity:1.5, status:"FOLLOWING", progress:.86 } },
    },
    edges:[["latent","rising"],["rising","following-wind"],["following-wind","rising"],["rising","latent"]],
  },
  duration:6.0,
  channels:["intensity","direction","gust","foam","t"],

  preview:()=>({ t:1.1, intensity:0.7, status:"LATENT", progress:.30,
                 layers:["sky","sea","foam","wind","source"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
