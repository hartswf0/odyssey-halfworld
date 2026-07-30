/* prop.palace-weapon-collection — the arms of Ithaca as a COUNTED inventory.
   PROP asset. Book XIX opens with Odysseus and Telemachus clearing the hall
   of weapons: "shields, spears, helmets, armour" carried out by lamplight and
   shut in the storeroom. The dramatic fact is not the pile — that is
   `prop.palace-weapons`, the tableau on the hall beam. The dramatic fact here
   is the COUNT: every piece is individually addressable, and at the end of the
   night the hall total must be zero and the store total must be sixteen.
   Book XXII turns the same ledger into evidence when Melanthius carries
   twelve pieces back down and the audit comes up short.

   So this module is the transfer diagram, not the still life:
     HALL side (left)  ·  threshold door (centre)  ·  STORE side (right)
     four groups — 4 shields · 6 spears · 4 helmets · 2 corselets = 16
     a census rail along the bottom: one notch per piece,
       hollow = in the hall, solid = in the store, crossed = missing
     two seven-segment totals in the header (drawn as GEOMETRY, never as type)

   States:
     displayed — all sixteen still in the hall, door shut
     counted   — the same, but the census rail is live: the tally has begun
     transit   — the carry: pieces on both sides, leaf swung, one spear in the door
     stored    — every piece across, door shut
     sealed    — bolt shot, seal knotted on the staple: locked storage
     short     — the audit after Melanthius: two notches crossed, ghosts in the rack

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B19-S01. */
import { makePen, toneSolid, inkLevel, INK } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared parameters ---------------- */

const params = {
  shields:4, spears:6, helmets:4, corselets:2,   // 16 individually countable pieces
  total:16,
  hall:  { x0:0.050, x1:0.410 },                 // display side, fractions of W
  door:  { x0:0.410, x1:0.590 },                 // the storeroom threshold
  store: { x0:0.590, x1:0.950 },                 // locked storage side
  zoneTop:0.180, zoneBot:0.820, doorTop:0.545,
  censusY:0.858, censusH:0.034,
  headY:0.095,  headH:0.052,                     // seven-segment digit height
  body:1, plane:2, accent:6, bronze:4,           // ink levels — light planes, dark accents
};

/* group table: order fixes every piece's global index 0..15 */
const GROUPS = [
  { key:"shields",   kind:"shield",   n:4, cy:0.268, size:0.037 },
  { key:"spears",    kind:"spear",    n:6, cy:0.428, size:0.118 },
  { key:"helmets",   kind:"helmet",   n:4, cy:0.585, size:0.066 },
  { key:"corselets", kind:"corselet", n:2, cy:0.740, size:0.120 },
];
const OFFSETS = (()=>{ const o=[]; let a=0; for(const g of GROUPS){ o.push(a); a+=g.n; } return o; })();

/* ---------------- seven-segment numerals (numbers as GEOMETRY) ---------------- */

const SEG_MAP = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc", 5:"afgcd",
                  6:"afgedc", 7:"abc", 8:"abcdefg", 9:"abcdfg" };

function segDigit(g, x, y, h, d){
  const w = h*0.56, t = h*0.170, half = h/2;
  const S = {
    a:[x+t*.55, y,             w-t*1.10, t],
    g:[x+t*.55, y+half-t/2,    w-t*1.10, t],
    d:[x+t*.55, y+h-t,         w-t*1.10, t],
    f:[x,       y+t*.55,       t, half-t*.85],
    b:[x+w-t,   y+t*.55,       t, half-t*.85],
    e:[x,       y+half+t*.30,  t, half-t*.85],
    c:[x+w-t,   y+half+t*.30,  t, half-t*.85],
  };
  g.fillStyle = INK;
  for (const s of (SEG_MAP[d] || "")){ const r = S[s]; g.fillRect(r[0], r[1], r[2], r[3]); }
  return w;
}
function segNumber(g, x, y, h, value, digits=2){
  const str = String(Math.max(0, value|0)).padStart(digits, "0");
  const w = h*0.56, gap = h*0.20;
  let cx = x;
  for (const ch of str){ segDigit(g, cx, y, h, +ch); cx += w + gap; }
  return cx - gap - x;
}

/* ---------------- item glyphs — light plane, one dark accent each ---------------- */

function gShield(pen, g, cx, cy, r){
  pen.paint(()=>{ g.arc(cx, cy, r, 0, 7); }, toneSolid(inkLevel(params.body)), 3.6);
  pen.seam(()=>{ g.arc(cx, cy, r*.64, 0, 7); }, 2.2);
  pen.paint(()=>{ g.arc(cx, cy, r*.25, 0, 7); }, toneSolid(inkLevel(params.accent)), 2.4);
  g.fillStyle = INK;
  for (let i=0;i<6;i++){ const a=i/6*Math.PI*2+0.4;
    g.beginPath(); g.arc(cx+Math.cos(a)*r*.86, cy+Math.sin(a)*r*.86, r*.055, 0, 7); g.fill(); }
}

function gSpear(pen, g, cx, cy, h, tilt=0){
  const w = h*.085, head = h*.24, top = -h/2;
  g.save(); g.translate(cx, cy); g.rotate(tilt);
  pen.paint(()=>{ g.rect(-w/2, top+head, w, h-head); }, toneSolid(inkLevel(params.body)), 2.8);
  pen.paint(()=>{
    g.moveTo(0, top);
    g.quadraticCurveTo( w*1.70, top+head*.58,  w*.50, top+head);
    g.lineTo(-w*.50, top+head);
    g.quadraticCurveTo(-w*1.70, top+head*.58, 0, top);
  }, toneSolid(inkLevel(params.accent)), 2.4);
  pen.paint(()=>{ g.rect(-w*.95, top+head, w*1.90, h*.045); }, toneSolid(inkLevel(params.bronze)), 2);
  pen.paint(()=>{ g.rect(-w*.85, h/2-h*.045, w*1.70, h*.045); }, toneSolid(inkLevel(params.bronze)), 2);
  g.restore();
}

function gHelmet(pen, g, cx, cy, s){
  const w = s*.72;
  pen.paint(()=>{
    g.moveTo(cx-w*.50, cy+s*.10);
    g.bezierCurveTo(cx-w*.54, cy-s*.58, cx+w*.54, cy-s*.58, cx+w*.50, cy+s*.10);
    g.lineTo(cx+w*.46, cy+s*.30);
    g.quadraticCurveTo(cx+w*.40, cy+s*.52, cx+w*.21, cy+s*.50);
    g.lineTo(cx+w*.13, cy+s*.20);
    g.lineTo(cx-w*.13, cy+s*.20);
    g.lineTo(cx-w*.21, cy+s*.50);
    g.quadraticCurveTo(cx-w*.40, cy+s*.52, cx-w*.46, cy+s*.30);
    g.closePath();
  }, toneSolid(inkLevel(params.body)), 3.2);
  // crest ridge — the dark accent, riding ON the dome
  pen.paint(()=>{
    g.moveTo(cx-w*.36, cy-s*.31);
    g.quadraticCurveTo(cx, cy-s*.86, cx+w*.36, cy-s*.31);
    g.quadraticCurveTo(cx, cy-s*.53, cx-w*.36, cy-s*.31);
    g.closePath();
  }, toneSolid(inkLevel(params.accent)), 2.4);
  // eye slot + nasal
  pen.paint(()=>{ g.ellipse(cx, cy+s*.02, w*.29, s*.055, 0, 0, 7); }, toneSolid(inkLevel(params.accent)), 2);
  pen.seam(()=>{ g.moveTo(cx, cy+s*.07); g.lineTo(cx, cy+s*.20); }, 2.2);
}

function gCorselet(pen, g, cx, cy, h){
  const w = h*.62;
  pen.paint(()=>{
    g.moveTo(cx-w*.46, cy-h*.42);
    g.lineTo(cx-w*.18, cy-h*.50); g.lineTo(cx+w*.18, cy-h*.50); g.lineTo(cx+w*.46, cy-h*.42);
    g.quadraticCurveTo(cx+w*.40, cy-h*.04, cx+w*.29, cy+h*.22);
    g.quadraticCurveTo(cx+w*.54, cy+h*.40, cx+w*.52, cy+h*.50);
    g.lineTo(cx-w*.52, cy+h*.50);
    g.quadraticCurveTo(cx-w*.54, cy+h*.40, cx-w*.29, cy+h*.22);
    g.quadraticCurveTo(cx-w*.40, cy-h*.04, cx-w*.46, cy-h*.42);
    g.closePath();
  }, toneSolid(inkLevel(params.body)), 3.4);
  pen.paint(()=>{ g.ellipse(cx, cy-h*.46, w*.17, h*.045, 0, 0, 7); }, toneSolid(inkLevel(params.accent)), 2.2);
  pen.seam(()=>{ g.moveTo(cx, cy-h*.36); g.lineTo(cx, cy+h*.18); }, 2.4);
  pen.seam(()=>{ g.moveTo(cx-w*.38, cy-h*.18); g.quadraticCurveTo(cx-w*.16, cy-h*.02, cx, cy-h*.10);
                 g.moveTo(cx+w*.38, cy-h*.18); g.quadraticCurveTo(cx+w*.16, cy-h*.02, cx, cy-h*.10); }, 2.4);
  pen.seam(()=>{ g.moveTo(cx-w*.30, cy+h*.22); g.lineTo(cx+w*.30, cy+h*.22); }, 2.4);
}

/* a piece that should be here and is not */
function gGhost(g, cx, cy, w, h){
  g.save(); g.setLineDash([7,7]);
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineJoin = "round";
  g.beginPath(); g.rect(cx-w/2, cy-h/2, w, h); g.stroke();
  g.setLineDash([]); g.restore();
}

/* the audit tick — a piece counted across */
function gTick(g, x, y, s){
  g.strokeStyle = INK; g.lineWidth = Math.max(2.4, s*.34); g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.moveTo(x, y+s*.10); g.lineTo(x+s*.42, y+s*.62); g.lineTo(x+s, y-s*.52); g.stroke();
}

function drawGlyph(pen, g, kind, cx, cy, W, H, size){
  if (kind==="shield")   return gShield(pen, g, cx, cy, W*size);
  if (kind==="spear")    return gSpear(pen, g, cx, cy, H*size);
  if (kind==="helmet")   return gHelmet(pen, g, cx, cy, H*size);
  return gCorselet(pen, g, cx, cy, H*size);
}
function glyphBox(kind, W, H, size){
  if (kind==="shield")   return { w:W*size*2.1, h:W*size*2.1 };
  if (kind==="spear")    return { w:H*size*0.30, h:H*size*1.05 };
  if (kind==="helmet")   return { w:H*size*0.80, h:H*size*1.10 };
  return { w:H*size*0.70, h:H*size*1.05 };
}

/* ---------------- the diagram furniture ---------------- */

/* zone corner brackets — the frame WITHOUT a full-width bar */
function brackets(pen, g, W, H, zone){
  const x0=W*zone.x0, x1=W*zone.x1, y0=H*params.zoneTop, y1=H*params.zoneBot;
  const lx=(x1-x0)*.17, ly=(y1-y0)*.062;
  g.strokeStyle=INK; g.lineWidth=4.6; g.lineCap="butt"; g.lineJoin="miter";
  const corner=(cx,cy,sx,sy)=>{ g.beginPath();
    g.moveTo(cx+sx*lx, cy); g.lineTo(cx, cy); g.lineTo(cx, cy+sy*ly); g.stroke(); };
  corner(x0,y0, 1, 1); corner(x1,y0,-1, 1);
  corner(x0,y1, 1,-1); corner(x1,y1,-1,-1);
}

/* the boundary between the two sides — a dashed axis, not a painted wall.
   Diagram language: light, broken, and it never becomes a bar. */
function boundary(g, W, H){
  const x=W*(params.door.x0+params.door.x1)/2;
  g.save(); g.setLineDash([11,13]);
  g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="butt";
  g.beginPath(); g.moveTo(x, H*params.zoneTop); g.lineTo(x, H*params.doorTop-H*.012); g.stroke();
  g.setLineDash([]); g.restore();
}

/* the storeroom door, at proper doorway proportions: lintel, jambs, sill,
   leaf, staples and the bolt. It stands on the floor, where a door stands. */
function threshold(pen, g, W, H, { open=false, bolted=false }={}){
  const D=params.door, x0=W*D.x0, x1=W*D.x1, w=x1-x0;
  const y0=H*params.doorTop, y1=H*params.zoneBot;
  const capH=H*.030, jw=w*.15;
  // lintel — overhangs the jambs, short by construction
  pen.paint(()=>{ g.rect(x0-w*.14, y0, w*1.28, capH); }, toneSolid(inkLevel(params.plane)), 3.6);
  // sill / threshold stone
  pen.paint(()=>{ g.rect(x0-w*.10, y1-capH*.72, w*1.20, capH*.72); }, toneSolid(inkLevel(params.plane)), 3.6);
  // jambs
  const top=y0+capH, bot=y1-capH*.72, ih=bot-top;
  for (const jx of [x0, x1-jw])
    pen.paint(()=>{ g.rect(jx, top, jw, ih); }, toneSolid(inkLevel(params.body)), 3.2);
  // the opening + the leaf
  const lx0=x0+jw, lw=(x1-jw)-lx0, cy=top+ih*.60;
  if (open){
    // swung inward against the store jamb: one narrow foreshortened plane,
    // and the rest of the opening left as clear paper to carry through
    const e = lx0+lw*.62;
    pen.paint(()=>{
      g.moveTo(x1-jw, top+ih*.03); g.lineTo(e, top+ih*.11);
      g.lineTo(e, bot-ih*.11);     g.lineTo(x1-jw, bot-ih*.03); g.closePath();
    }, toneSolid(inkLevel(params.body)), 3.2);
    pen.seam(()=>{ g.moveTo((e+x1-jw)/2, top+ih*.10); g.lineTo((e+x1-jw)/2, bot-ih*.10); }, 2.4);
  } else {
    pen.paint(()=>{ g.rect(lx0, top, lw, ih); }, toneSolid(inkLevel(0)), 3.2);
    for (const u of [.24,.52,.80]) pen.seam(()=>{
      g.moveTo(lx0+lw*.10, top+ih*u); g.lineTo(lx0+lw*.90, top+ih*u); }, 2.6);
    pen.seam(()=>{ g.arc(lx0+lw*.72, cy+ih*.06, lw*.13, 0, 7); }, 3);
  }
  // staples, one on each jamb
  for (const sx of [x0+jw*.10, x1-jw*1.10])
    pen.paint(()=>{ g.rect(sx, cy-H*.014, jw*.80, H*.028); }, toneSolid(inkLevel(params.bronze)), 2.6);
  // the bolt: shot across the leaf, or withdrawn and parked outside the jamb
  if (bolted){
    pen.paint(()=>{ g.rect(x0-w*.06, cy-H*.010, w*1.12, H*.020); }, toneSolid(inkLevel(7)), 3);
    // seal cord + knot hanging off the store staple
    pen.paint(()=>{ g.arc(x1-jw*.55, cy+H*.032, w*.085, 0, 7); }, toneSolid(inkLevel(params.accent)), 2.6);
    pen.ink(()=>{ g.moveTo(x1-jw*.55, cy+H*.012); g.lineTo(x1-jw*.55, cy+H*.032-w*.085);
                  g.moveTo(x1-jw*.55, cy+H*.032+w*.085); g.lineTo(x1-jw*.95, cy+H*.064);
                  g.moveTo(x1-jw*.55, cy+H*.032+w*.085); g.lineTo(x1-jw*.15, cy+H*.062); }, 2.8);
  } else {
    pen.paint(()=>{ g.rect(x0-w*.34, cy-H*.009, w*.40, H*.018); }, toneSolid(inkLevel(params.bronze)), 2.6);
  }
  // the floor the door stands on — a short rule, not a span
  pen.ink(()=>{ g.moveTo(x0-w*.42, y1); g.lineTo(x1+w*.42, y1); }, 4);
  return { cx:(x0+x1)/2, x0, x1, w, top, bot, cy, carryX:lx0+lw*.28, carryY:top+ih*.22 };
}

/* motion streaks — the carry direction, hall -> store */
function streaks(g, x, y, n=3, len=48, gap=13){
  g.strokeStyle="rgba(0,0,0,0.46)"; g.lineCap="round";
  for (let i=0;i<n;i++){ g.lineWidth = 6.2-i*1.4;
    g.beginPath(); g.moveTo(x, y+i*gap); g.lineTo(x+len-i*len*.20, y+i*gap); g.stroke(); }
}

/* the census rail: one notch per piece, grouped, broken between groups */
function census(pen, g, W, H, place){
  const y=H*params.censusY, hh=H*params.censusH;
  const gapW=W*.024, span=W*.880 - gapW*(GROUPS.length-1);
  const per=span/params.total;
  let x=W*.060, idx=0;
  for (const grp of GROUPS){
    // group foot tick — a short rule under this group only
    pen.ink(()=>{ g.moveTo(x+per*.10, y+hh+H*.014); g.lineTo(x+per*grp.n-per*.10, y+hh+H*.014); }, 2.6);
    for (let i=0;i<grp.n;i++, idx++){
      const st=place[idx];
      const bw=per*.70, bx=x+(per-bw)/2;
      if (st==="gone"){
        g.save(); g.setLineDash([5,5]); g.strokeStyle=INK; g.lineWidth=2.6;
        g.beginPath(); g.rect(bx,y,bw,hh); g.stroke(); g.setLineDash([]);
        g.lineWidth=3.4; g.lineCap="round"; g.beginPath();
        g.moveTo(bx+bw*.16, y+hh*.18); g.lineTo(bx+bw*.84, y+hh*.82);
        g.moveTo(bx+bw*.84, y+hh*.18); g.lineTo(bx+bw*.16, y+hh*.82); g.stroke();
        g.restore();
      } else {
        pen.paint(()=>{ g.rect(bx,y,bw,hh); },
          toneSolid(inkLevel(st==="store" ? 7 : 0)), 3);
      }
      x+=per;
    }
    x+=gapW;
  }
}

/* header: hall mark · broken transfer arrow · store mark, with the two totals */
function header(pen, g, W, H, hallN, storeN){
  const dh=H*params.headH, dy=H*params.headY, cy=dy+dh/2;
  // hall mark — a pediment on two short columns
  const hx=W*.082, hs=dh*.86;
  pen.paint(()=>{ g.moveTo(hx-hs*.62, cy-hs*.04); g.lineTo(hx, cy-hs*.56); g.lineTo(hx+hs*.62, cy-hs*.04); g.closePath(); },
    toneSolid(inkLevel(params.plane)), 3);
  for (const s of [-1,1]) pen.paint(()=>{ g.rect(hx+s*hs*.40-hs*.11, cy-hs*.02, hs*.22, hs*.58); },
    toneSolid(inkLevel(params.body)), 2.6);
  segNumber(g, W*.150, dy, dh, hallN, 2);

  // broken transfer arrow
  g.strokeStyle=INK; g.lineWidth=5; g.lineCap="butt";
  for (const [a,b] of [[.340,.385],[.413,.458],[.486,.531]]){
    g.beginPath(); g.moveTo(W*a, cy); g.lineTo(W*b, cy); g.stroke(); }
  g.fillStyle=INK; g.beginPath();
  g.moveTo(W*.590, cy); g.lineTo(W*.548, cy-dh*.26); g.lineTo(W*.548, cy+dh*.26); g.closePath(); g.fill();

  // store mark — a padlock
  const kx=W*.918, ks=dh*.86;
  pen.ink(()=>{ g.arc(kx, cy-ks*.20, ks*.30, Math.PI*1.02, Math.PI*1.98); }, 4.4);
  pen.paint(()=>{ g.rect(kx-ks*.44, cy-ks*.18, ks*.88, ks*.62); }, toneSolid(inkLevel(params.body)), 3);
  pen.paint(()=>{ g.arc(kx, cy+ks*.09, ks*.11, 0, 7); }, toneSolid(inkLevel(params.accent)), 2.2);
  segNumber(g, W*.742, dy, dh, storeN, 2);
}

/* ---------------- state table ---------------- */

const MODES = {
  displayed:{ moved:[0,0,0,0], gone:[],     door:"shut", bolt:false, tick:false, streak:false },
  counted:  { moved:[0,0,0,0], gone:[],     door:"shut", bolt:false, tick:false, streak:false },
  transit:  { moved:[2,4,2,1], gone:[],     door:"open", bolt:false, tick:true,  streak:true  },
  stored:   { moved:[4,6,4,2], gone:[],     door:"shut", bolt:false, tick:true,  streak:false },
  sealed:   { moved:[4,6,4,2], gone:[],     door:"shut", bolt:true,  tick:true,  streak:false },
  short:    { moved:[4,6,4,2], gone:[2,7],  door:"open", bolt:false, tick:true,  streak:true  },
};

/* where every one of the sixteen pieces is, in declared order */
function placement(M){
  const out=[];
  GROUPS.forEach((grp, gi)=>{
    const m=M.moved[gi];
    for (let i=0;i<grp.n;i++){
      const gid=OFFSETS[gi]+i;
      out.push(M.gone.includes(gid) ? "gone" : (i<m ? "store" : "hall"));
    }
  });
  return out;
}

/* even n-slot grid inside a zone; pieces fill from the door-most slot outward
   in the store, and from the far slot inward in the hall */
function slot(W, zone, n, i){
  const x0=W*zone.x0, x1=W*zone.x1, w=x1-x0;
  return x0 + w*(i+0.5)/n;
}

/* ---------------- the render ---------------- */

function draw(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const M = MODES[st.mode] || MODES.transit;
  const place = placement(M);

  // frame: the two zones as corner brackets, the door between them
  brackets(pen, g, W, H, params.hall);
  brackets(pen, g, W, H, params.store);
  boundary(g, W, H);
  const D = threshold(pen, g, W, H, { open:M.door==="open", bolted:M.bolt });

  // the sixteen pieces
  GROUPS.forEach((grp, gi)=>{
    const m = M.moved[gi], cy = H*grp.cy;
    const box = glyphBox(grp.kind, W, H, grp.size);
    for (let i=0;i<grp.n;i++){
      const gid = OFFSETS[gi]+i, where = place[gid];
      /* hall pieces pack against the OUTER wall (slots 0..), store pieces
         against theirs (slots ..n-1) — the traffic lane by the door stays
         open, and neither zone reads as a lopsided heap. */
      if (where==="hall"){
        const cx = slot(W, params.hall, grp.n, i-m);
        drawGlyph(pen, g, grp.kind, cx, cy, W, H, grp.size);
      } else if (where==="store"){
        const cx = slot(W, params.store, grp.n, grp.n-m+i);
        drawGlyph(pen, g, grp.kind, cx, cy, W, H, grp.size);
        if (M.tick) gTick(g, cx-H*.009, cy+box.h*.50+H*.032, H*.017);
      } else {
        const cx = slot(W, params.store, grp.n, grp.n-m+i);
        gGhost(g, cx, cy, box.w*.92, box.h*.92);
      }
    }
  });

  // the carry in progress: one spear crossing the threshold, and the drag cue
  if (M.streak){
    streaks(g, D.x0 - D.w*.66, D.carryY - H*.020, 3, W*.068, H*.020);
    gSpear(pen, g, D.carryX, D.carryY + H*.014, H*.104, 0.20);
  }

  // the ledger
  census(pen, g, W, H, place);
  const hallN  = place.filter(p=>p==="hall").length;
  const storeN = place.filter(p=>p==="store").length;
  header(pen, g, W, H, hallN, storeN);
}

/* ---------------- the asset ---------------- */

export const asset = {
  id:"prop.palace-weapon-collection",
  type:"PROP",
  name:"Palace Weapon Collection",
  statusWord:"MOVING",
  scene:"OD-B19-S01",

  params,
  layers:["zone-brackets","door-frame","door-leaf","hall-pieces","transit",
          "store-pieces","audit-ticks","bolt-seal","census-rail","totals"],

  // normalized 0..1 anchors, measured in the TRANSIT state
  anchors:{
    "grip:shield":   {x:.11, y:.268},   // a hand closing on the first shield in the hall
    "grip:spear":    {x:.08, y:.428},
    "grip:helmet":   {x:.11, y:.585},
    "grip:corselet": {x:.15, y:.740},
    carry:           {x:.30, y:.560},   // balance point of one armful
    "threshold:door":{x:.50, y:.820},   // where a carrier crosses
    "lock:staple":   {x:.55, y:.500},   // where the bolt is shot
    "store:floor":   {x:.76, y:.815},   // where a piece is set down inside
    "contact:floor": {x:.50, y:.820},
    "census:ledger": {x:.50, y:.875},   // the count itself, addressable
    "count:hall":    {x:.19, y:.121},
    "count:store":   {x:.78, y:.121},
  },
  // collision: the whole transfer footprint, hall wall to store wall
  collision:{ kind:"box", a:{x:.05, y:.09}, b:{x:.95, y:.90} },
  ownership:"house-of-odysseus · storeroom key held by Eurycleia; route known to Melanthius",

  states:{
    initial:"displayed",
    nodes:{
      displayed:{ preview:{ mode:"displayed", status:"DISPLAYED", progress:0.08 } },
      counted:  { preview:{ mode:"counted",   status:"COUNTED",   progress:0.24 } },
      transit:  { preview:{ mode:"transit",   status:"MOVING",    progress:0.52 } },
      stored:   { preview:{ mode:"stored",    status:"STORED",    progress:0.78 } },
      sealed:   { preview:{ mode:"sealed",    status:"LOCKED",    progress:0.92 } },
      short:    { preview:{ mode:"short",     status:"SHORT",     progress:1.00 } },
    },
    edges:[
      ["displayed","counted"],["counted","transit"],["transit","stored"],
      ["stored","sealed"],["sealed","short"],["short","sealed"],
      ["transit","counted"],["sealed","stored"],["stored","displayed"],
    ],
  },
  channels:["mode","moved","missing","t","progress"],

  // CARD SIGNATURE — MOVING: the night carry caught mid-count. Pieces on both
  // sides of the threshold, one spear in the door, the census rail half filled.
  // Sixteen going out; in Book XXII only fourteen answer the roll.
  preview:()=>({ mode:"transit", status:"MOVING", progress:0.52, t:0 }),

  draw(ctx, W, H, state){
    draw(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
