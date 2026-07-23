/* environment.one-year-feast-cycle — a compressed year of feasting, rendered as
   a CYCLE RING. ENVIRONMENT asset (procedural world force). Scene (OD-B10-S07):
   on Circe's island a whole YEAR is compressed into a single revolving diagram —
   a ring divided into four SEASON quadrants (spring lightening -> summer bright ->
   autumn -> winter darkest), studded with repeated FEAST / REST / CLOTHING
   vignettes at monthly stations. A revolving PHASE POINTER sweeps the ring; the
   stations it has passed are struck "spent", and a band of IMPATIENCE scratch
   marks accumulates along the inner rim, growing longer and more agitated as the
   pointer nears the year's end (the crew's mounting restlessness).

   Procedural force: PHASE (0..1 through the year) drives the pointer angle, which
   stations are spent, and how many impatience marks have accrued; SEASON is
   phase quantized to the four quadrants; IMPATIENCE scales scratch length/agitation.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const frac = x => x - Math.floor(x);

const params = {
  cx:        0.50,   // ring centre x as frac of W
  cy:        0.47,   // ring centre y as frac of H
  ringR:     0.40,   // outer ring radius as frac of min(W,H)
  ringInner: 0.62,   // inner radius as frac of ringR (the empty hub field)
  stations:  12,     // vignette stations around the ring (one per month)
  phase:     0.62,   // 0..1 position through the year (channel-driven)
  impatience:1.0,    // scratch-mark agitation multiplier (channel-driven)
  seasonLvl: [2,1,3,5], // spring, summer, autumn, winter quadrant ink levels
};

const angleOf = a01 => -Math.PI/2 + a01*TAU;         // 0 -> top, clockwise
function ringSector(g, cx,cy, R, r, a0, a1){
  g.beginPath();
  g.arc(cx,cy,R,a0,a1);
  g.arc(cx,cy,r,a1,a0,true);
  g.closePath();
}

/* ---- SEASON RING: the annulus split into four tonal quadrants, quadrant spokes
   at the compass boundaries, and 12 monthly ticks around the outer rim. ---- */
function drawRing(pen,g,cx,cy,R,r){
  // faint disc backing so the ring reads as a solid wheel
  pen.paint(()=>{ g.arc(cx,cy,R,0,TAU); }, toneSolid(inkLevel(1)), 3);
  // four season quadrants, boundaries at top/right/bottom/left
  for(let q=0;q<4;q++){
    const a0 = angleOf(q/4), a1 = angleOf((q+1)/4);
    pen.paint(()=>{ ringSector(g,cx,cy,R,r,a0,a1); }, toneSolid(inkLevel(params.seasonLvl[q])), 4);
  }
  // clean rims
  pen.ink(()=>{ g.arc(cx,cy,R,0,TAU); }, 4);
  pen.ink(()=>{ g.arc(cx,cy,r,0,TAU); }, 4);
  // quadrant spokes
  for(let q=0;q<4;q++){
    const a = angleOf(q/4);
    pen.ink(()=>{ g.moveTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r); g.lineTo(cx+Math.cos(a)*R, cy+Math.sin(a)*R); }, 4);
  }
  // monthly ticks on the outer rim
  for(let i=0;i<params.stations;i++){
    const a = angleOf(i/params.stations);
    const R0 = R - (R-r)*0.14;
    pen.ink(()=>{ g.moveTo(cx+Math.cos(a)*R0, cy+Math.sin(a)*R0); g.lineTo(cx+Math.cos(a)*R, cy+Math.sin(a)*R); }, 2.5);
  }
}

/* ---- SEASON GLYPHS: one emblem outside each quadrant — sprout / sun / sheaf /
   snowflake — so the four seasons read at a glance. ---- */
function drawSeasonGlyphs(pen,g,cx,cy,R){
  const gr = R + R*0.14;                              // glyph orbit
  const at = q => { const a=angleOf((q+0.5)/4); return { x:cx+Math.cos(a)*gr, y:cy+Math.sin(a)*gr }; };
  const S = R*0.11;
  // SPRING — a sprout: stem + two leaves
  { const p=at(0); pen.ink(()=>{ g.moveTo(p.x,p.y+S*0.7); g.lineTo(p.x,p.y-S*0.7); },3);
    pen.paint(()=>{ g.ellipse(p.x-S*0.5,p.y-S*0.1,S*0.5,S*0.26,-0.7,0,TAU); }, toneSolid(inkLevel(4)),3);
    pen.paint(()=>{ g.ellipse(p.x+S*0.5,p.y-S*0.3,S*0.5,S*0.26,0.7,0,TAU); }, toneSolid(inkLevel(4)),3); }
  // SUMMER — a sun: disc + rays
  { const p=at(1); pen.paint(()=>{ g.arc(p.x,p.y,S*0.55,0,TAU); }, toneSolid(inkLevel(1)),3);
    for(let k=0;k<8;k++){ const a=k/8*TAU; pen.ink(()=>{ g.moveTo(p.x+Math.cos(a)*S*0.7,p.y+Math.sin(a)*S*0.7); g.lineTo(p.x+Math.cos(a)*S,p.y+Math.sin(a)*S); },2.5); } }
  // AUTUMN — a sheaf: bound stalks
  { const p=at(2); for(let k=-2;k<=2;k++){ const sx=p.x+k*S*0.16; pen.ink(()=>{ g.moveTo(sx- k*S*0.06,p.y+S*0.8); g.lineTo(sx+k*S*0.22,p.y-S*0.8); },2.6); }
    pen.ink(()=>{ g.moveTo(p.x-S*0.5,p.y+S*0.12); g.lineTo(p.x+S*0.5,p.y+S*0.12); },3.2); }
  // WINTER — a snowflake: three crossing spokes with barbs
  { const p=at(3); for(let k=0;k<3;k++){ const a=k/3*Math.PI; const dx=Math.cos(a)*S, dy=Math.sin(a)*S;
      pen.ink(()=>{ g.moveTo(p.x-dx,p.y-dy); g.lineTo(p.x+dx,p.y+dy); },2.6); } }
}

/* ---- one VIGNETTE icon, drawn upright at (x,y): feast plate+goblet / rest couch /
   clothing tunic. When `spent` a diagonal strike marks it consumed; `imp` adds a
   second agitated scratch for the year's impatient tail. ---- */
function icon(pen,g, x,y, type, spent, imp){
  const s = 1;
  if (type===0){ // FEAST — plate, food mound, goblet
    pen.paint(()=>{ g.ellipse(x,y+6,18,7,0,0,TAU); }, toneSolid(inkLevel(1)), 3);       // plate
    pen.paint(()=>{ g.ellipse(x,y+3,10,5,0,0,TAU); }, toneSolid(inkLevel(4)), 2.5);     // food
    pen.paint(()=>{ g.ellipse(x+14,y-6,5,6,0,0,TAU); }, toneSolid(inkLevel(2)), 2.5);   // goblet bowl
    pen.ink(()=>{ g.moveTo(x+14,y-1); g.lineTo(x+14,y+5); },2.5);                        // stem
  } else if (type===1){ // REST — a low couch with a bolster pillow
    pen.paint(()=>{ g.moveTo(x-18,y+8); g.lineTo(x+18,y+8); g.lineTo(x+18,y-2); g.quadraticCurveTo(x+18,y-6,x+14,y-6); g.lineTo(x-18,y-6); g.closePath(); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.ellipse(x-11,y-6,8,5,0,0,TAU); }, toneSolid(inkLevel(2)), 2.5);   // pillow
    pen.ink(()=>{ g.moveTo(x-18,y+8); g.lineTo(x-18,y+13); },2.5);                       // leg
    pen.ink(()=>{ g.moveTo(x+18,y+8); g.lineTo(x+18,y+13); },2.5);
  } else { // CLOTHING — a folded tunic (T)
    pen.paint(()=>{ g.moveTo(x-6,y-8); g.lineTo(x+6,y-8); g.lineTo(x+16,y-2); g.lineTo(x+12,y+3); g.lineTo(x+8,y+0); g.lineTo(x+8,y+11); g.lineTo(x-8,y+11); g.lineTo(x-8,y+0); g.lineTo(x-12,y+3); g.lineTo(x-16,y-2); g.closePath(); }, toneSolid(inkLevel(4)), 3);
    pen.ink(()=>{ g.moveTo(x-4,y-8); g.quadraticCurveTo(x,y-4,x+4,y-8); },2.5);          // neck
  }
  if (spent){
    pen.ink(()=>{ g.moveTo(x-16,y-9); g.lineTo(x+16,y+11); },3.2);                       // consumed strike
    if (imp>0.4) pen.ink(()=>{ g.moveTo(x+16,y-9); g.lineTo(x-16,y+11); },2.6);          // agitated cross
  }
}

/* ---- VIGNETTES: the repeated feast/rest/clothing stations around the ring
   midline. Stations before the pointer are struck "spent". ---- */
function drawVignettes(pen,g,cx,cy,R,r,phase,imp){
  const rm = (R+r)/2;
  const n = params.stations;
  for(let i=0;i<n;i++){
    const a01 = (i+0.5)/n;
    const a = angleOf(a01);
    const x = cx+Math.cos(a)*rm, y = cy+Math.sin(a)*rm;
    const spent = a01 < phase;
    icon(pen,g, x, y, i%3, spent, spent? imp*(0.4+a01) : 0);
  }
}

/* ---- IMPATIENCE BAND: scratch tally along the inner rim from the year's start
   (top) clockwise to the pointer. Marks lengthen + jitter toward the head — the
   crew's mounting restlessness as the year drags. ---- */
function drawImpatience(pen,g,cx,cy,r,phase,imp,t){
  const count = Math.max(0, Math.round(phase*24));
  for(let k=0;k<count;k++){
    const a01 = (k+0.5)/24;
    if (a01 >= phase) break;
    const a = angleOf(a01);
    const near = clamp01(a01/Math.max(0.001,phase));  // 0 start .. 1 at head
    const len = r*(0.10 + 0.22*near*imp);
    const jit = (frac(Math.sin(k*91.7)*4331)-0.5) * near*imp*0.10;
    const aa = a + jit;
    const rr0 = r - r*0.02, rr1 = rr0 - len;
    pen.ink(()=>{ g.moveTo(cx+Math.cos(aa)*rr0, cy+Math.sin(aa)*rr0); g.lineTo(cx+Math.cos(aa)*rr1, cy+Math.sin(aa)*rr1); }, 2.6);
  }
}

/* ---- PHASE POINTER + HUB: a bold arm sweeping from the central hub to the
   current phase angle on the ring. The hub is a dark disc with a bright pip. ---- */
function drawPointer(pen,g,cx,cy,R,r,phase,t){
  const a = angleOf(phase);
  const tip = R - (R-r)*0.30;
  const tx = cx+Math.cos(a)*tip, ty = cy+Math.sin(a)*tip;
  // shaft
  pen.limb(()=>{ g.moveTo(cx,cy); g.lineTo(tx,ty); }, toneSolid(inkLevel(6)), 7);
  // arrowhead
  const ha = a, back = tip - (R-r)*0.26;
  const bx = cx+Math.cos(ha)*back, by = cy+Math.sin(ha)*back;
  const perp = ha + Math.PI/2, wch = (R-r)*0.13;
  pen.paint(()=>{
    g.moveTo(tx,ty);
    g.lineTo(bx+Math.cos(perp)*wch, by+Math.sin(perp)*wch);
    g.lineTo(bx-Math.cos(perp)*wch, by-Math.sin(perp)*wch);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  // hub
  const hr = R*0.13;
  pen.paint(()=>{ g.arc(cx,cy,hr,0,TAU); }, toneSolid(inkLevel(5)), 4);
  pen.paint(()=>{ g.arc(cx,cy,hr*0.42,0,TAU); }, toneSolid(inkLevel(1)), 3);
  // radiating hub ticks
  for(let k=0;k<12;k++){ const ka=k/12*TAU; pen.ink(()=>{ g.moveTo(cx+Math.cos(ka)*hr, cy+Math.sin(ka)*hr); g.lineTo(cx+Math.cos(ka)*hr*1.16, cy+Math.sin(ka)*hr*1.16); },2); }
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const cx = W*params.cx, cy = H*params.cy;
  const R  = Math.min(W,H)*params.ringR;
  const r  = R*params.ringInner;
  const t     = st.t ?? 0;
  const phase = clamp01(st.phase ?? params.phase);
  const imp   = clamp(st.impatience ?? params.impatience, 0, 1.5);
  const layers = st.layers || ["ring","seasons","vignettes","impatience","pointer"];
  const has = l => layers.includes(l);

  if (has("ring"))       drawRing(pen,g,cx,cy,R,r);
  if (has("seasons"))    drawSeasonGlyphs(pen,g,cx,cy,R);
  if (has("vignettes"))  drawVignettes(pen,g,cx,cy,R,r,phase,imp);
  if (has("impatience")) drawImpatience(pen,g,cx,cy,r,phase,imp,t);
  if (has("pointer"))    drawPointer(pen,g,cx,cy,R,r,phase,t);
  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"environment.one-year-feast-cycle",
  type:"ENVIRONMENT",
  name:"One-year feast cycle",
  statusWord:"REVOLVING",
  scene:"OD-B10-S07",

  params,
  // back -> front draw order the field honors; scene state may pass a subset
  layers:["ring","seasons","vignettes","impatience","pointer"],
  // normalized 0..1 field anchors: ring centre, the four season quadrant centres,
  // and the pointer head (the "now" of the compressed year)
  anchors:{
    "centre:hub":{     x:0.50, y:0.47 },
    "season:spring":{  x:0.71, y:0.26 },
    "season:summer":{  x:0.71, y:0.68 },
    "season:autumn":{  x:0.29, y:0.68 },
    "season:winter":{  x:0.29, y:0.26 },
    "station:feast":{  x:0.50, y:0.09 },   // top station on the rim
    "pointer:now":{    x:0.62, y:0.72 },
    "camera:wide":{    x:0.50, y:0.47 },
  },
  // affected regions: the revolving ring band vs. the still hub field it encircles
  zones:{
    ring: { x0:0.10, y0:0.07, x1:0.90, y1:0.87 },
    hub:  { x0:0.38, y0:0.36, x1:0.62, y1:0.58 },
  },
  // ENVIRONMENT state machine: the year's beats, in order around the ring
  states:{
    initial:"autumn-drag",
    nodes:{
      // spring-feast: the year opens, pointer near the top, few marks
      "spring-feast":{ preview:{ t:0.2, phase:0.10, impatience:0.25,
                                 status:"FEASTING", progress:0.10 } },
      // high-summer: pointer at the bright quadrant, feasts and rest repeating
      "high-summer":{ preview:{ t:0.6, phase:0.38, impatience:0.55,
                                status:"HIGH-SUMMER", progress:0.38 } },
      // autumn-drag: the neutral beat — over half spent, impatience mounting
      "autumn-drag":{ preview:{ t:1.1, phase:0.62, impatience:1.0,
                                status:"REVOLVING", progress:0.62 } },
      // winters-end: near a full revolution, dense agitated scratch band
      "winters-end":{ preview:{ t:1.6, phase:0.92, impatience:1.4,
                                status:"RESTLESS", progress:0.92 } },
    },
    edges:[["spring-feast","high-summer"],["high-summer","autumn-drag"],
           ["autumn-drag","winters-end"],["winters-end","spring-feast"]],
  },
  duration:8.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","phase","impatience"],

  // neutral preview: the year over half-gone — pointer in the autumn quadrant, the
  // spent feast/rest/clothing stations struck through, impatience marks accruing.
  preview:()=>({ t:1.1, phase:0.62, impatience:1.0,
                 status:"REVOLVING", progress:0.62,
                 layers:["ring","seasons","vignettes","impatience","pointer"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
