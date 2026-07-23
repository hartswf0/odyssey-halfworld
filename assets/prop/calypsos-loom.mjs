/* prop.calypsos-loom — Calypso's fine upright frame loom + golden shuttle.
   PROP asset. A slender, elegant TWO-BEAM vertical frame loom: two fine turned
   posts crowned with finials, a top cloth-beam and a bottom warp-beam closing a
   rectangular frame, a fine web of warp threads, a partly-woven cloth with its
   fell (weaving) edge, a single heddle rod — and Calypso's signature GOLDEN
   SHUTTLE flying through the shed. Drawn in SOLID grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Deliberately DISTINCT from prop.laertess-shroud-and-loom (a heavy WARP-WEIGHTED
   loom with hanging clay weights and thick uprights). This is a closed, fine,
   upright FRAME loom — thin posts, finials, a real bottom beam (no dangling
   weights), a fine warp, and a bright golden shuttle, not a plain boat shuttle.

   Scene function (OD-B05-S02): the weaving apparatus cycling through
   active-cloth / shuttle-in-flight / pause / abandoned-work states. wovenFrac
   drives the fell-line down the frame; shuttleMode places the golden shuttle
   (tucked at the fell / mid-shed with trailing weft / resting on the cloth-beam /
   set down at the base). In abandoned-work the warp goes slack and a loose
   thread dangles from the frayed fell.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  postW:16,             // fine turned post (much thinner than the weighted loom's)
  beamH:22,             // top cloth-beam height
  botBeamH:26,          // bottom warp-beam height
  warpCount:34,         // fine, dense warp threads
  wood:4,               // ink level for the pale fruit-wood frame
  cloth:3,              // ink level for the woven cloth
  gold:2,               // ink level for the bright golden shuttle (light = shiny)
};

/* fixed frame geometry in the 660x880 source (fractions of W/H) */
function frame(W,H){
  const postCX_L = W*0.205, postCX_R = W*0.795;
  const pw = params.postW;
  const topBeamY = H*0.128, beamH = params.beamH;         // top cloth-beam
  const botBeamY = H*0.858, botBeamH = params.botBeamH;   // bottom warp-beam
  const postTop = H*0.070, postBot = H*0.905;             // posts run past both beams
  const warpTop = topBeamY + beamH;                       // fell region begins under the beam
  const warpBottom = botBeamY;                            // warp anchors into the bottom beam
  const wx0 = postCX_L + pw/2 + 9;
  const wx1 = postCX_R - pw/2 - 9;
  return { postCX_L, postCX_R, pw, topBeamY, beamH, botBeamY, botBeamH,
           postTop, postBot, warpTop, warpBottom, wx0, wx1 };
}

/* per-state pose */
const POSE = {
  "active-cloth":  { wovenFrac:0.46, shuttleMode:"tucked", slack:false, status:"WEAVING",   progress:0.46 },
  shuttle:         { wovenFrac:0.52, shuttleMode:"shed",   slack:false, status:"SHUTTLE",   progress:0.55 },
  pause:           { wovenFrac:0.46, shuttleMode:"rest",   slack:false, status:"PAUSED",    progress:0.44 },
  "abandoned-work":{ wovenFrac:0.30, shuttleMode:"down",   slack:true,  status:"ABANDONED", progress:0.18 },
};

/* the GOLDEN SHUTTLE — a slim pointed boat drawn along a local axis and rotated.
   Rendered bright (light tone + bright core) so it reads as precious gold, with a
   crisp black contour and dark metal caps at each point. */
function drawGoldenShuttle(g, pen, cx, cy, hl, hh, angle){
  g.save();
  g.translate(cx, cy); g.rotate(angle);
  // body
  pen.paint(()=>{
    g.moveTo(-hl, 0);
    g.quadraticCurveTo(-hl*0.15, -hh, hl, 0);
    g.quadraticCurveTo(-hl*0.15,  hh, -hl, 0);
    g.closePath();
  }, toneSolid(inkLevel(params.gold)), 4);
  // bright sheen along the golden belly
  g.fillStyle = inkLevel(1);
  g.beginPath(); g.ellipse(-hl*0.05, -hh*0.18, hl*0.55, hh*0.34, 0, 0, 7); g.fill();
  // wound weft bobbin across the middle
  g.fillStyle = inkLevel(5); g.fillRect(-hl*0.42, -3, hl*0.84, 6);
  g.strokeStyle = inkLevel(6); g.lineWidth = 1.4;
  for(let x=-hl*0.36; x<hl*0.4; x+=6){ g.beginPath(); g.moveTo(x,-3); g.lineTo(x,3); g.stroke(); }
  // dark metal tips (the pointed ends)
  g.fillStyle = inkLevel(6);
  g.beginPath(); g.moveTo(-hl,0); g.lineTo(-hl*0.72,-hh*0.28); g.lineTo(-hl*0.72,hh*0.28); g.closePath(); g.fill();
  g.beginPath(); g.moveTo( hl,0); g.lineTo( hl*0.72,-hh*0.28); g.lineTo( hl*0.72,hh*0.28); g.closePath(); g.fill();
  g.restore();
}

function drawLoom(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "active-cloth";
  const P = POSE[mode] || POSE["active-cloth"];
  const F = frame(W,H);
  const wovenFrac = (typeof st.wovenFrac==="number") ? clamp(st.wovenFrac,0,1) : P.wovenFrac;
  const fellY = F.warpTop + (F.warpBottom - F.warpTop)*wovenFrac;
  const webW  = F.wx1 - F.wx0;

  // ============ FINE UPRIGHT POSTS + turned finials ============
  const post = (cx)=>{
    pen.paint(()=>{ g.rect(cx-F.pw/2, F.postTop, F.pw, F.postBot-F.postTop); }, toneSolid(inkLevel(params.wood)), 4);
    // round the turned post: bright left edge, shaded right
    g.fillStyle=inkLevel(1); g.fillRect(cx-F.pw/2+2, F.postTop+5, F.pw*0.20, F.postBot-F.postTop-10);
    g.fillStyle=inkLevel(6); g.fillRect(cx+F.pw*0.16, F.postTop+5, F.pw*0.24, F.postBot-F.postTop-10);
    // turned ring near the top (fine joinery detail)
    pen.paint(()=>{ g.rect(cx-F.pw*0.8, F.topBeamY-14, F.pw*1.6, 9); }, toneSolid(inkLevel(5)), 3);
    // finial knob crowning the post
    pen.paint(()=>{ g.arc(cx, F.postTop, F.pw*0.85, 0, 7); }, toneSolid(inkLevel(5)), 4);
    g.fillStyle=inkLevel(2); g.beginPath(); g.arc(cx-F.pw*0.28, F.postTop-F.pw*0.22, F.pw*0.30, 0, 7); g.fill();
    // splayed foot
    pen.paint(()=>{ g.moveTo(cx-F.pw*1.4, F.postBot); g.lineTo(cx+F.pw*1.4, F.postBot);
                    g.lineTo(cx+F.pw*0.6, F.postBot-F.pw*1.2); g.lineTo(cx-F.pw*0.6, F.postBot-F.pw*1.2);
                    g.closePath(); }, toneSolid(inkLevel(6)), 4);
  };
  post(F.postCX_L); post(F.postCX_R);

  // ============ TOP CLOTH-BEAM (finished cloth winds onto it) ============
  const beamX0 = F.postCX_L - F.pw*0.3, beamX1 = F.postCX_R + F.pw*0.3;
  pen.paint(()=>{ g.rect(beamX0, F.topBeamY, beamX1-beamX0, F.beamH); }, toneSolid(inkLevel(5)), 4);
  pen.paint(()=>{ g.ellipse(beamX0, F.topBeamY+F.beamH/2, F.pw*0.55, F.beamH*0.60, 0,0,7); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.ellipse(beamX1, F.topBeamY+F.beamH/2, F.pw*0.55, F.beamH*0.60, 0,0,7); }, toneSolid(inkLevel(6)), 4);
  g.fillStyle=inkLevel(2); g.fillRect(beamX0+8, F.topBeamY+3, beamX1-beamX0-16, 3); // bright rib along the roller

  // ============ BOTTOM WARP-BEAM (closes the frame — the key differentiator) ============
  pen.paint(()=>{ g.rect(beamX0, F.botBeamY, beamX1-beamX0, F.botBeamH); }, toneSolid(inkLevel(5)), 4);
  pen.paint(()=>{ g.ellipse(beamX0, F.botBeamY+F.botBeamH/2, F.pw*0.55, F.botBeamH*0.55, 0,0,7); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.ellipse(beamX1, F.botBeamY+F.botBeamH/2, F.pw*0.55, F.botBeamH*0.55, 0,0,7); }, toneSolid(inkLevel(6)), 4);
  g.fillStyle=inkLevel(2); g.fillRect(beamX0+8, F.botBeamY+3, beamX1-beamX0-16, 3);

  // ============ WOVEN CLOTH (grows down from the top beam) ============
  if (fellY > F.warpTop+1){
    pen.paint(()=>{ g.rect(F.wx0, F.warpTop, webW, fellY-F.warpTop); }, toneSolid(inkLevel(params.cloth)), 4);
    // fine weft rows — close-set for a fine cloth
    g.strokeStyle=inkLevel(5); g.lineWidth=1.3;
    for(let y=F.warpTop+7; y<fellY-3; y+=8){ g.beginPath(); g.moveTo(F.wx0+2,y); g.lineTo(F.wx1-2,y); g.stroke(); }
    // warp columns crossing the cloth (the woven grid)
    g.strokeStyle=inkLevel(4); g.lineWidth=1.0;
    for(let i=0;i<=params.warpCount;i+=2){ const x=F.wx0+webW*(i/params.warpCount);
      g.beginPath(); g.moveTo(x,F.warpTop+2); g.lineTo(x,fellY-2); g.stroke(); }
    // a woven decorative band midway (Calypso weaves a figured cloth)
    const bandY = F.warpTop + (fellY-F.warpTop)*0.5;
    if (bandY < fellY-10){
      pen.paint(()=>{ g.rect(F.wx0+2, bandY-6, webW-4, 12); }, toneSolid(inkLevel(6)), 3);
      g.fillStyle=inkLevel(1);
      for(let x=F.wx0+10; x<F.wx1-6; x+=18){ g.beginPath(); g.moveTo(x,bandY-4); g.lineTo(x+6,bandY); g.lineTo(x,bandY+4); g.lineTo(x-6,bandY); g.closePath(); g.fill(); }
    }
    // the FELL LINE / beater edge — dark bar where weaving happens (frayed if abandoned)
    if (P.slack){
      g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
      for(let i=0;i<=params.warpCount;i+=2){ const x=F.wx0+webW*(i/params.warpCount);
        g.beginPath(); g.moveTo(x, fellY-3); g.lineTo(x+(i%3-1)*3, fellY+7); g.stroke(); }
    } else {
      pen.paint(()=>{ g.rect(F.wx0-3, fellY-4, webW+6, 10); }, toneSolid(inkLevel(7)), 3);
    }
  }

  // ============ WARP THREADS (fine, taut — or slack when abandoned) ============
  const warpX = (i)=> F.wx0 + webW*(i/(params.warpCount));
  g.lineCap="round";
  for(let i=0;i<=params.warpCount;i++){
    const x = warpX(i);
    g.strokeStyle = INK; g.lineWidth = 1.5;
    g.beginPath();
    if (P.slack && (i%5===2)){
      // a slackened thread bowing loose in the neglected web
      const sway = 12*Math.sin(i*1.3);
      g.moveTo(x, fellY);
      g.bezierCurveTo(x+sway, lerp(fellY,F.warpBottom,0.4),
                      x-sway, lerp(fellY,F.warpBottom,0.7),
                      x, F.warpBottom);
    } else {
      g.moveTo(x, fellY);
      g.lineTo(x, F.warpBottom);
    }
    g.stroke();
  }

  // ============ HEDDLE ROD (holds the shed across the fine warp) ============
  if (!P.slack){
    const ry = fellY + (F.warpBottom-fellY)*0.42;
    if (ry < F.warpBottom-14){
      pen.paint(()=>{ g.rect(F.wx0-F.pw*0.9, ry-5, webW+F.pw*1.8, 11); }, toneSolid(inkLevel(6)), 3);
      g.fillStyle=inkLevel(2); g.fillRect(F.wx0-F.pw*0.8, ry-3, webW+F.pw*1.6, 3);
      // leash loops down to alternate warp threads
      g.strokeStyle=INK; g.lineWidth=1.2;
      for(let i=1;i<params.warpCount;i+=4){ const x=warpX(i);
        g.beginPath(); g.moveTo(x, ry+5); g.lineTo(x, ry+16); g.stroke(); }
    }
  }

  // ============ GOLDEN SHUTTLE — placed per state ============
  const hl = webW*0.19, hh = 15;
  if (P.shuttleMode==="shed"){
    // flying mid-shed at the fell, trailing a weft thread back to the woven edge
    const sy = fellY + 15, cx = F.wx0 + webW*0.46;
    g.strokeStyle=INK; g.lineWidth=1.6; g.beginPath();
    g.moveTo(cx-hl, sy); g.quadraticCurveTo(cx-hl-26, sy-12, F.wx0+6, fellY-1); g.stroke();
    drawGoldenShuttle(g, pen, cx, sy, hl, hh, 0.04);
  } else if (P.shuttleMode==="tucked"){
    // resting on the dark cloth just above the fell — the bright gold pops here
    drawGoldenShuttle(g, pen, F.wx0 + webW*0.60, fellY - 20, hl, hh, 0.07);
  } else if (P.shuttleMode==="rest"){
    // laid across the top cloth-beam while the weaver pauses
    drawGoldenShuttle(g, pen, F.postCX_L + webW*0.32, F.topBeamY + F.beamH*0.5, hl, hh, 0.0);
  } else if (P.shuttleMode==="down"){
    // set down / dropped at the base against the bottom beam
    drawGoldenShuttle(g, pen, F.wx0 + webW*0.30, F.botBeamY - 10, hl, hh, -0.16);
    // a loose length of yarn spilling from the abandoned shuttle
    g.strokeStyle=INK; g.lineWidth=1.5; g.beginPath();
    g.moveTo(F.wx0 + webW*0.30, F.botBeamY - 10);
    g.bezierCurveTo(F.wx0+webW*0.5, F.botBeamY+6, F.wx0+webW*0.62, F.botBeamY-8, F.wx0+webW*0.7, F.botBeamY+2);
    g.stroke();
  }

  // ============ ABANDONED: a thread dangling from the frayed fell ============
  if (P.slack){
    const dx = F.wx1 - webW*0.22;
    g.strokeStyle=INK; g.lineWidth=1.6; g.beginPath();
    g.moveTo(dx, fellY+4);
    g.bezierCurveTo(dx+18, fellY+40, dx-14, fellY+80, dx+6, fellY+118);
    g.stroke();
  }
}

export const asset = {
  id:"prop.calypsos-loom",
  type:"PROP",
  name:"Calypso's Loom",
  statusWord:"WEAVING",
  scene:"OD-B05-S02",

  params,
  // back -> front draw order the module honors
  layers:["posts","finials","top-beam","bottom-beam","cloth","fell","warp","heddle","shuttle","loose-thread"],

  // normalized 0..1 attachment / support / contact anchors
  anchors:{
    "beam:cloth":{x:.50,y:.14},      // top cloth-beam the finished web winds onto
    "web:center":{x:.50,y:.32},      // middle of the woven cloth
    fell:{x:.50,y:.46},              // the weaving edge (moves down as cloth grows)
    "grip:shuttle":{x:.50,y:.50},    // where a hand throws the golden shuttle through the shed
    "rest:shuttle":{x:.42,y:.15},    // the shuttle's resting place on the top beam (pause)
    "heddle:rod":{x:.50,y:.62},      // the heddle rod across the warp
    "beam:warp":{x:.50,y:.86},       // bottom warp-beam (closes the frame)
    "post:left":{x:.205,y:.50},      // left fine upright
    "post:right":{x:.795,y:.50},     // right fine upright
    "contact:floor":{x:.50,y:.905},  // the loom's feet on the ground
  },
  // collision shape: the standing frame's slender footprint (asset space)
  collision:{ kind:"box", x0:.15, y0:.06, x1:.85, y1:.91 },
  ownership:"calypso",               // Calypso weaves at it on Ogygia

  states:{
    initial:"active-cloth",
    nodes:{
      "active-cloth":  { preview:{ mode:"active-cloth",   status:"WEAVING",   progress:0.46 } },
      shuttle:         { preview:{ mode:"shuttle",        status:"SHUTTLE",   progress:0.55 } },
      pause:           { preview:{ mode:"pause",          status:"PAUSED",    progress:0.44 } },
      "abandoned-work":{ preview:{ mode:"abandoned-work", status:"ABANDONED", progress:0.18 } },
    },
    edges:[
      ["active-cloth","shuttle"],["shuttle","active-cloth"],
      ["active-cloth","pause"],["pause","active-cloth"],
      ["pause","shuttle"],["active-cloth","abandoned-work"],
      ["pause","abandoned-work"],
    ],
  },
  channels:["mode","wovenFrac","shuttleMode","t"],

  preview:()=>({ mode:"active-cloth", wovenFrac:0.46, status:"WEAVING", progress:0.46, t:0 }),
  draw(ctx,W,H,state){ drawLoom(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
