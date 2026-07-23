/* prop.leafy-modesty-branch — the large leafy olive branch Odysseus breaks
   off to cover himself before facing Nausicaa (OD-B06-S03).
   PROP asset. A single reusable held object: a stout snapped olive limb with a
   corded/gripped butt, a tapering main stem, three side-shoots, and a DENSE
   canopy of lanceolate olive leaves. Drawn in SOLID grays + hard contour into
   the offscreen ctx; the engine dotify pass supplies the halftone. Do NOT
   pre-dither.

   The whole limb is drawn along a local axis and rotated about the GRIP pivot
   per state, so grip + foliage-cover anchors stay meaningful as it moves:
     grip -> body-cover-alignment -> lower -> discard.
   In the alignment state a faint modesty "cover zone" is drawn behind so the
   leaf mass can be registered against the body it must hide.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const params = {
  length:640,        // limb length in source px (fits 660x880 at any angle)
  stemW:26,          // main-stem thickness at the grip (tapers to the tip)
  gripLen:118,       // gripped butt length
  leafLen:38,        // base lanceolate leaf length
  leafW:12,          // base leaf half-width
  wood:5,            // base ink level for the olive wood
  leafDark:6,        // deep-canopy leaf tone
  leafMid:4,         // mid canopy
  leafLite:2,        // sunlit leaf faces
  seed:60603,        // deterministic foliage seed (scene OD-B06-S03)
};

/* along-axis stations, measured from the GRIP pivot.
   negative = toward the leafy tip (up), positive = toward the cut butt (down). */
function stations(){
  const L = params.length;
  const tipS    = -L*0.62;               // leafy crown tip
  const gripTopS = -params.gripLen*0.30; // where foliage-bearing stem meets grip
  const gripBotS =  params.gripLen*0.70; // butt end (snapped/cut)
  const cutS     =  L*0.30;              // ragged snapped end below the grip
  return { L, tipS, gripTopS, gripBotS, cutS };
}

/* per-state pose: rotation about the grip pivot + scene extras */
const POSE = {
  grip:  { angle:-0.42, oy:0.00, status:"GRIPPED",  progress:0.30 },
  cover: { angle: 0.00, oy:0.06, status:"ALIGNED",  progress:0.55, coverZone:true },
  lower: { angle: 0.62, oy:0.10, status:"LOWERED",  progress:0.80, motion:"drop" },
  discard:{angle: 1.42, oy:0.30, status:"DISCARDED",progress:1.00, ground:true },
};

/* one lanceolate olive leaf in the current (already-rotated) frame */
function drawLeaf(pen,g,x,y,ang,len,wid,tone){
  pen.paint(()=>{
    g.save(); g.translate(x,y); g.rotate(ang);
    g.moveTo(0,-len*0.5);
    g.quadraticCurveTo( wid, 0, 0, len*0.5);
    g.quadraticCurveTo(-wid, 0, 0,-len*0.5);
    g.restore();
  }, toneSolid(inkLevel(tone)), 2);
  // midrib
  g.save(); g.translate(x,y); g.rotate(ang);
  g.strokeStyle=INK; g.lineWidth=1.4; g.globalAlpha=0.5;
  g.beginPath(); g.moveTo(0,-len*0.42); g.lineTo(0,len*0.42); g.stroke();
  g.globalAlpha=1; g.restore();
}

/* a leafy shoot: a slim wood twig from (0,s0) out at `dir`, with paired leaves */
function drawShoot(pen,g,R,s0,dir,seg,tone0){
  const dx=Math.sin(dir), dy=-Math.cos(dir);           // outward+upward
  const ex=dx*seg, ey=s0+dy*seg;
  // twig
  pen.paint(()=>{
    g.moveTo(-3, s0); g.lineTo(3, s0);
    g.lineTo(ex+2.2, ey); g.lineTo(ex-2.2, ey); g.closePath();
  }, toneSolid(inkLevel(params.wood-1)), 3);
  // leaves fanned along the twig
  const n = 5;
  for(let i=1;i<=n;i++){
    const t=i/(n+0.4);
    const px=lerp(0,ex,t), py=lerp(s0,ey,t);
    const jitter=(R()-0.5);
    const side=(i%2)?1:-1;
    const la = dir + side*(1.05+jitter*0.5);
    const ll = params.leafLen*(0.78+R()*0.5);
    const lw = params.leafW*(0.8+R()*0.4);
    const tone = [params.leafDark,tone0,params.leafMid,params.leafLite][i%4];
    drawLeaf(pen,g,px+side*3,py,la,ll,lw,tone);
  }
  // a tip leaf pointing along the twig
  drawLeaf(pen,g,ex,ey,dir,params.leafLen*0.9,params.leafW*0.9,params.leafMid);
}

function drawBranch(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "grip";
  const P = POSE[mode] || POSE.grip;
  const S = stations();
  const R = rnd(params.seed);
  const pivot = { x:W*0.50, y:H*0.50 + H*(P.oy||0) };

  // ---------- scene backing drawn in SCREEN space (not rotated) ----------
  if (P.coverZone){
    // faint modesty "cover zone": the torso region the foliage must register to
    const zx=W*0.50, zy=pivot.y - H*0.02, zw=W*0.20, zh=H*0.42;
    g.save();
    g.strokeStyle=INK; g.globalAlpha=0.30; g.lineWidth=2; g.setLineDash([9,8]);
    g.beginPath(); g.ellipse(zx, zy, zw*0.5, zh*0.5, 0, 0, 7); g.stroke();
    g.restore();
  }
  if (P.ground){
    const gy = H*0.90;
    g.fillStyle = inkLevel(2); g.fillRect(0, gy, W, H-gy);
    pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
    for(let x=W*0.10;x<W;x+=W*0.15){ g.beginPath(); g.moveTo(x,gy); g.lineTo(x-W*0.05,H); g.stroke(); }
    g.globalAlpha=1;
    // soft ground shadow under the dropped limb
    g.fillStyle="rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(W*0.5, gy+6, W*0.34, H*0.02, 0,0,7); g.fill();
  }

  // ---------- everything below is drawn in the ROTATED limb frame ----------
  g.save();
  g.translate(pivot.x, pivot.y);
  g.rotate(P.angle);

  if (P.motion==="drop"){
    g.strokeStyle="rgba(0,0,0,0.20)"; g.lineCap="round"; g.lineWidth=4;
    g.beginPath(); g.arc(0, S.tipS+120, 120, Math.PI*1.15, Math.PI*1.5); g.stroke();
  }

  // ---------- MAIN STEM (tapering olive wood) ----------
  const wTop=params.stemW*0.34, wBot=params.stemW;
  pen.paint(()=>{
    g.moveTo(-wTop/2, S.tipS+40);
    g.lineTo( wTop/2, S.tipS+40);
    g.lineTo( wBot/2, S.cutS);
    g.lineTo(-wBot/2, S.cutS);
    g.closePath();
  }, toneSolid(inkLevel(params.wood)), 5);
  // round the limb: bright left edge, dark right face
  g.save();
  g.beginPath();
  g.moveTo(-wTop/2, S.tipS+40); g.lineTo(wTop/2,S.tipS+40);
  g.lineTo(wBot/2,S.cutS); g.lineTo(-wBot/2,S.cutS); g.closePath(); g.clip();
  g.fillStyle=inkLevel(2); g.fillRect(-wBot/2+2, S.tipS+44, wBot*0.16, S.cutS-S.tipS-48);
  g.fillStyle=inkLevel(7); g.fillRect(wBot/2-wBot*0.22, S.tipS+44, wBot*0.22, S.cutS-S.tipS-48);
  g.restore();
  // bark rings
  g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.4;
  for(let s=S.gripBotS+20; s<S.cutS-10; s+=16){
    g.beginPath(); g.moveTo(-wBot/2, s); g.lineTo(wBot/2, s+3); g.stroke();
  }
  g.globalAlpha=1;
  // ragged snapped butt end
  pen.ink(()=>{
    g.moveTo(-wBot/2, S.cutS); g.lineTo(-wBot*0.2, S.cutS-8);
    g.lineTo(wBot*0.1, S.cutS+6); g.lineTo(wBot/2, S.cutS-3);
  }, 3);

  // ---------- SIDE SHOOTS (behind main canopy) ----------
  drawShoot(pen,g,R, S.tipS+150, -0.85, 120, params.leafMid);   // upper-left
  drawShoot(pen,g,R, S.tipS+230,  0.80, 132, params.leafDark);  // right
  drawShoot(pen,g,R, S.tipS+330, -0.70, 108, params.leafMid);   // lower-left

  // ---------- DENSE MAIN CANOPY along the upper stem ----------
  // back layer (deep tone) then front layer (lighter) for depth, spaced so
  // paper shows between leaves -> the dotify pass reads it as a leaf MASS.
  const canopyTop=S.tipS+6, canopyBot=S.gripTopS-8;
  const layers=[
    { tone:params.leafDark, off:2.0, len:1.05, back:true },
    { tone:params.leafMid,  off:1.4, len:0.95, back:false },
    { tone:params.leafLite, off:0.7, len:0.82, back:false },
  ];
  for(const Ly of layers){
    for(let s=canopyTop; s<canopyBot; s+=16){
      const spread = 34 + (s-canopyTop)*0.16;   // widens toward the tip base
      const pairs = 2;
      for(let k=0;k<pairs;k++){
        const side=(k%2)?1:-1;
        const jx = (R()-0.5)*18;
        const jy = (R()-0.5)*12;
        const ang = side*(0.9 + (R()-0.5)*0.7);
        const len = params.leafLen*Ly.len*(0.8+R()*0.5);
        const wid = params.leafW*(0.8+R()*0.4);
        const x = side*spread*Ly.off + jx;
        drawLeaf(pen,g, x, s+jy, ang, len, wid, Ly.tone);
      }
    }
  }
  // crown cluster at the very tip
  for(let i=0;i<7;i++){
    const a=(i/7)*Math.PI*2;
    const tone=[params.leafDark,params.leafMid,params.leafLite][i%3];
    drawLeaf(pen,g, Math.cos(a)*22, S.tipS+18+Math.sin(a)*22, a+0.4,
             params.leafLen*0.9, params.leafW*0.9, tone);
  }

  // ---------- GRIPPED BUTT (corded hand-hold at the pivot) ----------
  const gTop=S.gripTopS, gBot=S.gripBotS, gW=wBot+8;
  pen.paint(()=>{ g.rect(-gW/2, gTop, gW, gBot-gTop); }, toneSolid(inkLevel(6)), 5);
  g.strokeStyle=INK; g.lineWidth=2.0; g.lineCap="round";
  for(let s=gTop+8; s<gBot-4; s+=9){       // cord cross-wrap
    g.beginPath(); g.moveTo(-gW/2, s); g.lineTo(gW/2, s+6); g.stroke();
  }

  g.restore();
}

export const asset = {
  id:"prop.leafy-modesty-branch",
  type:"PROP",
  name:"Leafy Modesty Branch",
  statusWord:"GRIPPED",
  scene:"OD-B06-S03",

  params,
  // back -> front draw order the module honors
  layers:["ground-or-cover","motion","stem","shoots","canopy-back","canopy-front","crown","grip"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 'grip' pose; the runtime re-derives them under rotation from the pivot).
  anchors:{
    grip:{x:.50,y:.55},            // where the hand takes the limb (the pivot)
    "grip:second":{x:.50,y:.63},   // off-hand / two-handed hold
    tip:{x:.50,y:.11},             // leafy crown tip
    "foliage:center":{x:.50,y:.30},// center of the modesty leaf mass (cover point)
    "cut:butt":{x:.51,y:.72},      // ragged snapped end
    "contact:ground":{x:.50,y:.90},// where the canopy rests when discarded
  },
  // collision shape: an oriented capsule along the stem (asset space)
  collision:{ kind:"capsule", a:{x:.50,y:.11}, b:{x:.51,y:.72}, r:.11 },
  ownership:"odysseus",            // broken from the thicket; carried by Odysseus

  states:{
    initial:"grip",
    nodes:{
      grip:  { preview:{ mode:"grip",   status:"GRIPPED",  progress:0.30 } },
      "body-cover-alignment": { preview:{ mode:"cover", status:"ALIGNED", progress:0.55 } },
      lower: { preview:{ mode:"lower",  status:"LOWERED",  progress:0.80 } },
      discard:{preview:{ mode:"discard",status:"DISCARDED",progress:1.00 } },
    },
    edges:[
      ["grip","body-cover-alignment"],["body-cover-alignment","lower"],
      ["lower","discard"],["body-cover-alignment","grip"],["lower","body-cover-alignment"],
    ],
  },
  channels:["angle","state","sway","t"],

  preview:()=>({ mode:"grip", status:"GRIPPED", progress:0.30, t:0 }),
  draw(ctx,W,H,state){ drawBranch(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
