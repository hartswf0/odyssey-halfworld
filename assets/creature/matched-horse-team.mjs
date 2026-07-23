/* creature.matched-horse-team — paired full-maned draft horses in harness.
   CREATURE asset. Two quadruped horses (NOT humanoid): fully custom geometry
   built from engine primitives — articulated fore/hind legs (upper + cannon +
   hoof), an arched crested neck + long head with erect ears and muzzle, a
   flowing mane along the crest + streaming tail, and a fitted harness (collar,
   surcingle back-strap, trace line, bridle + rein). The pair is drawn as a
   matched team: a FAR horse (behind, darker) and a NEAR horse (fore, mid-tone),
   both facing the same way so they read as yoked together. Locomotion states
   walk / trot / gallop / halt / fatigue drive stride spread, knee lift, neck
   arch and head carriage. Drawn in SOLID grays + hard contour; the engine POST
   pass supplies the dot-matrix halftone.
   Atlas: OD-B03-S06 — paired full-maned horses with harness; walk/trot/gallop/halt/fatigue. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const norm = (x,y)=>{ const n=Math.hypot(x,y)||1; return {x:x/n,y:y/n}; };

/* ---- gait / carriage config per locomotion state ----
   Each leg entry = { dx, lift } where dx is the foot's horizontal offset
   (fraction of U, +dir = forward) and lift raises the hoof off the ground.
   Legs: FN fore-near, FF fore-far, HN hind-near, HF hind-far. */
function gait(pose){
  switch(pose){
    case "walk": return {
      FN:{dx: 0.16, lift:0.02}, FF:{dx:-0.12, lift:0.00},
      HN:{dx:-0.14, lift:0.00}, HF:{dx: 0.14, lift:0.03},
      neckArch:0.92, headDrop:0.06, backSag:0.02, tailStream:0.10, anim:1.0, speed:3.4 };
    case "trot": return {
      FN:{dx: 0.20, lift:0.14}, FF:{dx:-0.14, lift:0.00},
      HN:{dx:-0.16, lift:0.00}, HF:{dx: 0.18, lift:0.14},
      neckArch:1.00, headDrop:0.00, backSag:-0.02, tailStream:0.32, anim:1.0, speed:5.0 };
    case "gallop": return {
      FN:{dx: 0.30, lift:0.10}, FF:{dx: 0.44, lift:0.16},
      HN:{dx:-0.40, lift:0.10}, HF:{dx:-0.30, lift:0.06},
      neckArch:0.78, headDrop:0.14, backSag:0.05, tailStream:0.70, anim:0.7, speed:6.5, lower:0.06 };
    case "fatigue": return {
      FN:{dx: 0.02, lift:0.00}, FF:{dx:-0.04, lift:0.00},
      HN:{dx:-0.16, lift:0.06}, HF:{dx:-0.04, lift:0.00},   // one hind cocked, resting
      neckArch:0.40, headDrop:0.55, backSag:0.10, tailStream:0.02, anim:0.25, speed:1.4, weary:1 };
    default: /* halt */ return {
      FN:{dx: 0.06, lift:0.00}, FF:{dx:-0.06, lift:0.00},
      HN:{dx:-0.10, lift:0.00}, HF:{dx: 0.04, lift:0.00},
      neckArch:0.98, headDrop:0.02, backSag:0.00, tailStream:0.06, anim:0.35, speed:1.6 };
  }
}

/* ---- one articulated horse leg: upper + cannon + hoof ---- */
function drawLeg(pen, top, len, cfg, U, dir, tone, hoofTone, wUpper){
  const g = pen.ctx;
  const footX = top.x + dir*U*cfg.dx;
  const footY = top.y + len - U*cfg.lift;
  // knee/hock sits between, pushed a touch toward the stride direction
  const kx = top.x + (footX-top.x)*0.46 + dir*U*0.03;
  const ky = top.y + len*0.52;
  const knee = P(kx, ky);
  const foot = P(footX, footY);
  pen.limb(()=>{ g.moveTo(top.x,top.y); g.lineTo(knee.x,knee.y); }, tone, wUpper);         // upper (arm/thigh)
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, wUpper*0.62);  // cannon
  // fetlock + hoof block
  pen.paint(()=>{
    g.moveTo(foot.x - dir*wUpper*0.34, foot.y - wUpper*0.30);
    g.lineTo(foot.x + dir*wUpper*0.50, foot.y - wUpper*0.30);
    g.lineTo(foot.x + dir*wUpper*0.42, foot.y + wUpper*0.10);
    g.lineTo(foot.x - dir*wUpper*0.34, foot.y + wUpper*0.10);
    g.closePath();
  }, hoofTone, 3);
  return foot;
}

/* ---- head: long skull + tapering muzzle, erect ears, forelock, eye ---- */
function drawHead(pen, HC, rx, ry, dir, U, cfg, tone, maneTone, harness){
  const g = pen.ctx;
  // face direction: down-forward, more vertical when neck arched, drooping when weary
  const droop = cfg.headDrop;
  const fd = norm(dir*(0.55+droop*0.5), 0.85+droop*0.6);
  const headLen = U*0.60;
  const muzzle = P(HC.x + fd.x*headLen, HC.y + fd.y*headLen);
  // perpendicular for muzzle width
  const px = -fd.y, py = fd.x;
  // ---- muzzle / long face (from skull to nose) ----
  pen.paint(()=>{
    g.moveTo(HC.x + px*rx*0.62, HC.y + py*rx*0.62);
    g.lineTo(muzzle.x + px*rx*0.30, muzzle.y + py*rx*0.30);
    g.lineTo(muzzle.x - px*rx*0.26, muzzle.y - py*rx*0.26);
    g.lineTo(HC.x - px*rx*0.70, HC.y - py*rx*0.70);
    g.closePath();
  }, tone, 4);
  // ---- skull ----
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, rx, ry, 0, 0, 7); }, tone, 4);
  // ---- ears (erect, at poll) ----
  const poll = P(HC.x - fd.x*ry*0.55, HC.y - fd.y*ry*0.95);
  const earL = ry*0.95;
  const ear = (spread)=>{
    const bx = poll.x - dir*rx*0.10 + spread;
    pen.paint(()=>{
      g.moveTo(bx - rx*0.16, poll.y);
      g.lineTo(bx + rx*0.16, poll.y);
      g.lineTo(bx + dir*rx*0.02, poll.y - earL);
      g.closePath();
    }, maneTone, 3);
  };
  ear(-dir*rx*0.16); ear(dir*rx*0.12);
  // ---- forelock (tuft between ears down the brow) ----
  pen.paint(()=>{
    g.moveTo(poll.x - rx*0.10, poll.y);
    g.quadraticCurveTo(poll.x + dir*rx*0.30, poll.y + ry*0.55, poll.x + dir*rx*0.05, poll.y + ry*0.85);
    g.quadraticCurveTo(poll.x + dir*rx*0.02, poll.y + ry*0.35, poll.x + rx*0.14, poll.y);
    g.closePath();
  }, maneTone, 3);
  // ---- eye ----
  const eye = P(HC.x + dir*rx*0.34, HC.y - ry*0.06);
  g.fillStyle = INK; g.beginPath(); g.ellipse(eye.x, eye.y, rx*0.13, rx*0.11, 0, 0, 7); g.fill();
  // ---- nostril + mouth crease ----
  g.beginPath(); g.ellipse(muzzle.x - px*rx*0.04, muzzle.y - py*rx*0.04, rx*0.11, rx*0.08, 0, 0, 7); g.fill();
  pen.ink(()=>{ g.moveTo(muzzle.x + px*rx*0.14, muzzle.y + py*rx*0.14);
                g.lineTo(muzzle.x + px*rx*0.30 - fd.x*rx*0.2, muzzle.y + py*rx*0.30 - fd.y*rx*0.2); }, 2.2);
  // ---- bridle strap + rein (harness) ----
  if (harness){
    const cheek = P(HC.x + dir*rx*0.5, HC.y + ry*0.2);
    pen.ink(()=>{ g.moveTo(poll.x + dir*rx*0.1, poll.y+ry*0.1); g.lineTo(cheek.x, cheek.y);
                  g.lineTo(muzzle.x - px*rx*0.1, muzzle.y - py*rx*0.1); }, 3);
    // noseband
    pen.ink(()=>{ g.moveTo(muzzle.x + px*rx*0.5 - fd.x*rx*0.6, muzzle.y + py*rx*0.5 - fd.y*rx*0.6);
                  g.lineTo(muzzle.x - px*rx*0.5 - fd.x*rx*0.6, muzzle.y - py*rx*0.5 - fd.y*rx*0.6); }, 3);
    return { rein: cheek };
  }
  return { rein: null };
}

/* ---- one full horse ---- */
function drawHorse(pen, cx, groundY, S, dir, pose, t, tint, harness){
  const g = pen.ctx;
  const cfg = gait(pose);
  const U = S*0.30;
  const anim = Math.sin(t*cfg.speed) * cfg.anim;
  const anim2 = Math.sin(t*cfg.speed + Math.PI) * cfg.anim;

  const backH = S*(0.30 - (cfg.lower||0));
  const shoulderX = cx + dir*U*0.46;
  const hipX      = cx - dir*U*0.48;
  const withersY  = groundY - backH;
  const sag = backH*cfg.backSag;
  const croupY = groundY - backH*0.96 + sag;
  const bellyY = groundY - S*0.115 + sag*0.5;

  // tone set (far team darker so it sits back)
  const body  = toneSolid(inkLevel(tint.body));
  const legN  = toneSolid(inkLevel(tint.legN));
  const legF  = toneSolid(inkLevel(tint.legF));
  const hoof  = toneSolid(inkLevel(7));
  const mane  = toneSolid(inkLevel(tint.mane));
  const strap = toneSolid(inkLevel(7));

  // ---- ground shadow ----
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+5, U*0.95, U*0.16, 0, 0, 7); g.fill(); g.restore();

  // ---- full flowing tail (behind rump) ----
  const stream = cfg.tailStream;
  const tailBase = P(hipX - dir*U*0.12, croupY + backH*0.04);
  const sway = Math.sin(t*cfg.speed*0.8)*U*0.05;
  const td = norm(-dir*(0.30 + stream*1.2), 1.0 - stream*0.72);           // hang -> stream back
  const tailLen = U*(0.95 + stream*0.25);
  const tip = P(tailBase.x + td.x*tailLen + sway, tailBase.y + td.y*tailLen);
  const perp = { x:-td.y, y:td.x };
  const w0 = U*0.17;                                                       // fullness at the dock
  const mid = P(lerp(tailBase.x,tip.x,0.5) + perp.x*U*0.10*dir + sway*0.5,
                lerp(tailBase.y,tip.y,0.5) + perp.y*U*0.10);
  pen.paint(()=>{
    g.moveTo(tailBase.x + perp.x*w0, tailBase.y + perp.y*w0);
    g.quadraticCurveTo(mid.x + perp.x*w0*0.7, mid.y + perp.y*w0*0.7, tip.x, tip.y);   // near/outer edge
    g.quadraticCurveTo(mid.x - perp.x*w0*0.8, mid.y - perp.y*w0*0.8,
                       tailBase.x - perp.x*w0, tailBase.y - perp.y*w0);              // far/inner edge
    g.closePath();
  }, mane, 4);
  // a couple of strand seams for flow
  pen.ink(()=>{ g.moveTo(tailBase.x, tailBase.y); g.quadraticCurveTo(mid.x, mid.y, tip.x, tip.y); }, 2.2);

  // ---- FAR legs (drawn first, darker) : fore + hind ----
  const legLen = groundY - bellyY + S*0.12;
  const foreTop = P(shoulderX, bellyY - S*0.02);
  const hindTop = P(hipX + dir*U*0.02, bellyY - S*0.03);
  const wUpper = U*0.155;
  drawLeg(pen, P(foreTop.x - dir*U*0.05, foreTop.y), legLen, cfg.FF, U, dir, legF, toneSolid(inkLevel(7)), wUpper*0.92);
  drawLeg(pen, P(hindTop.x - dir*U*0.05, hindTop.y), legLen, cfg.HF, U, dir, legF, toneSolid(inkLevel(7)), wUpper*0.92);

  // ---- barrel / torso ----
  const chestTopX = shoulderX + dir*U*0.30;
  pen.paint(()=>{
    g.moveTo(shoulderX + dir*U*0.30, withersY + backH*0.10);            // base of neck (chest top)
    g.quadraticCurveTo(shoulderX + dir*U*0.10, withersY - backH*0.02, shoulderX, withersY); // withers
    g.quadraticCurveTo(cx, withersY - backH*0.01 + sag*0.6, hipX, croupY); // back -> croup
    g.quadraticCurveTo(hipX - dir*U*0.22, croupY + backH*0.24, hipX - dir*U*0.06, groundY - S*0.10); // rump curve
    g.quadraticCurveTo(hipX + dir*U*0.10, bellyY + S*0.01, cx, bellyY);   // belly rear
    g.quadraticCurveTo(shoulderX - dir*U*0.02, bellyY - S*0.005, shoulderX + dir*U*0.22, groundY - S*0.16); // belly -> chest bottom
    g.quadraticCurveTo(shoulderX + dir*U*0.36, withersY + backH*0.42, shoulderX + dir*U*0.30, withersY + backH*0.10); // chest front
    g.closePath();
  }, body, 4.5);

  // ---- neck (slim arched crest) up to head ----
  const arch = cfg.neckArch;
  const HC = P(shoulderX + dir*U*(0.58 + arch*0.12), withersY - backH*(arch*0.34) + backH*cfg.headDrop*1.05);
  const rx = U*0.15, ry = U*0.13;
  const crestRoot  = P(shoulderX - dir*U*0.02, withersY - backH*0.03);   // top of neck at withers
  const throatRoot = P(shoulderX + dir*U*0.32, withersY + backH*0.10);   // base of throat at chest
  // crest control (upper/back edge apex) and throat control (front edge)
  const crestCtl = P(shoulderX + dir*U*0.26, withersY - backH*(0.20+arch*0.20));
  const poll = P(HC.x - dir*rx*0.15, HC.y - ry*0.55);
  const throatlatch = P(HC.x + dir*rx*0.5, HC.y + ry*0.55);
  pen.paint(()=>{
    g.moveTo(crestRoot.x, crestRoot.y);
    g.quadraticCurveTo(crestCtl.x, crestCtl.y, poll.x, poll.y);            // crest up to poll
    g.lineTo(throatlatch.x, throatlatch.y);                               // down the throatlatch
    g.quadraticCurveTo(shoulderX + dir*U*0.40, withersY + backH*0.02, throatRoot.x, throatRoot.y); // throat -> chest
    g.closePath();
  }, body, 4.5);

  // ---- flowing MANE: a thin serrated ridge riding the crest ----
  pen.paint(()=>{
    g.moveTo(crestRoot.x, crestRoot.y);
    g.quadraticCurveTo(crestCtl.x, crestCtl.y - U*0.02, poll.x, poll.y);  // along the crest to poll
    const segs = 6;
    for(let i=segs;i>=0;i--){
      const f = i/segs;                                                   // 1 at poll -> 0 at withers
      const bx = lerp(crestRoot.x, poll.x, f);
      const by = lerp(crestRoot.y, poll.y, f);
      // outward normal of the crest points up-and-back; drop the mane just off it
      const drop = U*(0.055 + 0.03*Math.sin(f*9 + t*cfg.speed*0.6));
      g.lineTo(bx - dir*U*0.03, by + drop);
    }
    g.closePath();
  }, mane, 3);

  // ---- HARNESS: collar + surcingle + trace ----
  if (harness){
    // draft collar: padded band around base of neck / shoulder
    const colTop = P(shoulderX + dir*U*0.22, withersY + backH*0.06);
    const colBot = P(shoulderX + dir*U*0.30, groundY - S*0.17);
    pen.limb(()=>{ g.moveTo(colTop.x, colTop.y);
      g.quadraticCurveTo(shoulderX + dir*U*0.44, (colTop.y+colBot.y)/2, colBot.x, colBot.y); }, strap, U*0.10);
    // surcingle: strap over the barrel
    pen.limb(()=>{ g.moveTo(cx + dir*U*0.05, withersY + backH*0.05);
      g.lineTo(cx + dir*U*0.05, bellyY - S*0.01); }, strap, U*0.07);
    // trace line running from collar back along the flank to the rear
    pen.ink(()=>{ g.moveTo(colBot.x, groundY - S*0.19);
      g.lineTo(hipX - dir*U*0.05, groundY - S*0.12); }, 3.5);
  }

  // ---- head ----
  const hd = drawHead(pen, HC, rx, ry, dir, U, cfg, body, mane, harness);

  // ---- NEAR legs (over body) : fore + hind ----
  drawLeg(pen, foreTop, legLen, cfg.FN, U, dir, legN, hoof, wUpper);
  drawLeg(pen, hindTop, legLen, cfg.HN, U, dir, legN, hoof, wUpper);

  // ---- rein trailing back from the bit toward the driver ----
  if (harness && hd.rein){
    pen.ink(()=>{ g.moveTo(hd.rein.x, hd.rein.y);
      g.quadraticCurveTo(shoulderX + dir*U*0.1, withersY + backH*0.2, hipX + dir*U*0.2, withersY + backH*0.4); }, 2.6);
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const S = Math.min(W, H) * 0.86;
  const groundY = H*0.72;
  const t = state.t || 0;
  const pose = state.pose || "halt";

  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, groundY+3); ctx.lineTo(W*0.97, groundY+3); ctx.stroke(); ctx.restore();

  // FAR horse (behind, up-left, smaller + darker) — the matched partner
  drawHorse(pen, W*0.36, groundY - S*0.055, S*0.86, +1, pose, t+0.35,
            { body:4, legN:5, legF:6, mane:6 }, true);
  // NEAR horse (fore, larger, lighter body so it stays legible) — full harness
  drawHorse(pen, W*0.60, groundY, S, +1, pose, t,
            { body:3, legN:4, legF:5, mane:5 }, true);
}

export const asset = {
  id:"creature.matched-horse-team",
  type:"CREATURE",
  name:"Matched horse team",
  statusWord:"HARNESSED",
  scene:"OD-B03-S06",

  // procedural knobs
  params:{
    count:2,                // a matched PAIR
    gait:"halt",            // halt | walk | trot | gallop | fatigue
    faceDir:+1,             // both face +x (yoked, pulling forward)
    harness:true,           // collar + surcingle + trace + bridle + rein
    fullMane:1.0,           // 0..1 mane/tail flow
    teamOffset:0.16,        // horizontal offset between the pair
  },
  // back -> front draw order each horse honors
  layers:["shadow","tail","far-legs","barrel","neck","mane","harness","head","near-legs","rein"],
  // normalized 0..1 attachment / contact / draft anchors (the pair)
  anchors:{
    "far:withers":{x:.34,y:.44}, "far:head":{x:.55,y:.40}, "far:croup":{x:.22,y:.46},
    "near:withers":{x:.50,y:.47}, "near:head":{x:.73,y:.44}, "near:croup":{x:.36,y:.49},
    "near:collar":{x:.66,y:.58}, "far:collar":{x:.50,y:.55},
    "hitch:trace":{x:.14,y:.58}, "rein:driver":{x:.30,y:.55},
    "camera:team":{x:.48,y:.50},
  },
  // hoofprints / body footprints for placement, pathing, collision
  zones:{
    "far:collision":{ x0:.10,y0:.34,x1:.62,y1:.82 },
    "near:collision":{ x0:.28,y0:.38,x1:.82,y1:.86 },
    walkable:{ x0:.04,y0:.62,x1:.96,y1:.90 },
  },
  states:{
    initial:"halt",
    nodes:{
      halt:{    preview:{ pose:"halt" } },              // standing, heads up, harnessed
      walk:{    preview:{ pose:"walk", t:0.5 } },       // ambling stride (animate t)
      trot:{    preview:{ pose:"trot", t:0.5 } },       // collected, diagonal, knees up
      gallop:{  preview:{ pose:"gallop", t:0.5 } },     // extended, low, streaming tail
      fatigue:{ preview:{ pose:"fatigue" } },           // heads low, back sagged, one hind cocked
    },
    edges:[
      ["halt","walk"],["walk","trot"],["trot","gallop"],
      ["gallop","trot"],["trot","walk"],["walk","halt"],
      ["walk","fatigue"],["trot","fatigue"],["fatigue","halt"],
    ],
  },
  channels:["gait","pose","neckArch","headCarriage","tail","mane","harness"],

  preview:()=>({ pose:"halt", t:0, status:"HARNESSED", progress:.22 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
