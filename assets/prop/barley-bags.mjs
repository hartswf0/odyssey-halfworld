/* prop.barley-bags — twenty-measure grain provisions: a grouped set of tied
   burlap grain sacks, drawn from ONE sack template that is scaled and placed
   into a formation. PROP asset for the departure-provisioning beat. Drawn in
   SOLID grays + hard contour into the offscreen ctx; the engine dotify pass
   supplies the halftone. Do NOT pre-dither.
   Scene function (OD-B02-S06): reusable provisions object with four states —
   FILL (a sack stands open at the neck, grain streaming in from above),
   TIE (all sacks cinched at the neck with a knotted cord), CARRY (one sack
   lifted + tilted, gripped at the cinch), SHIP-STOW (sacks packed into a
   compact pyramid in the hold, against hull ribs).
   The sack template exposes tie/open/tilt/tone knobs so the same body draws
   every member. Fill / tie / carry / ship-stow contact anchors in 0..1 space;
   ownership + a collision box declared for placement + pathing. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  measures:20,        // twenty-measure provisions (count the set represents)
  members:4,          // sacks drawn in the neutral grouped formation
  weave:2,            // horizontal burlap weave seams per sack body
  cord:true,          // knotted cinch cord at each tied neck
};

const BURLAP  = 3;    // sack body (light burlap)
const BURLAP2 = 4;    // shaded flank of a sack (for depth in a group)
const CINCH   = 6;    // cinch band / knot (dark cord)
const MOUTH   = 6;    // open-sack interior (dark hollow)
const GRAIN   = 2;    // heaped / streaming grain (very light)

/* rounded-rect sub-path (no fill/stroke; caller wraps in pen.paint) */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}

/* ------------------------------------------------------------------
   THE SACK TEMPLATE — one plump burlap bag drawn in a LOCAL frame with the
   base centre at (cx, baseY) and up = -y. Every member of the group is this
   same body under a scale + a few knobs.
     open  0 = cinched neck .. 1 = flared open mouth (being filled)
     tilt  body lean (rad) for the carried sack
     tone  body ink level (BURLAP light .. BURLAP2 shaded flank)
   ------------------------------------------------------------------ */
function drawSack(pen,g,cx,baseY,w,h,{open=0,tilt=0,tone=BURLAP}={}){
  const baseHalf=w*0.44, bulgeHalf=w*0.60, neckHalf=w*0.26;
  const yBulge=-h*0.38, yNeck=-h*0.68, yTop=-h*0.96;

  g.save(); g.translate(cx,baseY); g.rotate(tilt);

  // ---- BODY (plump bag: bulging flanks pinched to a narrow neck) ----
  pen.paint(()=>{
    g.moveTo(-baseHalf, 0);
    g.quadraticCurveTo(-bulgeHalf, yBulge, -neckHalf, yNeck);
    g.lineTo( neckHalf, yNeck);
    g.quadraticCurveTo( bulgeHalf, yBulge,  baseHalf, 0);
    g.quadraticCurveTo(0, h*0.12, -baseHalf, 0);   // rounded, sagging bottom
    g.closePath();
  }, toneSolid(inkLevel(tone)), 6);

  // shaded near-flank (a vertical wedge so the bag reads as round, not flat)
  pen.paint(()=>{
    g.moveTo(bulgeHalf*0.30, yBulge*1.05);
    g.quadraticCurveTo(bulgeHalf, yBulge, neckHalf*0.9, yNeck);
    g.lineTo(neckHalf*0.2, yNeck);
    g.quadraticCurveTo(bulgeHalf*0.5, yBulge, bulgeHalf*0.30, yBulge*1.05);
    g.closePath();
  }, toneSolid(inkLevel(tone+2)), 0);

  // ---- horizontal burlap weave seams ----
  for(let i=1;i<=params.weave;i++){
    const yy = yBulge + h*0.28*(i/(params.weave+1) - 0.5) + h*0.02;
    const hw = bulgeHalf*(0.86 - 0.10*i);
    pen.seam(()=>{ g.moveTo(-hw, yy); g.quadraticCurveTo(0, yy+h*0.03, hw, yy); }, 2.5);
  }

  if (open>0.5){
    // ---- OPEN MOUTH: fabric flaps flare outward from the neck ----
    pen.paint(()=>{
      g.moveTo(-neckHalf, yNeck);
      g.lineTo(-neckHalf*1.9, yTop);
      g.lineTo(-neckHalf*0.5, yTop+h*0.015);
      g.closePath();
    }, toneSolid(inkLevel(tone)), 4);
    pen.paint(()=>{
      g.moveTo( neckHalf, yNeck);
      g.lineTo( neckHalf*1.9, yTop);
      g.lineTo( neckHalf*0.5, yTop+h*0.015);
      g.closePath();
    }, toneSolid(inkLevel(tone)), 4);
    // dark hollow interior
    pen.paint(()=>{ g.ellipse(0, yTop, neckHalf*1.35, neckHalf*0.52, 0,0,7); }, toneSolid(inkLevel(MOUTH)), 4);
    // grain already heaped inside, cresting the rim
    pen.paint(()=>{ g.ellipse(0, yTop, neckHalf*1.0, neckHalf*0.38, 0, Math.PI, 0, true); }, toneSolid(inkLevel(GRAIN)), 3);
  } else {
    // ---- CINCHED, TIED NECK: gathered fabric bunched above a cord knot ----
    pen.paint(()=>{
      g.moveTo(-neckHalf, yNeck);
      g.lineTo(-neckHalf*1.35, yTop);
      g.quadraticCurveTo(0, yTop - h*0.05, neckHalf*1.35, yTop);
      g.lineTo( neckHalf, yNeck);
      g.closePath();
    }, toneSolid(inkLevel(tone)), 5);
    // gather folds
    for(let i=-1;i<=1;i++){
      pen.seam(()=>{ g.moveTo(neckHalf*0.55*i, yNeck); g.lineTo(neckHalf*0.9*i, yTop+h*0.01); }, 2.2);
    }
    // cinch band (the cord biting in at the neck)
    pen.paint(()=>{ rr(g, -neckHalf*1.18, yNeck-h*0.028, neckHalf*2.36, h*0.058, h*0.02); },
      toneSolid(inkLevel(CINCH)), 3);
    // knot to one side
    if (params.cord){
      pen.paint(()=>{ g.ellipse(neckHalf*1.02, yNeck, w*0.085, w*0.070, 0,0,7); }, toneSolid(inkLevel(CINCH)), 3);
      pen.ink(()=>{ g.moveTo(neckHalf*1.05, yNeck); g.lineTo(neckHalf*1.55, yNeck+h*0.05); }, 2.5); // loose tail
    }
  }

  g.restore();
  // neck world position (for carry grip mapping)
  return { neck:{ x:cx + Math.sin(tilt)*(h*0.68), y:baseY - Math.cos(tilt)*(h*0.68) } };
}

/* member formations built from the one template -------------------- */
function formation(W,H,st){
  const groundY = H*0.82;
  const layout  = st.layout || "row";
  const list = [];
  if (layout==="row"){
    // four sacks in a shallow ground arc; front-centre is the tallest.
    const spec = [
      { cx:.29, w:.21, h:.30, tone:BURLAP2 },
      { cx:.50, w:.25, h:.35, tone:BURLAP  },   // focus sack
      { cx:.70, w:.20, h:.29, tone:BURLAP2 },
      { cx:.85, w:.15, h:.22, tone:BURLAP2 },
    ];
    spec.forEach((s,i)=> list.push({
      cx:W*s.cx, baseY:groundY+ (i===1?0:H*0.01), w:W*s.w, h:H*s.h,
      open: (st.open && i===1)?1:0, tone:s.tone, ground:true,
    }));
  } else if (layout==="carry"){
    // two on the ground, one hoisted + tilted (being carried off).
    list.push({ cx:W*0.28, baseY:groundY, w:W*0.21, h:H*0.30, tone:BURLAP2, ground:true });
    list.push({ cx:W*0.46, baseY:groundY, w:W*0.23, h:H*0.33, tone:BURLAP,  ground:true });
    list.push({ cx:W*0.70, baseY:H*0.50, w:W*0.21, h:H*0.31, tone:BURLAP, tilt:0.20, carried:true });
  } else { // ship-stow: compact pyramid packed in the hold
    const rows = [
      { y:groundY,          xs:[.30,.50,.70], w:.185, h:.25 },
      { y:groundY-H*0.205,  xs:[.40,.60],     w:.185, h:.25 },
      { y:groundY-H*0.410,  xs:[.50],         w:.185, h:.25 },
    ];
    rows.forEach(r=> r.xs.forEach(x=> list.push({
      cx:W*x, baseY:r.y, w:W*r.w, h:H*r.h, tone:(x<0.5?BURLAP2:BURLAP), stow:true,
    })));
  }
  // sort back-to-front (smaller baseY = higher/further = drawn first)
  return { list: list.sort((a,b)=> a.baseY-b.baseY), groundY };
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const layout = st.layout || "row";
  const { list, groundY } = formation(W,H,st);

  // ---- hold framing for ship-stow (hull ribs + deck line, faint, behind) ----
  if (layout==="stow"){
    g.fillStyle=inkLevel(2); g.fillRect(0, groundY, W, H-groundY);         // deck floor
    pen.ink(()=>{ g.moveTo(0,groundY); g.lineTo(W,groundY); }, 3);
    g.save(); g.globalAlpha=0.5;
    for(let i=0;i<=4;i++){ const x=W*(0.08+i*0.21);                        // hull ribs
      pen.ink(()=>{ g.moveTo(x, groundY); g.lineTo(x-W*0.03, H*0.30); }, 3); }
    g.restore();
  }

  // ---- ground shadows for resting sacks ----
  g.fillStyle="rgba(0,0,0,0.10)";
  for(const s of list){
    if (s.carried) continue;
    g.beginPath(); g.ellipse(s.cx, s.baseY+6, s.w*0.62, s.h*0.06, 0,0,7); g.fill();
  }

  // ---- the sacks, back to front ----
  let grip=null;
  for(const s of list){
    const r = drawSack(pen,g, s.cx, s.baseY, s.w, s.h, { open:s.open, tilt:s.tilt||0, tone:s.tone });
    if (s.carried) grip = r.neck;
    if (s.open) drawProp._openNeck = r.neck;
  }

  // ---- FILL: grain streaming from above into the open sack ----
  if (layout==="row" && st.open){
    const neck = drawProp._openNeck; drawProp._openNeck = null;
    if (neck){
      const topY = H*0.10, sw = W*0.020;
      const wob = Math.sin(t*4)*W*0.006;
      pen.paint(()=>{
        g.moveTo(neck.x-sw+wob*0.3, topY);
        g.lineTo(neck.x+sw+wob*0.3, topY);
        g.lineTo(neck.x+sw*0.7+wob, neck.y);
        g.lineTo(neck.x-sw*0.7+wob, neck.y);
        g.closePath();
      }, toneSolid(inkLevel(GRAIN)), 3);
      // falling grain flecks
      g.fillStyle=inkLevel(CINCH);
      for(let i=0;i<7;i++){ const ty=topY + ((t*180+i*90)% (neck.y-topY));
        g.beginPath(); g.arc(neck.x + Math.sin(i*1.7)*sw*1.4, ty, 2.2, 0,7); g.fill(); }
    }
  }

  // ---- CARRY: a hand gripping the cinch of the hoisted sack + a forearm ----
  if (layout==="carry" && grip){
    pen.paint(()=>{ g.ellipse(grip.x, grip.y, W*0.030, W*0.024, 0.2, 0,7); }, toneSolid(inkLevel(4)), 4);
    pen.limb(()=>{ g.moveTo(grip.x, grip.y); g.lineTo(grip.x+W*0.10, grip.y-H*0.07); }, toneSolid(inkLevel(4)), W*0.028);
  }
}

export const asset = {
  id:"prop.barley-bags",
  type:"PROP",
  name:"Barley Bags",
  statusWord:"TIED",
  scene:"OD-B02-S06",

  params,
  // back -> front draw order the prop honors
  layers:["hold","shadow","sack-body","sack-flank","weave","cinch","mouth","grain","hand"],
  // normalized 0..1 anchors: fill / tie / carry / ship-stow contacts
  anchors:{
    "mouth:fill":{x:.50,y:.44},        // open neck where grain is poured in
    "cinch:tie":{x:.50,y:.56},         // knot at the tied neck
    "grip:carry":{x:.70,y:.55},        // where a hand takes a hoisted sack
    "stow:base":{x:.50,y:.82},         // stacked-set contact in the hold
    "contact:ground":{x:.50,y:.83},    // grounded set contact
  },
  // ownership + collision box (AABB in 0..1) for placement / pathing
  owner:"odysseus:provisions",
  zones:{ bounds:{ x0:.14,y0:.40,x1:.92,y1:.90 }, footprint:{ x0:.18,y0:.74,x1:.90,y1:.88 } },
  states:{
    initial:"tie",
    nodes:{
      fill:   { preview:{ layout:"row",   open:1, status:"FILLING", progress:.25 } },
      tie:    { preview:{ layout:"row",   open:0, status:"TIED",    progress:.50 } },
      carry:  { preview:{ layout:"carry", open:0, status:"CARRIED", progress:.75 } },
      "ship-stow":{ preview:{ layout:"stow", open:0, status:"STOWED", progress:1.0 } },
    },
    edges:[["fill","tie"],["tie","carry"],["carry","ship-stow"],["ship-stow","carry"],["tie","fill"]],
  },
  channels:["layout","open","t"],

  preview:()=>({ layout:"row", open:0, t:0, status:"TIED", progress:.50 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones, owner:asset.owner }; },
};
export default asset;
