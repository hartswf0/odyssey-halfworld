/* prop.elpenors-body-and-oar — Elpenor's shrouded corpse + his oar, as ONE
   continuity object. PROP asset. A wrapped, cord-bound body carried from bier
   to pyre to grave, paired with the ship's oar that transfers from a leaning
   ship-tool to the upright grave-marker planted in the barrow. Two reusable
   sub-bodies (SHROUD + OAR) posed together per state so the whole rite reads
   as one object cycling: on-bier / on-pyre / mound-with-oar. Drawn in SOLID
   grays + hard contour into the offscreen ctx; the engine dotify pass supplies
   the halftone. Do NOT pre-dither.

   Scene function (OD-B12-S01): the corpse-continuity object plus the oar
   moving from ship tool to grave sign.
   Atlas: isolated reusable object; scale, grip/support/contact anchors,
   ownership, collision, states. */
import { makePen, toneSolid, inkLevel, INK, clamp } from "/engine/halfworld-engine.mjs";

const params = {
  bodyLen: 430,    // shrouded corpse length along its axis (source px)
  bodyWid: 104,    // corpse width across the shoulders
  cords: 4,        // binding cords across the shroud
  oarLen: 540,     // oar length along its axis
  bladeHalf: 42,   // half-width of the flat paddle blade
  loomHalf: 11,    // half-width of the round loom (shaft)
  gripHalf: 16,    // half-width of the swelled handle grip
  shroud: 3,       // base ink level for the linen shroud
  wood: 4,         // base ink level for the oar wood
};

/* ---------- SHROUDED BODY silhouette (local frame, head toward -y) ---------- */
function bodyPath(g, len, wid){
  const W2 = wid*0.5;
  const yHead=-len*0.50, yCrown=-len*0.43, yNeck=-len*0.35, ySh=-len*0.29,
        yCh=-len*0.08,  yHip=len*0.14,  yKnee=len*0.36, yFoot=len*0.50;
  g.moveTo(0, yHead);
  // right side, head -> feet
  g.quadraticCurveTo( W2*0.56, yHead,  W2*0.56, yCrown);   // rounded head
  g.quadraticCurveTo( W2*0.40, yNeck,  W2*0.32, yNeck);    // neck pinch
  g.quadraticCurveTo( W2*1.02, ySh,    W2*0.98, yCh);      // shoulder swell -> chest
  g.quadraticCurveTo( W2*0.92, yHip,   W2*0.64, yKnee);    // taper to legs
  g.quadraticCurveTo( W2*0.52, yFoot,  0,        yFoot);   // rounded feet
  // left side, feet -> head (mirror)
  g.quadraticCurveTo(-W2*0.52, yFoot, -W2*0.64, yKnee);
  g.quadraticCurveTo(-W2*0.92, yHip,  -W2*0.98, yCh);
  g.quadraticCurveTo(-W2*1.02, ySh,   -W2*0.32, yNeck);
  g.quadraticCurveTo(-W2*0.40, yNeck, -W2*0.56, yCrown);
  g.quadraticCurveTo(-W2*0.56, yHead,  0,        yFoot*0 + yHead);
  g.closePath();
}

function drawBody(g, pen, cx, cy, angle, len, wid){
  const W2 = wid*0.5;
  const ySh=-len*0.29, yNeck=-len*0.35;
  g.save(); g.translate(cx,cy); g.rotate(angle);

  // linen body fill + hard contour
  pen.paint(()=>bodyPath(g,len,wid), toneSolid(inkLevel(params.shroud)), 5);

  // round the wrapped form: bright near edge, dark far edge (clipped to body)
  g.save(); g.beginPath(); bodyPath(g,len,wid); g.clip();
  g.fillStyle=inkLevel(1); g.fillRect(-W2, -len*0.5, W2*0.30, len);      // highlight ridge
  g.fillStyle=inkLevel(5); g.fillRect( W2*0.42, -len*0.5, W2*0.58, len); // shadow flank
  // head is slightly proud (a touch lighter cap)
  g.fillStyle=inkLevel(2);
  g.beginPath(); g.ellipse(0, -len*0.42, W2*0.44, len*0.06, 0, 0, 7); g.fill();
  g.restore();

  // neck cinch line separating the head bundle
  g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
  g.beginPath(); g.moveTo(-W2*0.34, yNeck+2); g.lineTo(W2*0.34, yNeck+2); g.stroke();

  // BINDING CORDS across the shroud (shoulders -> feet)
  const cordN = params.cords;
  for(let i=0;i<cordN;i++){
    const t = (i+0.5)/cordN;                     // 0..1 down the wrapped length
    const y = ySh + (len*0.50 - ySh)*t;
    const hw = W2*(0.98 - 0.55*t);               // narrows toward the feet
    g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="round";
    g.beginPath(); g.moveTo(-hw, y-3); g.quadraticCurveTo(0, y+5, hw, y-3); g.stroke();
    // knot
    g.fillStyle=inkLevel(6); g.beginPath(); g.arc(0, y+1, 4.2, 0, 7); g.fill();
    g.strokeStyle=INK; g.lineWidth=1.6; g.beginPath(); g.arc(0, y+1, 4.2, 0, 7); g.stroke();
  }
  g.restore();
}

/* ---------- OAR silhouette (local frame, blade toward -y) ---------- */
function oarPath(g, S){
  const {HB,HL,HG,bladeS,handleS,throatS,gripS}=S;
  const bMid=bladeS+(throatS-bladeS)*0.42, bLow=throatS-(throatS-bladeS)*0.18;
  g.moveTo(0, bladeS);
  g.quadraticCurveTo( HB*0.9, bMid,  HB*0.72, bLow);
  g.quadraticCurveTo( HL*1.7, throatS, HL, throatS+8);
  g.lineTo( HL, gripS);
  g.quadraticCurveTo( HG, gripS+6, HG, (gripS+handleS)/2);
  g.quadraticCurveTo( HG, handleS, 0, handleS);
  g.quadraticCurveTo(-HG, handleS, -HG, (gripS+handleS)/2);
  g.quadraticCurveTo(-HG, gripS+6, -HL, gripS);
  g.lineTo(-HL, throatS+8);
  g.quadraticCurveTo(-HL*1.7, throatS, -HB*0.72, bLow);
  g.quadraticCurveTo(-HB*0.9, bMid, 0, bladeS);
  g.closePath();
}

function drawOar(g, pen, cx, cy, angle, len){
  const S={
    HB:params.bladeHalf, HL:params.loomHalf, HG:params.gripHalf,
    bladeS:-len*0.55, handleS:len*0.45, throatS:-len*0.55+len*0.26, gripS:len*0.45-len*0.08,
  };
  g.save(); g.translate(cx,cy); g.rotate(angle);
  pen.paint(()=>oarPath(g,S), toneSolid(inkLevel(params.wood)), 5);
  // round the shaft + facet the blade (clipped)
  g.save(); g.beginPath(); oarPath(g,S); g.clip();
  const HB=S.HB, HL=S.HL;
  g.fillStyle=inkLevel(2); g.fillRect(-HL, S.throatS, HL*0.5, S.handleS-S.throatS);
  g.fillStyle=inkLevel(6); g.fillRect( HL*0.3, S.throatS, HL*0.8, S.handleS-S.throatS);
  g.fillStyle=inkLevel(2); g.beginPath();
  g.moveTo(0,S.bladeS); g.lineTo(-HB*0.72,(S.bladeS+S.throatS)*0.5); g.lineTo(-2,S.throatS); g.fill();
  g.fillStyle=inkLevel(6); g.beginPath();
  g.moveTo(0,S.bladeS); g.lineTo( HB*0.72,(S.bladeS+S.throatS)*0.5); g.lineTo( 2,S.throatS); g.fill();
  g.restore();
  // central spine + a couple of ribs
  g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round";
  g.beginPath(); g.moveTo(0,S.bladeS+6); g.lineTo(0,S.throatS); g.stroke();
  g.lineWidth=1.6; g.globalAlpha=0.5;
  for(let i=1;i<=2;i++){ const s=S.bladeS+(S.throatS-S.bladeS)*(0.3*i+0.14), w=HB*(0.5-0.12*i);
    g.beginPath(); g.moveTo(0,s-5); g.quadraticCurveTo( w*0.6,s, w,s+9); g.stroke();
    g.beginPath(); g.moveTo(0,s-5); g.quadraticCurveTo(-w*0.6,s,-w,s+9); g.stroke(); }
  g.globalAlpha=1;
  // handle collar ring
  g.strokeStyle=INK; g.lineWidth=2.2;
  g.beginPath(); g.ellipse(0, S.gripS+6, S.HG*0.9, 5, 0, 0, 7); g.stroke();
  g.restore();
}

/* ---------- screen-space supports ---------- */
function drawBier(g, pen, W, H){
  const topY=H*0.60, x0=W*0.14, x1=W*0.86, slabH=H*0.045, legBot=H*0.90;
  // draped cloth over the platform slab
  pen.paint(()=>{ g.rect(x0, topY, x1-x0, slabH); }, toneSolid(inkLevel(4)), 5);
  g.fillStyle=inkLevel(6); g.fillRect(x0, topY+slabH*0.55, x1-x0, slabH*0.45); // shadow lip
  // hanging drape folds
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
  for(let x=x0+W*0.06; x<x1; x+=W*0.09){ g.beginPath(); g.moveTo(x, topY+slabH); g.lineTo(x, topY+slabH+H*0.05); g.stroke(); }
  g.globalAlpha=1;
  pen.paint(()=>{ g.rect(x0, topY+slabH, x1-x0, H*0.055); }, toneSolid(inkLevel(3)), 4); // drape band
  // four legs
  const legs=[x0+W*0.03, x1-W*0.03, x0+W*0.03, x1-W*0.03];
  pen.paint(()=>{ g.rect(x0+W*0.02, topY+slabH+H*0.055, W*0.045, legBot-(topY+slabH+H*0.055)); }, toneSolid(inkLevel(6)),4);
  pen.paint(()=>{ g.rect(x1-W*0.065, topY+slabH+H*0.055, W*0.045, legBot-(topY+slabH+H*0.055)); }, toneSolid(inkLevel(6)),4);
}

function drawPyre(g, pen, W, H, flames){
  const topY=H*0.62, x0=W*0.14, x1=W*0.86, rowH=H*0.052, rows=4;
  // stacked log courses (alternating cross-piled)
  for(let r=0;r<rows;r++){
    const y=topY - r*rowH;
    const along=(r%2===0);
    if (along){
      // logs running left-right: one long slab with log-end grooves
      pen.paint(()=>{ g.rect(x0, y, x1-x0, rowH*0.92); }, toneSolid(inkLevel(5)), 4);
      g.strokeStyle=inkLevel(2); g.lineWidth=2;
      for(let x=x0+W*0.04; x<x1; x+=W*0.055){ g.beginPath(); g.moveTo(x, y+3); g.lineTo(x, y+rowH*0.92-3); g.stroke(); }
    } else {
      // logs running toward us: a row of round log-ends
      const n=8;
      for(let k=0;k<n;k++){
        const cx=x0+(x1-x0)*((k+0.5)/n);
        pen.paint(()=>{ g.ellipse(cx, y+rowH*0.46, (x1-x0)/n*0.5, rowH*0.46, 0,0,7); }, toneSolid(inkLevel(4)), 3);
        g.fillStyle=inkLevel(6); g.beginPath(); g.arc(cx, y+rowH*0.46, rowH*0.14, 0,7); g.fill();  // core
      }
    }
  }
  // flame tongues licking up between the top logs
  if (flames){
    const baseY=topY-rows*rowH+rowH*0.2;
    for(let i=0;i<9;i++){
      const fx=x0+(x1-x0)*((i+0.5)/9), fh=H*(0.05+0.03*Math.abs(Math.sin(i*1.7)));
      g.fillStyle=inkLevel(i%2?5:4);
      g.beginPath();
      g.moveTo(fx-W*0.02, baseY);
      g.quadraticCurveTo(fx-W*0.012, baseY-fh*0.6, fx, baseY-fh);
      g.quadraticCurveTo(fx+W*0.012, baseY-fh*0.6, fx+W*0.02, baseY);
      g.closePath(); g.fill();
      g.strokeStyle=INK; g.lineWidth=1.6; g.stroke();
    }
  }
}

function drawMound(g, pen, W, H){
  const my=H*0.72;
  pen.paint(()=>{
    g.moveTo(W*0.06, H*0.99);
    g.quadraticCurveTo(W*0.24, my-H*0.02, W*0.50, my-H*0.05);
    g.quadraticCurveTo(W*0.76, my-H*0.02, W*0.94, H*0.99);
    g.closePath();
  }, toneSolid(inkLevel(4)), 5);
  // clods so the barrow reads as heaped earth
  g.fillStyle=inkLevel(5);
  for(let i=0;i<9;i++){ const x=W*(0.14+i*0.083), y=my+H*(0.02+0.03*Math.sin(i*1.9));
    g.beginPath(); g.ellipse(x,y,W*0.045,H*0.02,0,0,7); g.fill(); }
  g.fillStyle=inkLevel(2);
  for(let i=0;i<6;i++){ const x=W*(0.22+i*0.10), y=my+H*(0.06+0.03*Math.cos(i*2.1));
    g.beginPath(); g.ellipse(x,y,W*0.028,H*0.013,0,0,7); g.fill(); }
  // stone kerb at the foot
  g.strokeStyle=INK; g.lineWidth=2.4; g.globalAlpha=0.6;
  g.beginPath(); g.moveTo(W*0.14, H*0.955); g.quadraticCurveTo(W*0.5, H*0.90, W*0.86, H*0.955); g.stroke();
  g.globalAlpha=1;
}

/* ---------- per-state composition ---------- */
const POSE = {
  "on-bier":        { status:"ON-BIER",   progress:0.20 },
  "on-pyre":        { status:"ON-PYRE",   progress:0.55 },
  "mound-with-oar": { status:"MOUND+OAR", progress:1.00 },
};

function draw(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "on-bier";

  if (mode === "on-bier"){
    drawBier(g, pen, W, H);
    // the corpse laid horizontal on the bier (head to the left)
    drawBody(g, pen, W*0.50, H*0.505, -Math.PI/2, params.bodyLen, params.bodyWid);
    // the oar still a SHIP-TOOL: leaning upright against the bier at the foot
    drawOar(g, pen, W*0.80, H*0.55, -0.42, params.oarLen*0.92);
  }
  else if (mode === "on-pyre"){
    drawPyre(g, pen, W, H, true);
    // corpse laid on top of the built pyre
    drawBody(g, pen, W*0.50, H*0.44, -Math.PI/2, params.bodyLen, params.bodyWid);
    // the oar laid ALONGSIDE the body on the pyre (being given over with him)
    drawOar(g, pen, W*0.50, H*0.545, -Math.PI/2 + 0.06, params.oarLen*0.9);
  }
  else { // mound-with-oar
    drawMound(g, pen, W, H);
    // the oar now the UPRIGHT GRAVE-SIGN, handle driven into the barrow head
    drawOar(g, pen, W*0.265, H*0.52, 0.02, params.oarLen);
    // the shrouded body laid to rest along the crest of the mound
    drawBody(g, pen, W*0.56, H*0.635, -Math.PI/2 - 0.05, params.bodyLen*0.86, params.bodyWid*0.92);
  }
}

export const asset = {
  id:"prop.elpenors-body-and-oar",
  type:"PROP",
  name:"Elpenor's Body and Oar",
  statusWord:"ON-BIER",
  scene:"OD-B12-S01",

  params,
  // back -> front draw order the module honors
  layers:["support","oar-behind","shroud","cords","oar-front","flames"],

  // normalized 0..1 attachment / support / contact anchors (neutral on-bier pose)
  anchors:{
    "body:head":{x:.20,y:.50},        // the wrapped head bundle (left end on the bier)
    "body:center":{x:.50,y:.505},     // torso / lift-here grip
    "body:feet":{x:.80,y:.51},        // foot end
    "carry:left":{x:.30,y:.55},       // bearer hand-holds when carried
    "carry:right":{x:.70,y:.55},
    "oar:blade":{x:.80,y:.30},         // paddle end (up when planted)
    "oar:handle":{x:.80,y:.80},        // handle end (driven into the mound)
    "contact:bier":{x:.50,y:.60},      // rests on the bier slab
    "contact:mound":{x:.265,y:.80},    // where the oar enters the barrow
  },
  // collision shape: the lying body's footprint box (asset space)
  collision:{ kind:"box", x0:.14, y0:.42, x1:.86, y1:.60 },
  ownership:"elpenor",                 // Elpenor's body, borne by Odysseus's crew

  states:{
    initial:"on-bier",
    nodes:{
      "on-bier":        { preview:{ mode:"on-bier",        status:"ON-BIER",   progress:0.20 } },
      "on-pyre":        { preview:{ mode:"on-pyre",        status:"ON-PYRE",   progress:0.55 } },
      "mound-with-oar": { preview:{ mode:"mound-with-oar", status:"MOUND+OAR", progress:1.00 } },
    },
    edges:[
      ["on-bier","on-pyre"],
      ["on-pyre","mound-with-oar"],
      ["on-bier","mound-with-oar"],
    ],
  },
  channels:["mode","t"],

  preview:()=>({ mode:"on-bier", status:"ON-BIER", progress:0.20, t:0 }),
  draw(ctx,W,H,state){ draw(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
