/* creature.two-omen-eagles — the paired sign of Zeus over the Ithacan assembly.
   CREATURE asset (OD-B02-S03). Two sea-eagles sent as an OMEN: they wheel in
   from the sky, lock wings, bank hard over the gathering, tear at each other
   with their talons, then split and depart. NOT a humanoid rig — fully custom
   bird geometry built from engine primitives: an articulated body + two-segment
   wings (shoulder -> wrist -> primary "fingers"), a hooked-beak head that can
   turn, a wedge tail, and grasping talons that extend for the strike.

   Two members are drawn from ONE eagle template with per-member flight-pose
   channels (wing spread, flap, bank/roll, talon reach, head turn, facing) so a
   scene can drive the omen: soaring -> wing-lock -> bank -> talon-strike ->
   departure. Drawn in SOLID grays + hard black contour ONLY; the engine POST
   pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const D2R = Math.PI/180;

const params = {
  members:2,
  bodyLen:0.155,     // eagle body length as a fraction of W
  horizon:0.83,      // faint ground line under the omen (the assembly below)
  toneA:7,           // lead eagle ink level (near-black)
  toneB:6,           // second eagle ink level (a hair lighter, reads as two birds)
  flapSpeed:2.2,     // wingbeat rate for the live flap channel
};

/* ---- omen sky the pair wheels through: light field, a faint horizon over the
   assembled crowd, a few cloud steps and streaming wind lines for motion ---- */
function drawSky(pen,g,W,H,t){
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  // upper sky a touch lighter than the low air
  g.fillStyle = inkLevel(2); g.fillRect(0,H*0.52,W,H*(params.horizon-0.52));
  // cloud steps drifting across the mid sky
  g.fillStyle = inkLevel(2);
  for(let i=0;i<4;i++){
    const cx = ((i*0.27 + t*0.02)%1.1-0.05)*W;
    const cy = H*(0.20+0.12*(i%2));
    g.beginPath(); g.ellipse(cx,cy,W*0.13,H*0.028,0,0,TAU); g.fill();
  }
  // streaming wind lines (faint, diagonal — the wheeling air)
  g.strokeStyle = INK; g.lineWidth = 1.5; g.globalAlpha = 0.10; g.lineCap="round";
  for(let i=0;i<7;i++){
    const y = H*(0.10+i*0.10);
    g.beginPath(); g.moveTo(W*0.04, y); g.lineTo(W*0.04+W*0.30, y-H*0.02); g.stroke();
    g.beginPath(); g.moveTo(W*0.66, y+H*0.03); g.lineTo(W*0.96, y+H*0.01); g.stroke();
  }
  g.globalAlpha = 1;
  // horizon + the assembled crowd as a low bumpy silhouette (context, not baked cast)
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H-hy);
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 3);
  g.fillStyle = inkLevel(4);
  for(let x=W*0.06;x<W*0.94;x+=W*0.045){
    const r = W*0.016*(0.7+0.5*Math.abs(Math.sin(x)));
    g.beginPath(); g.arc(x, hy, r, Math.PI, TAU); g.fill();
  }
}

/* ---- ONE eagle, drawn in LOCAL space around (0,0), nose toward -y.
   The caller sets translate/rotate(bank)/scale(facing*s,s). Pose channels:
     spread 0..1  wing extension      flap -1..1  wingtip up/down sweep
     talon  0..1  grasp reach         head -1..1  head turn
   inkLvl selects the fill darkness so the two birds separate. ---- */
function drawEagle(pen,g,W,P,inkLvl){
  const bl  = W*params.bodyLen;      // body length
  const bhw = bl*0.19;               // body half-width
  const tone = toneSolid(inkLevel(inkLvl));
  const cw = Math.max(2, W*0.006);   // contour weight
  const spread = clamp01(P.spread ?? 1);
  const flap   = clamp(P.flap ?? 0.2, -1, 1);
  const talon  = clamp01(P.talon ?? 0);
  const head   = clamp(P.head ?? 0, -1, 1);

  const spreadF = 0.45 + 0.55*spread;
  const upFrac  = 0.14 + 0.34*((flap+1)/2);   // wingtip up-sweep grows with flap
  const up      = bl*upFrac;
  const inner   = bl*0.52*spreadF;            // shoulder -> wrist
  const outer   = bl*0.50*spreadF;            // wrist -> primary tip
  const shY     = -bl*0.06;

  /* ---- WINGS (two-segment, drawn behind the body) ---- */
  const wing = (side)=>{
    const sh    = { x: side*bhw*0.62, y: shY };
    const wrist = { x: sh.x + side*inner,    y: sh.y - up*0.55 };
    const tip   = { x: wrist.x + side*outer, y: wrist.y - up*0.70 };
    pen.paint(()=>{
      g.moveTo(sh.x, sh.y - bl*0.16);                                              // leading root (high)
      g.quadraticCurveTo(sh.x + side*inner*0.5, sh.y - up*0.55 - bl*0.05,
                         wrist.x, wrist.y - inner*0.04);                            // leading -> wrist
      g.quadraticCurveTo(wrist.x + side*outer*0.45, tip.y - outer*0.04, tip.x, tip.y); // wrist -> tip
      g.quadraticCurveTo(tip.x - side*outer*0.06, tip.y + up*0.30,
                         wrist.x + side*outer*0.14, wrist.y + bl*0.11);            // tip -> wrist (trailing)
      g.quadraticCurveTo(wrist.x - side*inner*0.16, wrist.y + bl*0.17,
                         sh.x, sh.y + bl*0.15);                                    // wrist -> body (trailing)
      g.closePath();
    }, tone, cw);
    // primary-feather "fingers" splaying off the outer wing (structural seams)
    g.strokeStyle = INK; g.lineWidth = Math.max(2, W*0.0045); g.lineCap="round";
    for(let k=0;k<4;k++){
      const f0 = 0.52 + k*0.13;
      const fx = lerp(wrist.x, tip.x, f0), fy = lerp(wrist.y, tip.y, f0);
      g.beginPath(); g.moveTo(fx, fy);
      g.lineTo(fx + side*outer*0.16, fy + up*0.16 + outer*0.03*k);
      g.stroke();
    }
    // one inner-wing covert seam for articulation read
    pen.seam(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(wrist.x*0.9, wrist.y*0.9); }, 2);
  };
  wing(-1); wing(1);

  /* ---- TALONS (legs from the lower belly; tuck under -> reach forward on strike) ---- */
  const leg = (side)=>{
    const hip  = { x: side*bhw*0.44, y: bl*0.12 };
    const tuck = { x: hip.x + side*bl*0.05, y: hip.y + bl*0.17 };   // folded, trailing down
    const strike = { x: side*bhw*1.05, y: -bl*0.16 };               // thrust forward toward the nose
    const foot = { x: lerp(tuck.x, strike.x, talon), y: lerp(tuck.y, strike.y, talon) };
    pen.limb(()=>{ g.moveTo(hip.x, hip.y); g.lineTo(foot.x, foot.y); }, tone, bl*0.05);
    // three hooked claws, opening as the strike extends
    const open = 0.35 + 0.65*talon;
    g.strokeStyle = INK; g.lineWidth = Math.max(2, W*0.005); g.lineCap="round";
    for(let c=-1;c<=1;c++){
      const a = c*0.6*open;
      const cl = bl*0.11*(0.6+0.6*talon);
      const dx = Math.sin(a)*cl, dy = Math.cos(a)*cl*(talon>0.5?-1:1);
      g.beginPath();
      g.moveTo(foot.x, foot.y);
      g.quadraticCurveTo(foot.x+dx*0.6, foot.y+dy*0.6, foot.x+dx*1.1, foot.y+dy*1.15);
      g.stroke();
    }
  };
  leg(-1); leg(1);

  /* ---- BODY (teardrop, nose up) + wedge tail ---- */
  pen.paint(()=>{
    g.moveTo(0, -bl*0.55);
    g.quadraticCurveTo(bhw*1.12, -bl*0.28, bhw*0.92, bl*0.04);
    g.quadraticCurveTo(bhw*0.72,  bl*0.40, bhw*0.52, bl*0.58);
    g.lineTo(0, bl*0.66);                                     // tail centre notch
    g.lineTo(-bhw*0.52, bl*0.58);
    g.quadraticCurveTo(-bhw*0.72, bl*0.40, -bhw*0.92, bl*0.04);
    g.quadraticCurveTo(-bhw*1.12, -bl*0.28, 0, -bl*0.55);
    g.closePath();
  }, tone, cw);
  // tail feather splits
  pen.seam(()=>{ g.moveTo(0, bl*0.30); g.lineTo(0, bl*0.64); }, 2);
  pen.seam(()=>{ g.moveTo(-bhw*0.26, bl*0.20); g.lineTo(-bhw*0.32, bl*0.58); }, 2);
  pen.seam(()=>{ g.moveTo( bhw*0.26, bl*0.20); g.lineTo( bhw*0.32, bl*0.58); }, 2);

  /* ---- HEAD + hooked beak (turns with `head`) ---- */
  const hR  = bl*0.15;
  const hcx = head*hR*0.7;
  const hcy = -bl*0.62;
  pen.paint(()=>{ g.arc(hcx, hcy, hR, 0, TAU); }, tone, cw);
  pen.paint(()=>{                                              // hooked beak, pointing up-forward
    const bx = hcx + head*hR*0.5;
    g.moveTo(bx - hR*0.30, hcy - hR*0.5);
    g.lineTo(bx + head*hR*0.2, hcy - hR*1.7);
    g.lineTo(bx + hR*0.34, hcy - hR*0.4);
    g.quadraticCurveTo(bx + hR*0.1, hcy - hR*0.2, bx - hR*0.30, hcy - hR*0.5);
    g.closePath();
  }, tone, 2);
  // bright fierce eye-mark (tonal contrast on the dark head)
  pen.fillPath(()=>{ g.arc(hcx + head*hR*0.5 + hR*0.34, hcy - hR*0.12, hR*0.20, 0, TAU); }, inkLevel(1));
  pen.fillPath(()=>{ g.arc(hcx + head*hR*0.5 + hR*0.36, hcy - hR*0.12, hR*0.09, 0, TAU); }, inkLevel(7));
}

/* ---- per-state formation: two eagles from the one template. Each entry gives
   position (fraction of W/H), scale, and the flight-pose channels. ---- */
function formation(pose, t, W, H){
  const bob = Math.sin(t*1.4)*H*0.008;
  const beat = Math.sin(t*params.flapSpeed);
  const F = {
    soaring:{
      A:{ x:0.34, y:0.40, s:0.95, spread:1.0, flap:0.30+beat*0.30, bank:-0.14, talon:0, head:-0.35, facing:1 },
      B:{ x:0.64, y:0.53, s:1.00, spread:1.0, flap:0.15-beat*0.30, bank: 0.12, talon:0, head: 0.35, facing:1 },
    },
    "wing-lock":{
      A:{ x:0.42, y:0.45, s:0.98, spread:0.92, flap:0.55, bank: 0.30, talon:0.12, head: 0.55, facing:1 },
      B:{ x:0.60, y:0.46, s:0.98, spread:0.92, flap:-0.10, bank:-0.30, talon:0.12, head:-0.55, facing:1 },
    },
    bank:{
      A:{ x:0.35, y:0.42, s:0.95, spread:1.0, flap:0.20+beat*0.2, bank:-0.72, talon:0, head:-0.1, facing:1 },
      B:{ x:0.65, y:0.55, s:0.95, spread:1.0, flap:0.20-beat*0.2, bank: 0.72, talon:0, head: 0.1, facing:1 },
    },
    "talon-strike":{
      A:{ x:0.39, y:0.47, s:1.02, spread:0.72, flap:0.72, bank: 0.48, talon:1.0, head: 0.45, facing:1 },
      B:{ x:0.61, y:0.47, s:1.02, spread:0.72, flap:0.72, bank:-0.48, talon:1.0, head:-0.45, facing:-1 },
    },
    departure:{
      A:{ x:0.25, y:0.31, s:0.80, spread:0.86, flap:0.55+beat*0.25, bank:-0.42, talon:0, head:-0.6, facing:1 },
      B:{ x:0.75, y:0.33, s:0.80, spread:0.86, flap:-0.35-beat*0.25, bank: 0.42, talon:0, head: 0.6, facing:-1 },
    },
  };
  const f = F[pose] || F.soaring;
  // gentle vertical bob for life
  return {
    A:{ ...f.A, y:f.A.y + bob/H },
    B:{ ...f.B, y:f.B.y - bob/H },
  };
}

/* ---- short speed streaks trailing a banking/departing bird (motion read) ---- */
function drawTrail(g,W,H,m,strength){
  if (strength<=0) return;
  g.save(); g.strokeStyle=INK; g.lineCap="round"; g.globalAlpha=0.14;
  const cx=m.x*W, cy=m.y*H, len=W*0.10*strength;
  for(let i=-1;i<=1;i++){
    g.lineWidth = 2.4 - Math.abs(i)*0.7;
    g.beginPath();
    g.moveTo(cx - m.facing*W*0.05, cy + i*H*0.03 + H*0.06);
    g.lineTo(cx - m.facing*(W*0.05+len), cy + i*H*0.045 + H*0.09);
    g.stroke();
  }
  g.globalAlpha=1; g.restore();
}

function placeEagle(g, pen, W, H, m, inkLvl){
  g.save();
  g.translate(m.x*W, m.y*H);
  g.rotate(m.bank||0);
  g.scale((m.facing||1)*m.s, m.s);
  drawEagle(pen, g, W, m, inkLvl);
  g.restore();
}

function drawCreature(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const pose = st.pose || "soaring";
  const t = st.t || 0;
  const layers = st.layers || ["sky","trails","eagleB","eagleA"];
  const has = l => layers.includes(l);

  const fm = formation(pose, t, W, H);
  // draw order gives the interlock read on wing-lock / strike
  const trail = (pose==="departure") ? 1.0 : (pose==="bank" ? 0.6 : 0.0);

  if (has("sky")) drawSky(pen,g,W,H,t);
  if (has("trails")){ drawTrail(g,W,H,fm.A,trail); drawTrail(g,W,H,fm.B,trail); }
  if (has("eagleB")) placeEagle(g, pen, W, H, fm.B, params.toneB);
  if (has("eagleA")) placeEagle(g, pen, W, H, fm.A, params.toneA);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"creature.two-omen-eagles",
  type:"CREATURE",
  name:"Two omen eagles",
  statusWord:"OMEN",
  scene:"OD-B02-S03",

  params,
  // back -> front draw order the creature honors; scene state can pass a subset
  layers:["sky","trails","eagleB","eagleA"],
  // normalized 0..1 attention / body / contact / camera anchors (neutral SOARING pose)
  anchors:{
    "eagleA:body":{ x:0.34, y:0.40 }, "eagleA:head":{ x:0.34, y:0.33 },
    "eagleA:talons":{ x:0.35, y:0.47 },
    "eagleB:body":{ x:0.64, y:0.53 }, "eagleB:head":{ x:0.64, y:0.46 },
    "eagleB:talons":{ x:0.65, y:0.60 },
    "clash:point":{ x:0.50, y:0.47 },   // where wings lock / talons meet
    "omen:target":{ x:0.50, y:0.83 },   // the assembly below the sign
    "camera:pair":{ x:0.50, y:0.46 },
  },
  // collision proxy per bird (normalized) so a scene can test the wheeling pair
  collision:{
    eagleA:{ shape:"ellipse", cx:0.34, cy:0.40, rx:0.20, ry:0.13 },
    eagleB:{ shape:"ellipse", cx:0.64, cy:0.53, rx:0.20, ry:0.13 },
  },
  // the omen's flight arc as a small state machine
  states:{
    initial:"soaring",
    nodes:{
      soaring:{        preview:{ pose:"soaring",      status:"SOARING",  progress:0.15 } },
      "wing-lock":{    preview:{ pose:"wing-lock",    status:"WING-LOCK",progress:0.38 } },
      bank:{           preview:{ pose:"bank",         status:"BANKING",  progress:0.55 } },
      "talon-strike":{ preview:{ pose:"talon-strike", status:"STRIKE",   progress:0.78 } },
      departure:{      preview:{ pose:"departure",    status:"DEPARTING",progress:0.95 } },
    },
    edges:[
      ["soaring","wing-lock"],["wing-lock","bank"],["bank","talon-strike"],
      ["talon-strike","departure"],["soaring","bank"],
    ],
  },
  duration:6.0,
  // flight-pose channels the runtime can drive over the scene clock
  channels:["t","pose","wingSpread","flap","bank","talon","head","facing"],

  // neutral preview: the pair SOARING in from the sky, wings full-spread, the
  // faint assembly below — reads unmistakably as two omen eagles.
  preview:()=>({ pose:"soaring", t:0.6, status:"OMEN", progress:0.15,
                 layers:["sky","trails","eagleB","eagleA"] }),
  draw(ctx,W,H,state){ return drawCreature(ctx,W,H,state||{}); },
};
export default asset;
