/* sound_source.feast-noise — the continuous din of a hall at feast.
   SOUND_SOURCE asset. An ADDRESSABLE DIEGETIC EMITTER rendered as a legible
   emitter DIAGRAM, not an illustration: a position marker (crosshair target),
   concentric radiating intensity rings (the sound field), a bottom rhythm
   strip of beat ticks, and four small source glyphs (lyre / voice / cup /
   carving) tethered to the emitter. Drawn in SOLID grays + hard contour into
   the offscreen ctx; the engine dotify pass supplies the halftone. Do NOT
   pre-dither.

   Scene function (OD-B01-S04): continuous distant lyre, voices, cups, and
   carving that DUCKS beneath a private exchange. The whole diagram is driven
   by { intensity, ducked, rings, beats } so the runtime can raise, lower, or
   stop the bed. States: playing / ducked / swelling / stopped.
   Atlas: addressable emitter — position, intensity, rhythm, start/stop. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  emitter:{ x:0.50, y:0.40 },  // emitter position in asset space (the hall, off the private pair)
  ringR:[52,104,156,208,260],  // concentric ring radii in source px (near..far)
  glyphR:150,                  // radius at which source glyphs sit around the marker
  beatCount:24,                // rhythm ticks along the bottom strip
  beatPattern:[3,1,2,1,3,1,1,2, 3,1,2,1, 3,2,1,2, 3,1,1,2, 3,1,2,1], // 1=soft..3=accent
  intensity:0.85,              // default loudness 0..1
};

/* ---- source glyphs (each drawn in a local box of size s, centered cx,cy) ---- */
function glyphLyre(pen,g,cx,cy,s){
  const t = toneSolid(inkLevel(4));
  // sound-box
  pen.paint(()=>{ g.moveTo(cx-s*.20,cy+s*.30); g.lineTo(cx+s*.20,cy+s*.30);
    g.lineTo(cx+s*.30,cy+s*.55); g.lineTo(cx-s*.30,cy+s*.55); g.closePath(); }, t, 4);
  // two curved arms rising to a yoke
  pen.ink(()=>{ g.moveTo(cx-s*.20,cy+s*.30); g.quadraticCurveTo(cx-s*.62,cy-s*.10,cx-s*.34,cy-s*.55); },4);
  pen.ink(()=>{ g.moveTo(cx+s*.20,cy+s*.30); g.quadraticCurveTo(cx+s*.62,cy-s*.10,cx+s*.34,cy-s*.55); },4);
  // yoke (crossbar)
  pen.ink(()=>{ g.moveTo(cx-s*.40,cy-s*.50); g.lineTo(cx+s*.40,cy-s*.50); },4);
  // strings
  for(let i=-1;i<=1;i++){ pen.ink(()=>{ g.moveTo(cx+i*s*.14,cy-s*.44); g.lineTo(cx+i*s*.14,cy+s*.30); },2); }
}
function glyphVoice(pen,g,cx,cy,s){
  // a small profile head as the emitter dot + three emanating speech arcs
  pen.paint(()=>{ g.arc(cx-s*.24,cy,s*.22,0,7); }, toneSolid(inkLevel(6)), 4);
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
  for(let i=1;i<=3;i++){ g.beginPath(); g.arc(cx-s*.24,cy,s*(.18+i*.20),-0.7,0.7); g.stroke(); }
}
function glyphCup(pen,g,cx,cy,s){
  const t = toneSolid(inkLevel(4));
  // shallow kylix bowl
  pen.paint(()=>{ g.moveTo(cx-s*.40,cy-s*.18); g.quadraticCurveTo(cx,cy+s*.34,cx+s*.40,cy-s*.18);
    g.closePath(); }, t, 4);
  // two handles
  g.strokeStyle=INK; g.lineWidth=3;
  g.beginPath(); g.arc(cx-s*.40,cy-s*.12,s*.14,-1.9,0.9); g.stroke();
  g.beginPath(); g.arc(cx+s*.40,cy-s*.12,s*.14,2.3,-0.7,true); g.stroke();
  // stem + foot
  pen.ink(()=>{ g.moveTo(cx,cy+s*.06); g.lineTo(cx,cy+s*.42); },4);
  pen.ink(()=>{ g.moveTo(cx-s*.24,cy+s*.46); g.lineTo(cx+s*.24,cy+s*.46); },4);
}
function glyphCarving(pen,g,cx,cy,s){
  const t = toneSolid(inkLevel(5));
  // knife blade
  pen.paint(()=>{ g.moveTo(cx-s*.42,cy-s*.30); g.lineTo(cx+s*.10,cy+s*.02);
    g.lineTo(cx-s*.30,cy+s*.06); g.closePath(); }, t, 4);
  // handle
  pen.limb(()=>{ g.moveTo(cx+s*.08,cy+s*.00); g.lineTo(cx+s*.42,cy+s*.24); }, toneSolid(inkLevel(3)), 8);
  // two cut chevrons (carving marks)
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
  for(let i=0;i<2;i++){ g.beginPath(); g.moveTo(cx-s*.30,cy+s*.34+i*s*.16);
    g.lineTo(cx-s*.10,cy+s*.28+i*s*.16); g.lineTo(cx+s*.10,cy+s*.34+i*s*.16); g.stroke(); }
}
const GLYPHS = [
  { name:"lyre",    ang:-Math.PI*0.5,  draw:glyphLyre },
  { name:"voices",  ang:-Math.PI*0.06, draw:glyphVoice },
  { name:"cups",    ang: Math.PI*0.58, draw:glyphCup },
  { name:"carving", ang: Math.PI*1.06, draw:glyphCarving },
];

function drawDiagram(ctx,W,H,st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mx = W*params.emitter.x, my = H*params.emitter.y;
  const intensity = clamp(st.intensity ?? params.intensity, 0, 1);
  const ducked = !!st.ducked;
  const stopped = !!st.stopped;
  const litRings = stopped ? 0 : Math.max(1, Math.round(lerp(1.5, params.ringR.length, intensity)));

  // ---- SOUND FIELD: faint disc under the rings (the emitter's reach) ----
  if (!stopped){
    const fieldR = params.ringR[litRings-1] + 26;
    pen.paint(()=>{ g.arc(mx,my,fieldR,0,7); }, toneSolid(inkLevel(ducked?1:2)), 0);
  }

  // ---- RADIATING INTENSITY RINGS (near = bold, far = faint) ----
  for(let i=0;i<litRings;i++){
    const r = params.ringR[i];
    const lw = clamp(6 - i*1.0, 2, 6);
    g.strokeStyle = INK; g.lineWidth = ducked ? Math.max(2,lw-1.5) : lw;
    g.globalAlpha = ducked ? 0.55 : 1;
    g.beginPath(); g.arc(mx,my,r,0,7); g.stroke();
    g.globalAlpha = 1;
  }

  // ---- DUCK FLOOR: the private-exchange band the bed drops beneath ----
  if (ducked){
    const by = my + params.ringR[Math.min(litRings,params.ringR.length)-1]*0.30;
    g.save(); g.strokeStyle=ACCENT; g.lineWidth=3; g.setLineDash([10,8]);
    g.beginPath(); g.moveTo(mx-params.ringR[params.ringR.length-1], by);
    g.lineTo(mx+params.ringR[params.ringR.length-1], by); g.stroke(); g.restore();
  }

  // ---- SOURCE GLYPHS tethered to the marker ----
  for(const gl of GLYPHS){
    const gx = mx + Math.cos(gl.ang)*params.glyphR;
    const gy = my + Math.sin(gl.ang)*params.glyphR;
    // tether line from marker to glyph
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    g.beginPath(); g.moveTo(mx,my); g.lineTo(gx,gy); g.stroke(); g.globalAlpha=1;
    // seat disc so the glyph reads above the ring strokes
    pen.paint(()=>{ g.arc(gx,gy,40,0,7); }, toneSolid(inkLevel(1)), 3);
    gl.draw(pen,g,gx,gy,54);
  }

  // ---- POSITION MARKER: crosshair target at the emitter ----
  g.strokeStyle=INK; g.lineWidth=3;
  g.beginPath(); g.moveTo(mx-38,my); g.lineTo(mx+38,my); g.stroke();
  g.beginPath(); g.moveTo(mx,my-38); g.lineTo(mx,my+38); g.stroke();
  pen.paint(()=>{ g.arc(mx,my,24,0,7); }, toneSolid(inkLevel(1)), 4);
  pen.paint(()=>{ g.arc(mx,my,10,0,7); }, toneSolid(inkLevel(7)), 3);

  // ---- RHYTHM STRIP: beat ticks along the bottom baseline ----
  const bx0 = W*0.14, bx1 = W*0.86, baseY = H*0.86;
  const n = params.beatCount, span = bx1-bx0, gapW = span/(n-1);
  // baseline
  pen.ink(()=>{ g.moveTo(bx0-14, baseY); g.lineTo(bx1+14, baseY); }, 3);
  for(let i=0;i<n;i++){
    const bx = bx0 + i*gapW;
    const acc = params.beatPattern[i % params.beatPattern.length]; // 1..3
    const on = stopped ? false : (i/n) <= (intensity*1.02 + 0.02);
    const h = (12 + acc*16) * (ducked?0.55:1);
    const lvl = on ? (acc>=3?6:acc>=2?5:4) : 1;
    g.fillStyle = inkLevel(lvl);
    const w = acc>=3?9:6;
    g.fillRect(bx-w/2, baseY-h, w, h);
    if (on){ g.strokeStyle=INK; g.lineWidth=2; g.strokeRect(bx-w/2, baseY-h, w, h); }
  }
}

export const asset = {
  id:"sound_source.feast-noise",
  type:"SOUND_SOURCE",
  name:"Feast noise",
  statusWord:"PLAYING",
  scene:"OD-B01-S04",

  params,
  // back -> front draw order the diagram honors
  layers:["field","rings","duck-floor","tethers","glyphs","marker","rhythm"],
  // normalized 0..1 emitter position + the four source contributors + duck target
  anchors:{
    "emitter:position":{ x:0.50, y:0.40 },
    "source:lyre":{ x:0.50, y:0.23 },
    "source:voices":{ x:0.71, y:0.39 },
    "source:cups":{ x:0.62, y:0.52 },
    "source:carving":{ x:0.39, y:0.52 },
    "duck:target":{ x:0.50, y:0.55 },
    "camera:diagram":{ x:0.50, y:0.50 },
  },
  // relation to visible action: the bed fills the room, ducks under the pair
  zones:{ field:{ x0:.14,y0:.12,x1:.86,y1:.66 }, rhythm:{ x0:.14,y0:.80,x1:.86,y1:.90 } },
  states:{
    initial:"playing",
    nodes:{
      playing:{ preview:{ intensity:0.85, ducked:false, stopped:false, status:"PLAYING", progress:0.85 } },
      swelling:{ preview:{ intensity:1.00, ducked:false, stopped:false, status:"SWELLING", progress:1.00 } },
      ducked:{ preview:{ intensity:0.42, ducked:true,  stopped:false, status:"DUCKED",  progress:0.42 } },
      stopped:{ preview:{ intensity:0.00, ducked:false, stopped:true,  status:"SILENT",  progress:0.02 } },
    },
    edges:[
      ["playing","ducked"],["ducked","playing"],
      ["playing","swelling"],["swelling","playing"],
      ["playing","stopped"],["stopped","playing"],
    ],
  },
  channels:["intensity","rhythm","pan","reveal"],

  preview:()=>({ intensity:0.85, ducked:false, stopped:false, status:"PLAYING", progress:0.85 }),
  draw(ctx,W,H,state){ drawDiagram(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
