/* prop.palace-weapons — the arms of the great hall of Ithaca.
   PROP asset. The helmets, bossed shields, ash spears, bell corselet and
   greaves that hang on the hall's weapon beam — the arms Odysseus and
   Telemachus carry out by lamplight in Book XVI/XIX, lock in the storeroom,
   and that Melanthius fetches back down in Book XXII. One reusable object
   with the whole crisis in its state machine:

     displayed  — racked on the hall beam, the armed hall the suitors trust
     bundled    — gathered into one armful and carried out (the theft)
     removed    — the bare beam: pegs, straps, soot ghosts, no arms
     hidden     — heaped under a tied cloth in the locked storeroom
     retrieved  — the cloth thrown back, arms coming up out of the heap
     contested  — arms mid-seizure: spears crossed, shield tipping, helmet rolling

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B16-S04. */
import { makePen, toneSolid, inkLevel, INK } from "../../engine/halfworld-engine.mjs";

const params = {
  shields:2, helmets:2, spears:6, corselet:true, greaves:2,
  bronze:6, blade:5, wood:3, leather:4, cloth:3,
  shieldR:0.132,   // shield radius, fraction of W
  helmetS:0.100,   // helmet unit, fraction of H
  beamY:0.245,     // weapon-beam top, fraction of H
  beamH:0.042,     // beam depth, fraction of H
};

/* ---------------- components (all in absolute px on the offscreen ctx) --------------- */

/* Corinthian helmet: dome + joined cheek plates with the face notch cut out,
   nasal bar, eye slots, horsehair crest. s = helmet unit (dome ~ .9s wide). */
function helmet(pen, g, cx, cy, s, { crest=true, tilt=0 }={}){
  g.save(); g.translate(cx, cy); g.rotate(tilt);
  if (crest){
    pen.paint(()=>{
      g.moveTo(-s*.44,-s*.26);
      g.quadraticCurveTo(-s*.16,-s*1.06, s*.26,-s*.94);
      g.quadraticCurveTo(s*.50,-s*.86, s*.46,-s*.18);
      g.quadraticCurveTo(s*.24,-s*.62, -s*.04,-s*.56);
      g.quadraticCurveTo(-s*.26,-s*.50,-s*.44,-s*.26);
      g.closePath();
    }, toneSolid(inkLevel(3)), 4);
    g.strokeStyle=INK; g.lineWidth=Math.max(1.6,s*.035); g.lineCap="round";
    for(let i=0;i<4;i++){ const u=i/3;
      g.beginPath();
      g.moveTo(-s*.34+u*s*.62, -s*.36-u*s*.16);
      g.lineTo(-s*.20+u*s*.58, -s*.80-u*s*.06);
      g.stroke(); }
  }
  // bronze body
  pen.paint(()=>{
    g.moveTo(-s*.46, s*.04);
    g.bezierCurveTo(-s*.48,-s*.66, s*.48,-s*.66, s*.46, s*.04);
    g.lineTo(s*.43, s*.40);
    g.quadraticCurveTo(s*.37, s*.82, s*.17, s*.80);
    g.lineTo(s*.10, s*.34);
    g.lineTo(-s*.10, s*.34);
    g.lineTo(-s*.17, s*.80);
    g.quadraticCurveTo(-s*.37, s*.82,-s*.43, s*.40);
    g.closePath();
  }, toneSolid(inkLevel(params.blade)), 5);
  // brow band
  pen.seam(()=>{ g.moveTo(-s*.44, s*.02); g.lineTo(s*.44, s*.02); }, 3);
  // eye slots cut through the bronze
  for(const es of [-1,1]) pen.paint(()=>{
    g.ellipse(es*s*.24, s*.17, s*.15, s*.075, 0, 0, 7);
  }, toneSolid(inkLevel(0)), 3);
  // nasal bar down the face notch
  pen.paint(()=>{ g.rect(-s*.055, s*.30, s*.11, s*.44); }, toneSolid(inkLevel(params.bronze)), 3);
  g.restore();
}

/* Bossed round shield: rim / field / inner ring / boss / rivets. */
function shield(pen, g, cx, cy, r){
  pen.paint(()=>{ g.arc(cx, cy, r, 0, 7); }, toneSolid(inkLevel(params.leather)), 5);
  pen.paint(()=>{ g.arc(cx, cy, r*.80, 0, 7); }, toneSolid(inkLevel(2)), 4);
  pen.ink(()=>{ g.arc(cx, cy, r*.56, 0, 7); }, 3);
  pen.paint(()=>{ g.arc(cx, cy, r*.24, 0, 7); }, toneSolid(inkLevel(params.bronze)), 4);
  pen.paint(()=>{ g.arc(cx, cy, r*.09, 0, 7); }, toneSolid(inkLevel(1)), 2);
  g.fillStyle = INK;
  for(let i=0;i<12;i++){ const a=i/12*Math.PI*2;
    g.beginPath(); g.arc(cx+Math.cos(a)*r*.90, cy+Math.sin(a)*r*.90, r*.045, 0, 7); g.fill(); }
}

/* Shield seen edge-on / tipping — a foreshortened ellipse with a rim band. */
function shieldEdge(pen, g, cx, cy, r, tilt, squash=0.30){
  g.save(); g.translate(cx, cy); g.rotate(tilt);
  pen.paint(()=>{ g.ellipse(0, 0, r, r*squash, 0, 0, 7); }, toneSolid(inkLevel(params.leather)), 5);
  pen.paint(()=>{ g.ellipse(0, -r*squash*.30, r*.78, r*squash*.62, 0, 0, 7); }, toneSolid(inkLevel(2)), 3);
  pen.paint(()=>{ g.ellipse(0, -r*squash*.30, r*.20, r*squash*.20, 0, 0, 7); }, toneSolid(inkLevel(params.bronze)), 3);
  g.restore();
}

/* Ash spear drawn from its butt at (x,y) along -y, rotated by ang. */
function spear(pen, g, x, y, ang, len, w){
  g.save(); g.translate(x, y); g.rotate(ang);
  const headLen = len*.15, hw = w*1.7, shaftTop = -(len-headLen);
  pen.paint(()=>{ g.rect(-w/2, shaftTop, w, len-headLen); }, toneSolid(inkLevel(params.wood)), 4);
  g.fillStyle = inkLevel(5); g.fillRect(w*.5-w*.30, shaftTop+3, w*.30, len-headLen-6);
  g.fillStyle = inkLevel(1); g.fillRect(-w*.5+2,   shaftTop+3, w*.18, len-headLen-6);
  pen.paint(()=>{
    g.moveTo(0, -len);
    g.quadraticCurveTo( hw, -len+headLen*.55,  w*.55, shaftTop);
    g.lineTo(-w*.55, shaftTop);
    g.quadraticCurveTo(-hw, -len+headLen*.55, 0, -len);
  }, toneSolid(inkLevel(params.blade)), 4);
  pen.ink(()=>{ g.moveTo(0, -len+w*.9); g.lineTo(0, shaftTop-2); }, 2.4);
  pen.paint(()=>{ g.rect(-w*.82, shaftTop-1, w*1.64, w*.9); }, toneSolid(inkLevel(params.bronze)), 3);
  pen.paint(()=>{ g.rect(-w*.72, -w*1.7, w*1.44, w*1.7); }, toneSolid(inkLevel(params.bronze)), 3);
  g.restore();
}

/* Bell corselet — bronze cuirass, hung or heaped. */
function corselet(pen, g, cx, cy, h, tilt=0){
  const w = h*.66;
  g.save(); g.translate(cx, cy); g.rotate(tilt);
  pen.paint(()=>{
    g.moveTo(-w*.46,-h*.40);
    g.lineTo(-w*.19,-h*.50); g.lineTo( w*.19,-h*.50); g.lineTo( w*.46,-h*.40);
    g.quadraticCurveTo(w*.40,-h*.04, w*.29, h*.22);
    g.quadraticCurveTo(w*.54, h*.40, w*.52, h*.50);
    g.lineTo(-w*.52, h*.50);
    g.quadraticCurveTo(-w*.54, h*.40,-w*.29, h*.22);
    g.quadraticCurveTo(-w*.40,-h*.04,-w*.46,-h*.40);
    g.closePath();
  }, toneSolid(inkLevel(params.leather)), 5);
  // neck opening
  pen.paint(()=>{ g.ellipse(0,-h*.46, w*.17, h*.05, 0, 0, 7); }, toneSolid(inkLevel(0)), 3);
  // pectorals + waist muscling, all seam ink
  pen.seam(()=>{ g.moveTo(0,-h*.40); g.lineTo(0, h*.20); }, 3);
  pen.seam(()=>{ g.moveTo(-w*.40,-h*.20); g.quadraticCurveTo(-w*.18,-h*.02, 0,-h*.10);
                 g.moveTo( w*.40,-h*.20); g.quadraticCurveTo( w*.18,-h*.02, 0,-h*.10); }, 3);
  pen.seam(()=>{ g.moveTo(-w*.30, h*.22); g.lineTo(w*.30, h*.22); }, 3);
  g.restore();
}

/* Greave — a bronze shin plate. */
function greave(pen, g, cx, cy, h, tilt=0){
  const w = h*.40;
  g.save(); g.translate(cx, cy); g.rotate(tilt);
  pen.paint(()=>{
    g.moveTo(-w*.50,-h*.46);
    g.quadraticCurveTo(0,-h*.60, w*.50,-h*.46);
    g.quadraticCurveTo(w*.38, h*.10, w*.26, h*.50);
    g.lineTo(-w*.26, h*.50);
    g.quadraticCurveTo(-w*.38, h*.10,-w*.50,-h*.46);
    g.closePath();
  }, toneSolid(inkLevel(params.blade)), 4);
  pen.seam(()=>{ g.moveTo(0,-h*.40); g.lineTo(0, h*.44); }, 2.6);
  g.restore();
}

/* The hall's weapon beam: a squared oak baulk with pegs and hanging straps.
   pegs: [{ x, to }] — x as a fraction of W, `to` the strap's end as a
   fraction of H (the top of whatever hangs from it), or null for a bare peg. */
function beam(pen, g, W, H, { pegs=[] }={}){
  const y = H*params.beamY, hgt = H*params.beamH, x0 = W*.05, x1 = W*.95;
  pen.paint(()=>{ g.rect(x0, y, x1-x0, hgt); }, toneSolid(inkLevel(params.wood)), 5);
  g.fillStyle = inkLevel(5); g.fillRect(x0+4, y+hgt*.66, x1-x0-8, hgt*.26);
  g.strokeStyle = INK; g.lineWidth = 1.8; g.globalAlpha = .5;
  for(let i=1;i<7;i++){ const gx = x0+(x1-x0)*i/7;
    g.beginPath(); g.moveTo(gx, y+hgt*.20); g.lineTo(gx+hgt*.5, y+hgt*.52); g.stroke(); }
  g.globalAlpha = 1;
  for(const p of pegs){
    const px = W*p.x, pegBot = y+hgt+H*.030;
    pen.paint(()=>{ g.rect(px-W*.012, y+hgt, W*.024, H*.036); }, toneSolid(inkLevel(params.bronze)), 4);
    const end = p.to==null ? pegBot+H*.055 : H*p.to;
    g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap="round";
    g.beginPath();
    g.moveTo(px-W*.010, pegBot); g.lineTo(px-W*.016, end);
    g.moveTo(px+W*.010, pegBot); g.lineTo(px+W*.016, end); g.stroke();
  }
  return { y, hgt };
}

/* A cord binding across a bundle. */
function cord(pen, g, cx, cy, ang, halfW, halfH){
  g.save(); g.translate(cx, cy); g.rotate(ang);
  pen.paint(()=>{ g.rect(-halfW, -halfH, halfW*2, halfH*2); }, toneSolid(inkLevel(params.cloth)), 4);
  g.strokeStyle = INK; g.lineWidth = 2.0;
  for(let s=-halfW+8; s<halfW-2; s+=16){
    g.beginPath(); g.moveTo(s, -halfH); g.lineTo(s+7, halfH); g.stroke(); }
  g.restore();
}

/* Motion streaks — the atlas' one dynamic cue (see prop.athenas-bronze-spear). */
function streaks(g, x, y, ang, n=3, len=70, gap=13){
  g.save(); g.translate(x,y); g.rotate(ang);
  g.strokeStyle = "rgba(0,0,0,0.26)"; g.lineCap = "round";
  for(let i=0;i<n;i++){ g.lineWidth = 6-i*1.4;
    g.beginPath(); g.moveTo(i*gap, 0); g.lineTo(i*gap, len - i*len*.18); g.stroke(); }
  g.restore();
}

/* ---------------- the state renderers ---------------- */

function drawDisplayed(pen, g, W, H){
  const R = W*params.shieldR, S = H*params.helmetS;
  const shieldY = .530, shieldTop = shieldY - R/H;
  // spears standing at both jambs, behind everything
  for (const [x, a] of [[.085,-.045],[.150,-.018],[.850,.018],[.915,.045]])
    spear(pen, g, W*x, H*.935, a, H*.86, W*.021);
  // the beam, its pegs, and the straps the arms hang on
  const B = beam(pen, g, W, H, { pegs:[
    { x:.265, to:shieldTop }, { x:.50, to:.350 }, { x:.735, to:shieldTop } ] });
  // shields hang from the outer pegs
  shield(pen, g, W*.265, H*shieldY, R);
  shield(pen, g, W*.735, H*shieldY, R);
  // corselet hangs between them, in front
  corselet(pen, g, W*.50, H*.492, H*.285);
  // greaves below the corselet
  greave(pen, g, W*.437, H*.760, H*.150);
  greave(pen, g, W*.563, H*.760, H*.150);
  // helmets stand on the beam, over their own shields
  helmet(pen, g, W*.265, B.y - S*.76, S);
  helmet(pen, g, W*.735, B.y - S*.76, S);
  // floor line the spear butts stand on
  pen.ink(()=>{ g.moveTo(W*.05, H*.940); g.lineTo(W*.95, H*.940); }, 4);
}

function drawRemoved(pen, g, W, H){
  const R = W*params.shieldR, S = H*params.helmetS;
  const B = beam(pen, g, W, H, { pegs:[{x:.265,to:null},{x:.50,to:null},{x:.735,to:null}] });
  // soot ghosts: the outline of what hung here, printed on the plaster
  g.save(); g.setLineDash([9,9]);
  const ghost = (fn)=>{ pen.ink(fn, 2.6); };
  ghost(()=>{ g.arc(W*.265, H*.530, R, 0, 7); });
  ghost(()=>{ g.arc(W*.735, H*.530, R, 0, 7); });
  ghost(()=>{ g.moveTo(W*.50-H*.094, H*.492-H*.143); g.lineTo(W*.50+H*.094, H*.492-H*.143);
              g.lineTo(W*.50+H*.098, H*.492+H*.143); g.lineTo(W*.50-H*.098, H*.492+H*.143); g.closePath(); });
  ghost(()=>{ g.ellipse(W*.265, B.y - S*.62, S*.50, S*.66, 0, 0, 7); });
  ghost(()=>{ g.ellipse(W*.735, B.y - S*.62, S*.50, S*.66, 0, 0, 7); });
  for (const x of [.085,.150,.850,.915])
    ghost(()=>{ g.rect(W*x-W*.011, H*.155, W*.022, H*.46); });
  g.setLineDash([]); g.restore();
  // drag marks on the floor, out toward the storeroom door
  pen.ink(()=>{ g.moveTo(W*.05, H*.940); g.lineTo(W*.95, H*.940); }, 4);
  g.strokeStyle = "rgba(0,0,0,0.30)"; g.lineWidth = 3.2; g.lineCap="round";
  for(let i=0;i<4;i++){ g.beginPath();
    g.moveTo(W*(.24+i*.03), H*(.955+i*.006)); g.lineTo(W*(.62+i*.03), H*(.966+i*.006)); g.stroke(); }
}

function drawBundled(pen, g, W, H){
  const R = W*params.shieldR, S = H*params.helmetS, ang = 0.70;
  const dir = { x:Math.sin(ang), y:-Math.cos(ang) };          // along the shafts
  const per = { x:Math.cos(ang), y: Math.sin(ang) };          // across them
  const bx = W*.185, by = H*.855, LEN = H*.79, step = W*.026;
  const at = (i,u)=>({ x: bx+per.x*step*i + dir.x*LEN*u,
                       y: by+per.y*step*i + dir.y*LEN*u });
  // drag cue trailing behind the armful
  streaks(g, bx-W*.02, by-H*.02, ang, 3, W*.15, 13);
  // four spears carried as one bundle
  for(let i=0;i<4;i++){ const b = at(i,0); spear(pen, g, b.x, b.y, ang, LEN, W*.020); }
  // second shield behind, first shield face-on in the crook of the arm
  shield(pen, g, W*.215, H*.545, R*.92);
  shield(pen, g, W*.330, H*.640, R*1.00);
  // corselet hugged against the shafts; helmet hooked over them higher up
  corselet(pen, g, W*.580, H*.655, H*.215, 0.24);
  const hp = at(4.6,.66); helmet(pen, g, hp.x, hp.y, S*.95, { tilt:0.34 });
  // cord bindings across the bundle
  const c1 = at(1.5,.30), c2 = at(1.5,.80);
  cord(pen, g, c1.x, c1.y, ang, W*.075, H*.016);
  cord(pen, g, c2.x, c2.y, ang, W*.055, H*.014);
}

function drawHidden(pen, g, W, H){
  const R = W*params.shieldR, S = H*params.helmetS;
  // the heap itself, laid in before the cloth goes over it
  spear(pen, g, W*.360, H*.865, -0.50, H*.44, W*.019);
  spear(pen, g, W*.410, H*.875, -0.40, H*.50, W*.019);
  spear(pen, g, W*.455, H*.880, -0.28, H*.48, W*.019);
  shield(pen, g, W*.775, H*.640, R*.94);
  helmet(pen, g, W*.590, H*.535, S*.92);
  // the cloth thrown over it — a low, wide mound, not a tent
  pen.paint(()=>{
    g.moveTo(W*.145, H*.900);
    g.quadraticCurveTo(W*.155, H*.640, W*.330, H*.565);
    g.quadraticCurveTo(W*.510, H*.500, W*.690, H*.570);
    g.quadraticCurveTo(W*.860, H*.638, W*.865, H*.900);
    g.closePath();
  }, toneSolid(inkLevel(params.cloth)), 5);
  // folds falling off the heap
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap="round";
  for (const u of [.16,.36,.56,.78]){
    g.beginPath();
    g.moveTo(W*(.19+u*.62), H*.900);
    g.quadraticCurveTo(W*(.20+u*.61), H*(.75-Math.sin(u*3.14)*.02), W*(.26+u*.50), H*(.552+Math.sin(u*3.14)*.03));
    g.stroke();
  }
  // shapes bulging under the cloth
  g.strokeStyle = "rgba(0,0,0,0.34)"; g.lineWidth = 3;
  g.beginPath(); g.arc(W*.335, H*.820, R*.70, Math.PI*1.08, Math.PI*1.92); g.stroke();
  g.beginPath(); g.arc(W*.570, H*.840, R*.56, Math.PI*1.08, Math.PI*1.92); g.stroke();
  // cord tied over the heap + the knot the storeroom key hangs from
  cord(pen, g, W*.505, H*.775, 0, W*.290, H*.015);
  pen.paint(()=>{ g.arc(W*.505, H*.775, W*.028, 0, 7); }, toneSolid(inkLevel(params.leather)), 4);
  pen.ink(()=>{ g.moveTo(W*.505, H*.803); g.lineTo(W*.478, H*.862);
                g.moveTo(W*.505, H*.803); g.lineTo(W*.536, H*.858); }, 3.4);
  pen.ink(()=>{ g.moveTo(W*.10, H*.900); g.lineTo(W*.90, H*.900); }, 4);
}

function drawRetrieved(pen, g, W, H){
  const R = W*params.shieldR, S = H*params.helmetS;
  // arms coming up out of the opened heap
  spear(pen, g, W*.430, H*.860,  0.36, H*.60, W*.020);
  spear(pen, g, W*.480, H*.870,  0.22, H*.58, W*.020);
  shield(pen, g, W*.205, H*.685, R*1.00);          // leaned against the heap
  corselet(pen, g, W*.505, H*.660, H*.245, 0.10);  // lifted clear
  helmet(pen, g, W*.760, H*.700, S*1.00, { tilt:0.10 });
  // the cloth thrown back, crumpled at the base
  pen.paint(()=>{
    g.moveTo(W*.070, H*.905);
    g.quadraticCurveTo(W*.150, H*.735, W*.330, H*.795);
    g.quadraticCurveTo(W*.520, H*.860, W*.700, H*.775);
    g.quadraticCurveTo(W*.870, H*.700, W*.930, H*.905);
    g.closePath();
  }, toneSolid(inkLevel(params.cloth)), 5);
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap="round";
  for (const u of [.22,.44,.66,.86]){
    g.beginPath(); g.moveTo(W*(.10+u*.80), H*.905);
    g.quadraticCurveTo(W*(.12+u*.78), H*.855, W*(.16+u*.72), H*(.800+Math.sin(u*3.1)*.03));
    g.stroke();
  }
  pen.ink(()=>{ g.moveTo(W*.05, H*.905); g.lineTo(W*.95, H*.905); }, 4);
}

function drawContested(pen, g, W, H){
  const R = W*params.shieldR, S = H*params.helmetS;
  // two spears seized from opposite ends, crossed
  streaks(g, W*.105, H*.735, -0.62, 3, W*.15, 13);
  streaks(g, W*.895, H*.715,  Math.PI+0.62, 3, W*.15, 13);
  spear(pen, g, W*.140, H*.775,  0.88, H*.70, W*.021);
  spear(pen, g, W*.860, H*.755, -0.88, H*.70, W*.021);
  // corselet wrenched off the peg, upper left
  corselet(pen, g, W*.215, H*.285, H*.200, -0.40);
  // shield tipping onto its rim, lower left
  shieldEdge(pen, g, W*.315, H*.865, R*1.10, 0.22, .48);
  // helmet knocked loose and rolling, lower right
  g.strokeStyle="rgba(0,0,0,0.28)"; g.lineWidth=4;
  g.beginPath(); g.arc(W*.630, H*.885, W*.16, Math.PI*1.12, Math.PI*1.88); g.stroke();
  helmet(pen, g, W*.755, H*.840, S*.92, { tilt:0.16 });
  // grab-marks: short hard ink ticks where hands close on the shafts
  g.strokeStyle=INK; g.lineWidth=5; g.lineCap="round";
  for (const [x,y,a] of [[.290,.590,0.88],[.710,.580,-0.88]]){
    g.save(); g.translate(W*x, H*y); g.rotate(a);
    for(let i=-1;i<=1;i+=2){ g.beginPath(); g.moveTo(i*W*.030, -H*.020); g.lineTo(i*W*.030, H*.020); g.stroke(); }
    g.restore();
  }
  pen.ink(()=>{ g.moveTo(W*.05, H*.940); g.lineTo(W*.95, H*.940); }, 4);
}

const MODES = {
  displayed: drawDisplayed, bundled: drawBundled, removed: drawRemoved,
  hidden: drawHidden, retrieved: drawRetrieved, contested: drawContested,
};

function draw(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  (MODES[st.mode] || drawDisplayed)(pen, ctx, W, H);
}

export const asset = {
  id:"prop.palace-weapons",
  type:"PROP",
  name:"Palace Weapons",
  statusWord:"RACKED",
  scene:"OD-B16-S04",

  params,
  // back -> front draw order the module honors
  layers:["motion","spears","beam","pegs","straps","shields","corselet","greaves",
          "helmets","cloth","cords","floor"],

  // normalized 0..1 attachment / contact anchors, measured in the DISPLAYED state
  anchors:{
    "mount:beam":{x:.50,y:.25},            // where the rack meets the wall
    "peg:left":{x:.29,y:.29}, "peg:centre":{x:.50,y:.29}, "peg:right":{x:.71,y:.29},
    "grip:spear":{x:.15,y:.62},            // a hand closing on a shaft
    "grip:shield":{x:.29,y:.51},           // the porpax / arm-band of the left shield
    "grip:helmet":{x:.30,y:.17},           // lifted off the beam by the crest
    carry:{x:.43,y:.60},                   // the armful's balance point when bundled
    "contact:floor":{x:.50,y:.94},         // spear butts / heap base
    "contact:wall":{x:.05,y:.26},
  },
  // collision shape: the whole rack's footprint against the hall wall
  collision:{ kind:"box", a:{x:.06,y:.13}, b:{x:.94,y:.94} },
  ownership:"house-of-odysseus",           // hall arms; Melanthius knows the storeroom

  states:{
    initial:"displayed",
    nodes:{
      displayed:{ preview:{ mode:"displayed", status:"RACKED",    progress:0.10 } },
      bundled:  { preview:{ mode:"bundled",   status:"CARRIED",   progress:0.42 } },
      removed:  { preview:{ mode:"removed",   status:"STRIPPED",  progress:0.58 } },
      hidden:   { preview:{ mode:"hidden",    status:"LOCKED",    progress:0.70 } },
      retrieved:{ preview:{ mode:"retrieved", status:"FETCHED",   progress:0.86 } },
      contested:{ preview:{ mode:"contested", status:"CONTESTED", progress:1.00 } },
    },
    edges:[
      ["displayed","bundled"],["bundled","removed"],["removed","hidden"],
      ["hidden","retrieved"],["retrieved","contested"],["contested","hidden"],
      ["bundled","hidden"],["hidden","displayed"],["retrieved","displayed"],
    ],
  },
  channels:["mode","state","t","progress"],

  // CARD SIGNATURE — RACKED: the armed hall the suitors count on. Helmets on the
  // beam, two bossed shields and the corselet hanging, spears at both jambs.
  // Everything after this is the same arms in worse company.
  preview:()=>({ mode:"displayed", status:"RACKED", progress:0.10, t:0 }),

  draw(ctx, W, H, state){
    draw(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
