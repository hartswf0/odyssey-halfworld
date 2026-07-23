/* creature.black-bulls-and-altar-fires — sacrificial herd + ritual fire.
   CREATURE asset. Quadruped BULLS (NOT humanoid): fully custom geometry on
   engine primitives — four sturdy hoofed legs (upper/lower segments + hoof
   blocks), thick neck, broad blunt head with jaw + gaze eye, and a pair of
   curving horns; a heavy shoulder hump marks the beast as a bull. Bodies are
   "black" (dark ink) so the pale bone horns read against them. Beside the
   herd stands a stone ALTAR whose fire + smoke are fully procedural and
   ANIMATE over state.t (flame tongues waver, smoke plumes rise). States:
   graze / led / slaughter, plus a feast transition (a spit set over the
   high fire). Drawn in SOLID grays + hard contour; the engine POST pass
   supplies the dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B03-S01 — sacrificial herd + procedural fire, smoke, ritual
   handling, feast transition. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});

/* ---- tone levels (flat grays; POST turns them into dots) ----
   "Black" bulls read as a deep mid-gray (inkLevel 4) so the dot texture and
   internal contour survive; pale bone horns (level 2) pop against them. */
const T_BODY   = ()=> toneSolid(inkLevel(4));   // black bull hide (mid-gray under POST)
const T_HUMP   = ()=> toneSolid(inkLevel(5));   // shoulder hump, a shade deeper
const T_NEARLEG= ()=> toneSolid(inkLevel(4));
const T_FARLEG = ()=> toneSolid(inkLevel(5));
const T_HOOF   = ()=> toneSolid(inkLevel(6));   // hard dark hoof
const T_HORN   = ()=> toneSolid(inkLevel(5));   // dark horn, reads against paper sky
const T_EAR    = ()=> toneSolid(inkLevel(5));
const T_MUZZLE = ()=> toneSolid(inkLevel(3));   // lighter blunt muzzle
const T_TAIL   = ()=> toneSolid(inkLevel(4));
const T_TUFT   = ()=> toneSolid(inkLevel(5));

const T_ALTAR  = ()=> toneSolid(inkLevel(3));   // stone
const T_ALTARTOP=()=> toneSolid(inkLevel(4));
const T_LOG    = ()=> toneSolid(inkLevel(6));
const T_FLAME  = ()=> toneSolid(inkLevel(4));
const T_FLAMEC = ()=> toneSolid(inkLevel(2));   // pale flame core
const T_SMOKE  = ()=> toneSolid(inkLevel(2));
const T_SPIT   = ()=> toneSolid(inkLevel(6));

/* ================= BULL ================= */
/* one sturdy hoofed leg: two segments + a blocky hoof */
function drawLeg(pen, hip, knee, foot, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.86);
  // hoof block
  pen.paint(()=>{
    g.moveTo(foot.x - w*0.62, foot.y - w*0.30);
    g.lineTo(foot.x + w*0.62, foot.y - w*0.30);
    g.lineTo(foot.x + w*0.52, foot.y + w*0.34);
    g.lineTo(foot.x - w*0.52, foot.y + w*0.34);
    g.closePath();
  }, T_HOOF(), 3.5);
}

/* broad bull head: skull, blunt muzzle/jaw, pair of curving horns, ear, eye */
function drawHead(pen, HC, hr, dir, U, { gaze=0 }={}){
  const g = pen.ctx;
  const rx = hr, ry = hr*0.82;

  // ---- bull HORN: bold tapering shape sweeping up + forward with a lyre bow.
  //      fwd shifts the tip forward; back offsets the base along the crown. ----
  const horn = (fwd, back, tone, lw)=>{
    const baseB = P(HC.x + dir*(rx*0.02+back), HC.y - ry*0.52);   // back of base at poll
    const baseF = P(HC.x + dir*(rx*0.42+back), HC.y - ry*0.58);   // front of base
    const tip   = P(HC.x + dir*(rx*0.22+fwd),  HC.y - ry*1.95);   // sharp tip, high
    pen.paint(()=>{
      g.moveTo(baseB.x, baseB.y);
      g.quadraticCurveTo(HC.x + dir*(rx*0.02+back), HC.y - ry*1.30, tip.x, tip.y);  // inner edge up to tip
      g.quadraticCurveTo(HC.x + dir*(rx*0.95+fwd), HC.y - ry*1.05, baseF.x, baseF.y); // outer bow down
      g.quadraticCurveTo(HC.x + dir*rx*0.24, HC.y - ry*0.42, baseB.x, baseB.y);       // base cap
      g.closePath();
    }, tone, lw);
  };
  horn(-rx*0.18, -dir*rx*0.10, toneSolid(inkLevel(4)), 3.5);   // far horn (behind, dimmer, less forward)

  // ---- neck-to-jaw blunt muzzle (front of head) ----
  const mTip = P(HC.x + dir*(rx*0.72), HC.y + ry*0.34);
  pen.paint(()=>{
    g.moveTo(HC.x + dir*rx*0.30, HC.y - ry*0.34);                       // brow ridge
    g.quadraticCurveTo(HC.x + dir*rx*0.92, HC.y - ry*0.18, mTip.x, mTip.y - ry*0.06); // nose bridge -> tip
    g.quadraticCurveTo(mTip.x + dir*rx*0.10, mTip.y + ry*0.30, mTip.x - dir*rx*0.04, mTip.y + ry*0.46); // muzzle front
    g.quadraticCurveTo(HC.x + dir*rx*0.60, HC.y + ry*0.86, HC.x + dir*rx*0.02, HC.y + ry*0.80); // heavy jaw
    g.closePath();
  }, T_MUZZLE(), 4);

  // ---- skull (broad) ----
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, rx, ry, 0, 0, 7); }, T_BODY(), 4);

  // ---- forelock tuft between horns ----
  pen.paint(()=>{ g.ellipse(HC.x, HC.y - ry*0.66, rx*0.34, ry*0.30, 0, 0, 7); }, T_HUMP(), 3);

  // ---- ear (below near horn, out to the side) ----
  pen.paint(()=>{
    g.moveTo(HC.x - dir*rx*0.10, HC.y - ry*0.22);
    g.quadraticCurveTo(HC.x - dir*rx*0.72, HC.y - ry*0.30, HC.x - dir*rx*0.66, HC.y + ry*0.14);
    g.quadraticCurveTo(HC.x - dir*rx*0.40, HC.y + ry*0.06, HC.x - dir*rx*0.06, HC.y + ry*0.10);
    g.closePath();
  }, T_EAR(), 3.5);

  // ---- NEAR horn (over skull, bolder, swept forward) ----
  horn(rx*0.20, dir*rx*0.10, T_HORN(), 4);

  // ---- eye (gaze) ----
  const eye = P(HC.x + dir*rx*0.40, HC.y - ry*0.06 + gaze*ry*0.30);
  g.fillStyle = INK; g.beginPath(); g.ellipse(eye.x, eye.y, rx*0.13, rx*0.10, 0, 0, 7); g.fill();
  // ---- nostril ----
  g.beginPath(); g.ellipse(mTip.x - dir*rx*0.02, mTip.y + ry*0.14, rx*0.10, rx*0.07, 0.4*dir, 0, 7); g.fill();
  // ---- mouth line ----
  pen.ink(()=>{
    g.moveTo(mTip.x - dir*rx*0.04, mTip.y + ry*0.44);
    g.lineTo(HC.x + dir*rx*0.24, HC.y + ry*0.60);
  }, 2.5);
}

/* one bull. headDrop 0=head raised, 1=grazing to ground. lead=draw handler rope */
function drawBull(pen, cx, groundY, S, dir, { headDrop=0, lead=0, t=0, walk=0 }={}){
  const g = pen.ctx;
  const U = S*0.25;
  const back = S*0.185;                          // withers height above ground
  const shoulderX = cx + dir*U*0.40;
  const hipX      = cx - dir*U*0.46;

  // gait sway (subtle, for "led")
  const ph = t*3;
  const sw = walk ? Math.sin(ph)*U*0.10 : 0;
  const sw2= walk ? Math.sin(ph+Math.PI)*U*0.10 : 0;

  // ---- ground shadow ----
  g.save(); g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, groundY+5, U*0.92, U*0.16, 0, 0, 7); g.fill(); g.restore();

  // ---- tail (behind rear, thin with a tuft) ----
  const tb = P(hipX - dir*U*0.20, groundY - back*0.92);
  const tt = P(hipX - dir*U*0.30, groundY - back*0.18);
  pen.limb(()=>{ g.moveTo(tb.x,tb.y);
    g.quadraticCurveTo(hipX - dir*U*0.40, groundY - back*0.55, tt.x, tt.y); }, T_TAIL(), U*0.06);
  pen.paint(()=>{ g.ellipse(tt.x, tt.y + back*0.05, U*0.09, back*0.16, 0.2*dir, 0, 7); }, T_TUFT(), 3);

  // ---- FAR legs (drawn first, deepest tone) ----
  const foff = dir*U*0.06;
  drawLeg(pen, P(shoulderX-foff, groundY-back*0.70), P(shoulderX-foff+dir*U*0.02, groundY-back*0.36),
          P(shoulderX-foff+dir*U*0.03 - sw2, groundY), U*0.13, T_FARLEG());
  drawLeg(pen, P(hipX-foff, groundY-back*0.68), P(hipX-foff+dir*U*0.03, groundY-back*0.36),
          P(hipX-foff+dir*U*0.02 - sw, groundY), U*0.13, T_FARLEG());

  // ---- key torso points ----
  const wither = P(shoulderX + dir*U*0.06, groundY - back*1.06);   // hump peak
  const croup  = P(hipX + dir*U*0.06,      groundY - back*0.92);
  const rump   = P(hipX - dir*U*0.16,      groundY - back*0.62);
  const bellyR = P(hipX + dir*U*0.06,      groundY - back*0.40);
  const bellyF = P(shoulderX - dir*U*0.02, groundY - back*0.36);
  const chest  = P(shoulderX + dir*U*0.30, groundY - back*0.56);

  // ---- torso ----
  pen.paint(()=>{
    g.moveTo(chest.x, chest.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.22, wither.y - back*0.02, wither.x, wither.y);  // chest -> withers hump
    g.quadraticCurveTo(cx + dir*U*0.02, groundY - back*0.86, croup.x, croup.y);            // dip along back
    g.quadraticCurveTo(hipX - dir*U*0.16, croup.y + back*0.02, rump.x, rump.y);            // croup -> rump
    g.quadraticCurveTo(hipX - dir*U*0.06, bellyR.y, bellyR.x, bellyR.y);                   // rump -> belly rear
    g.quadraticCurveTo(cx, bellyR.y + back*0.08, bellyF.x, bellyF.y);                      // deep belly
    g.quadraticCurveTo(shoulderX + dir*U*0.14, bellyF.y - back*0.02, chest.x, chest.y);    // brisket -> chest
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- shoulder hump (deepest tone lump over withers) ----
  pen.paint(()=>{ g.ellipse(wither.x - dir*U*0.02, wither.y + back*0.10, U*0.24, back*0.26, -0.3*dir, 0, 7); }, T_HUMP(), 3.5);

  // ---- neck wedge from chest/withers to head ----
  const HCraise = P(shoulderX + dir*U*0.60, groundY - back*1.18);
  const HCgraze = P(shoulderX + dir*U*0.66, groundY - back*0.34);
  const HC = P(lerp(HCraise.x, HCgraze.x, headDrop), lerp(HCraise.y, HCgraze.y, headDrop));
  const hr = U*0.34;
  pen.paint(()=>{
    g.moveTo(wither.x + dir*U*0.02, wither.y + back*0.04);                        // crest at withers
    g.quadraticCurveTo(HC.x - dir*hr*0.6, HC.y - hr*0.5, HC.x - dir*hr*0.1, HC.y - hr*0.35); // crest to poll
    g.lineTo(HC.x + dir*hr*0.5, HC.y + hr*0.55);                                  // throat at head
    g.quadraticCurveTo(chest.x + dir*U*0.10, chest.y - back*0.04, chest.x, chest.y); // dewlap throat -> chest
    g.closePath();
  }, T_BODY(), 4.5);
  // dewlap fold
  pen.ink(()=>{ g.moveTo(HC.x + dir*hr*0.4, HC.y + hr*0.5);
    g.quadraticCurveTo(chest.x + dir*U*0.18, chest.y + back*0.06, chest.x + dir*U*0.02, chest.y + back*0.02); }, 2.5);

  // ---- head ----
  drawHead(pen, HC, hr, dir, U, { gaze: headDrop*0.4 });

  // ---- lead rope (ritual handling): from muzzle up-forward off frame ----
  if (lead){
    pen.ink(()=>{
      g.moveTo(HC.x + dir*hr*0.60, HC.y + hr*0.30);
      g.quadraticCurveTo(HC.x + dir*U*0.55, HC.y - back*0.30, HC.x + dir*U*0.95, HC.y - back*0.55);
    }, 2.5);
  }

  // ---- NEAR legs (over body) ----
  drawLeg(pen, P(shoulderX, groundY-back*0.70), P(shoulderX+dir*U*0.03, groundY-back*0.36),
          P(shoulderX+dir*U*0.04 + sw, groundY), U*0.15, T_NEARLEG());
  drawLeg(pen, P(hipX, groundY-back*0.68), P(hipX+dir*U*0.04, groundY-back*0.36),
          P(hipX+dir*U*0.03 + sw2, groundY), U*0.15, T_NEARLEG());
}

/* ================= ALTAR + FIRE ================= */
function drawAltar(pen, ax, groundY, S, t, intensity, feast){
  const g = pen.ctx;
  const aw = S*0.22, ah = S*0.20;
  const topY = groundY - ah;

  // ---- SMOKE (behind flames, rising, wavering) : draw first so flame overlaps ----
  const nS = 5;
  for(let i=0;i<nS;i++){
    const f = (i+ (t*0.35)%1)/nS;                 // 0..1 climb
    const climb = f;
    const y = topY - ah*0.4 - climb*(S*0.55*intensity + S*0.10);
    const x = ax + Math.sin(t*1.1 + i*1.7)*aw*0.30*(0.4+climb);
    const r = (aw*0.10 + climb*aw*0.42) * (0.5+intensity*0.6);
    const alpha = (1-climb)*0.9;
    g.save(); g.globalAlpha = alpha;
    pen.paint(()=>{ g.ellipse(x, y, r, r*0.8, 0, 0, 7); }, T_SMOKE(), 2.5);
    g.restore();
  }

  // ---- LOGS at the fire base ----
  pen.paint(()=>{ g.moveTo(ax-aw*0.6, topY-2); g.lineTo(ax+aw*0.6, topY-2);
    g.lineTo(ax+aw*0.5, topY-ah*0.14); g.lineTo(ax-aw*0.5, topY-ah*0.14); g.closePath(); }, T_LOG(), 4);
  pen.ink(()=>{ g.moveTo(ax-aw*0.3, topY-2); g.lineTo(ax+aw*0.36, topY-ah*0.12); }, 2.5);

  // ---- FLAME tongues (procedural, waver over t) ----
  const flameH = S*(0.14 + 0.34*intensity);
  const tongues = [
    { off:-aw*0.34, h:0.72, sp:6.0, ph:0.0 },
    { off:-aw*0.12, h:1.00, sp:5.2, ph:1.3 },
    { off: aw*0.12, h:0.88, sp:6.6, ph:2.6 },
    { off: aw*0.34, h:0.66, sp:5.8, ph:0.7 },
  ];
  const flame = (o, hf, sp, phz, tone, wf)=>{
    const baseY = topY - ah*0.06;
    const bx = ax + o;
    const h = flameH*hf;
    const sway = Math.sin(t*sp + phz)*aw*0.16*hf;
    const flick = 0.85 + 0.30*Math.sin(t*sp*1.7 + phz*2);
    const tipY = baseY - h*flick;
    const wbase = aw*0.16*wf;
    pen.paint(()=>{
      g.moveTo(bx - wbase, baseY);
      g.quadraticCurveTo(bx - wbase*1.1 + sway*0.4, baseY - h*0.5, bx + sway, tipY);      // left up to tip
      g.quadraticCurveTo(bx + wbase*1.1 + sway*0.4, baseY - h*0.5, bx + wbase, baseY);    // tip down right
      g.quadraticCurveTo(bx, baseY + h*0.06, bx - wbase, baseY);                          // rounded base
      g.closePath();
    }, tone, wf>0.9?3.5:3);
  };
  // outer flames
  for(const T of tongues) flame(T.off, T.h, T.sp, T.ph, T_FLAME(), 1.0);
  // bright inner cores
  for(const T of tongues) flame(T.off, T.h*0.62, T.sp*1.05, T.ph+0.5, T_FLAMEC(), 0.55);

  // ---- feast: a spit/skewer set across the fire ----
  if (feast){
    const sy = topY - flameH*0.42;
    // forked uprights
    pen.paint(()=>{ g.rect(ax-aw*0.72, sy-4, aw*0.10, ah*0.9); }, T_SPIT(), 3.5);
    pen.paint(()=>{ g.rect(ax+aw*0.62, sy-4, aw*0.10, ah*0.9); }, T_SPIT(), 3.5);
    // the spit bar
    pen.limb(()=>{ g.moveTo(ax-aw*0.80, sy); g.lineTo(ax+aw*0.80, sy); }, T_SPIT(), S*0.014);
    // roasting portion threaded on it
    pen.paint(()=>{ g.ellipse(ax, sy, aw*0.30, ah*0.16, 0, 0, 7); }, toneSolid(inkLevel(5)), 3.5);
  }

  // ---- ALTAR stone block (front) ----
  pen.paint(()=>{ g.rect(ax-aw*0.72, topY, aw*1.44, ah); }, T_ALTAR(), 5);
  // top slab
  pen.paint(()=>{ g.rect(ax-aw*0.82, topY-ah*0.10, aw*1.64, ah*0.14); }, T_ALTARTOP(), 4);
  // masonry seams
  pen.ink(()=>{ g.moveTo(ax-aw*0.72, topY+ah*0.5); g.lineTo(ax+aw*0.72, topY+ah*0.5); }, 2.5);
  pen.ink(()=>{ g.moveTo(ax, topY+ah*0.10); g.lineTo(ax, topY+ah*0.5); }, 2.5);
  pen.ink(()=>{ g.moveTo(ax-aw*0.36, topY+ah*0.5); g.lineTo(ax-aw*0.36, topY+ah); }, 2.5);
  pen.ink(()=>{ g.moveTo(ax+aw*0.36, topY+ah*0.5); g.lineTo(ax+aw*0.36, topY+ah); }, 2.5);
}

/* ================= SCENE ================= */
/* per-state layout: which bulls (x, headDrop, lead, walk) + fire intensity + feast */
function layoutFor(state){
  const pose = state.pose || "rite";
  switch(pose){
    case "graze":
      return { bulls:[
        {x:0.19, headDrop:1.0}, {x:0.45, headDrop:0.9}, {x:0.71, headDrop:1.0},
      ], intensity:0.22, feast:false, altarX:0.92 };
    case "led":
      return { bulls:[
        {x:0.21, headDrop:0.95}, {x:0.52, headDrop:0.15, lead:1, walk:1},
      ], intensity:0.55, feast:false, altarX:0.84 };
    case "slaughter":
      return { bulls:[
        {x:0.21, headDrop:1.0}, {x:0.56, headDrop:0.72, lead:1},
      ], intensity:0.92, feast:false, altarX:0.85 };
    case "feast":
      return { bulls:[
        {x:0.21, headDrop:1.0},
      ], intensity:1.0, feast:true, altarX:0.60 };
    default: // "rite" — neutral: herd + one led toward the kindled altar
      return { bulls:[
        {x:0.20, headDrop:0.95}, {x:0.48, headDrop:0.15, lead:1},
      ], intensity:0.62, feast:false, altarX:0.84 };
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const S = Math.min(W, H) * 0.74;
  const groundY = H*0.64;
  const t = state.t || 0;
  const L = layoutFor(state);

  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, groundY+2); ctx.lineTo(W*0.97, groundY+2); ctx.stroke(); ctx.restore();

  // altar + fire first (bulls stand in front of / beside it, facing +x toward it)
  drawAltar(pen, W*L.altarX, groundY, S, t, L.intensity, L.feast);

  // herd — all face +x (toward the altar)
  for(const b of L.bulls){
    drawBull(pen, W*b.x, groundY, S, +1, { headDrop:b.headDrop||0, lead:b.lead||0, walk:b.walk||0, t });
  }
}

export const asset = {
  id:"creature.black-bulls-and-altar-fires",
  type:"CREATURE",
  name:"Black bulls and altar fires",
  statusWord:"SACRIFICIAL",
  scene:"OD-B03-S01",

  // procedural knobs
  params:{
    herd:3,               // members available in the herd
    hide:"#1a1a1a",       // black bull hide
    hornBone:"#dcdccf",   // pale horn
    hump:1.0,             // shoulder-hump prominence
    fireIntensity:0.62,   // 0..1 default altar-fire height
    smoke:1.0,            // smoke plume density
  },
  // back -> front draw order (altar/fire behind; each bull layered internally)
  layers:["ground","smoke","logs","flames","flame-core","spit","altar",
          "shadow","tail","far-legs","body","hump","neck","far-horn","head","ear","near-horn","eye","near-legs"],
  // normalized 0..1 attachment / attention / handling anchors
  anchors:{
    "altar:top":{x:.82,y:.52}, "fire:core":{x:.82,y:.50}, "smoke:vent":{x:.82,y:.20},
    "bull:lead-head":{x:.55,y:.52}, "bull:lead-rope":{x:.70,y:.40},
    "bull:graze-head":{x:.30,y:.66}, "herd:center":{x:.35,y:.58},
    "handler:priest":{x:.72,y:.72}, "camera:rite":{x:.55,y:.55},
  },
  // hoofprint footprints for placement / pathing / collision
  zones:{
    "herd:graze":{ x0:.06,y0:.60,x1:.60,y1:.86 },
    "altar:precinct":{ x0:.62,y0:.48,x1:.98,y1:.86 },
    walkable:{ x0:.04,y0:.66,x1:.96,y1:.90 },
  },
  states:{
    initial:"rite",
    nodes:{
      rite:{      preview:{ pose:"rite", t:0.6 } },      // herd + one led to the kindled altar
      graze:{     preview:{ pose:"graze", t:0.2 } },     // herd at pasture, altar embers
      led:{       preview:{ pose:"led", t:0.7 } },       // a bull led toward the building fire (animate t)
      slaughter:{ preview:{ pose:"slaughter", t:1.1 } }, // bull at the altar, fire high
      feast:{     preview:{ pose:"feast", t:1.4 } },     // spit set over the high fire
    },
    edges:[
      ["graze","rite"],["rite","led"],["led","slaughter"],
      ["slaughter","feast"],["feast","graze"],["led","graze"],
    ],
  },
  channels:["pose","fire","smoke","gaze","gait","lead"],

  preview:()=>({ pose:"rite", t:0.6, status:"SACRIFICIAL", progress:.3 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
