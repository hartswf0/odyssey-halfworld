/* divine_fx.zeuss-thunderbolt — Zeus hurls the sky at a mortal ship. DIVINE_FX
   asset. Scene function (OD-B12-S07): a black storm-cloud GATHERS overhead
   (SOURCE = sky), a jagged FORKED bolt STRIKES the ship's MAST (TARGET), a
   white impact FLASH bursts, FIRE takes the rigging, and a SHOCKWAVE ring rolls
   out across the sea — the divine blow that fells the crew and TRIGGERS the
   vessel-fracture.

   Narrative reads top->down: SOURCE (black cloud buildup across the sky) -> the
   forked bolt lancing down -> TARGET (the struck mast) with its impact FLASH ->
   FIELD (fire on the mast + shockwave ring over the water) -> CONSEQUENCE (the
   fracture-seam split down the hull the strike triggers).

   Procedural over state.t + charge/strike/burn/shock/fracture:
     CLOUD-BUILDUP (t low)  — cloud darkens + swells, air charges, no bolt.
     STRIKE        (t mid)  — the forked bolt lands on the mast, white flash burst.
     FIRE          (t high) — bolt fades, flame climbs the mast/rigging.
     SHOCKWAVE     (t full) — a ring rolls out over the sea, fracture-seam opens.
   `charge` = cloud darkness/swell.  `strike` = bolt+flash presence (spikes at t).
   `burn` = flame height.  `shock` = ring radius.  `fracture` = hull-split reveal.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  horizon:   0.72,   // sea waterline as frac of H
  cloudY:    0.16,   // storm-cloud mass center y
  cloudBot:  0.29,   // cloud underside (bolt departs here) y
  mastX:     0.50,   // ship + mast center x (TARGET)
  mastTopY:  0.45,   // masthead y (bolt lands here)
  deckY:     0.67,   // deck / hull top y
  boltSeed:  7,      // deterministic bolt-jag seed
  intensity: 1.0,    // storm charge (channel-driven)
};

/* deterministic 0..1 jitter from an integer (stable bolt shape per frame group) */
function jig(i){ const s=Math.sin((i+params.boltSeed)*127.1)*43758.5453; return s-Math.floor(s); }

/* ---- FIELD backdrop: pale storm sky over a mid-dark, wind-chopped SEA. Kept
   light up top so the card label + the black cloud read against it. ---- */
function drawSky(pen,g,W,H,t){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hy);                 // pale sky
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H-hy);             // sea body
  g.fillStyle = inkLevel(4); g.fillRect(0,hy,W,H*0.014);         // waterline seam
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 4);
  // storm chop: short dark wave-ticks drifting on t
  g.strokeStyle = inkLevel(5); g.lineCap="round";
  for(let r=0;r<5;r++){
    const f=(r+0.5)/5, y=lerp(hy+H*0.02,H*0.99,f), step=lerp(64,44,f);
    const amp=lerp(3,8,f), drift=(t*22+r*17)%step;
    g.lineWidth=lerp(1.6,3.2,f); g.beginPath();
    for(let x=-step;x<W+step;x+=step){ const cx=x+drift;
      g.moveTo(cx,y); g.quadraticCurveTo(cx+step*0.5,y-amp,cx+step,y); }
    g.stroke();
  }
}

/* ---- SOURCE: the black storm-cloud buildup filling the sky. Overlapping solid
   billows form one heavy dark silhouette; darkness + downward swell grow with
   `charge`. When charging near a strike, faint internal glow-arcs flicker on t. */
function drawCloud(pen,g,W,H,t,charge){
  const cy = H*params.cloudY, bot = H*params.cloudBot;
  const c = clamp01(charge);
  const lvl = clamp(3+Math.round(c*4),3,7);
  const tone = toneSolid(inkLevel(lvl));
  const swell = lerp(0.0, 0.045, c);                       // underside sags as it charges
  // one connected cloud mass: a lumpy band with a sagging underbelly
  const lobes = 7;
  pen.paint(()=>{
    g.moveTo(-W*0.05, cy);
    for(let i=0;i<=lobes;i++){
      const f=i/lobes, x=lerp(-W*0.05,W*1.05,f);
      const r=H*(0.055+0.03*jig(i*3));
      g.quadraticCurveTo(x, cy-r*1.6, x+W/lobes*0.5, cy-r*0.4);
    }
    g.lineTo(W*1.05, cy);
    // sagging underbelly (bolt departs from its lowest dip over the mast)
    for(let i=lobes;i>=0;i--){
      const f=i/lobes, x=lerp(-W*0.05,W*1.05,f);
      const dip=(1-Math.abs(f-params.mastX))*swell*H;      // deepest above the mast
      const r=H*(0.03+0.02*jig(i*5))+dip;
      g.quadraticCurveTo(x, bot+r*0.4, x-W/lobes*0.5, bot-r*0.2);
    }
    g.closePath();
  }, tone, 5);
  // internal charge glow-arcs (pale) flickering before/at the strike
  if (c>0.35){
    g.strokeStyle=inkLevel(clamp(2-Math.round(c),0,2));
    g.lineWidth=2; g.globalAlpha=0.5+0.5*Math.abs(Math.sin(t*9));
    for(let k=0;k<3;k++){
      const x=W*(0.32+0.18*k)+Math.sin(t*7+k)*W*0.02, y=lerp(cy,bot,0.5+0.2*jig(k*7));
      g.beginPath(); g.moveTo(x-W*0.05,y-H*0.01);
      g.lineTo(x-W*0.01,y+H*0.012); g.lineTo(x+W*0.02,y-H*0.008); g.lineTo(x+W*0.06,y+H*0.01);
      g.stroke();
    }
    g.globalAlpha=1;
  }
}

/* build the main forked bolt path (source underbelly -> masthead) as a jagged
   polyline; returns the point list so flash/branches reuse the same geometry. */
function boltPath(W,H){
  const sx=W*params.mastX+W*0.04, sy=H*params.cloudBot;      // departs the cloud dip
  const tx=W*params.mastX, ty=H*params.mastTopY;             // lands on masthead
  const N=9, pts=[];
  for(let i=0;i<=N;i++){
    const f=i/N;
    const jx=(jig(i*11)-0.5)*W*0.10*(1-Math.abs(f-0.5)*0.6);
    pts.push({ x:lerp(sx,tx,f)+jx, y:lerp(sy,ty,f) });
  }
  pts[N]={ x:tx, y:ty };                                     // pin the tip to the mast
  return pts;
}

/* ---- the FORKED BOLT + impact FLASH. Present with `strike` (0..1). The bolt is
   a bright white-hot channel (pale core) haloed by hard black so it lances out of
   the dark cloud; a couple of side-forks branch off. At full strike a white star
   FLASH bursts on the masthead. Flickers on t so it reads as live lightning. ---- */
function drawBolt(pen,g,W,H,t,strike){
  const s=clamp01(strike); if (s<=0.02) return;
  const pts=boltPath(W,H);
  const flick=0.72+0.28*Math.abs(Math.sin(t*20));           // fast electric flicker
  g.lineCap="round"; g.lineJoin="round";
  g.globalAlpha=clamp01(0.4+s*flick*0.6);
  // dark halo channel
  g.strokeStyle=INK; g.lineWidth=lerp(7,14,s);
  g.beginPath(); g.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++) g.lineTo(pts[i].x,pts[i].y);
  g.stroke();
  // white-hot core
  g.strokeStyle=inkLevel(0); g.lineWidth=lerp(2,5,s);
  g.beginPath(); g.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++) g.lineTo(pts[i].x,pts[i].y);
  g.stroke();
  // side-forks branching off mid-channel
  for(const b of [[3,-1],[6,1]]){
    const p=pts[b[0]]; const ex=p.x+b[1]*W*0.11, ey=p.y+H*0.05;
    const mx=(p.x+ex)/2+b[1]*W*0.02;
    g.strokeStyle=INK; g.lineWidth=lerp(4,8,s);
    g.beginPath(); g.moveTo(p.x,p.y); g.lineTo(mx,(p.y+ey)/2); g.lineTo(ex,ey); g.stroke();
    g.strokeStyle=inkLevel(0); g.lineWidth=lerp(1.5,3,s);
    g.beginPath(); g.moveTo(p.x,p.y); g.lineTo(mx,(p.y+ey)/2); g.lineTo(ex,ey); g.stroke();
  }
  g.globalAlpha=1;
  // impact FLASH: white star-burst on the masthead
  const tip=pts[pts.length-1]; const fr=W*0.085*s*(0.85+0.15*Math.sin(t*18));
  // pale disc
  g.fillStyle=inkLevel(0); g.globalAlpha=clamp01(s);
  g.beginPath(); g.arc(tip.x,tip.y,fr*0.42,0,TAU); g.fill();
  // radiating spikes (dark, so the burst reads on pale sky)
  g.strokeStyle=INK; g.lineWidth=lerp(2,4,s); g.lineCap="round";
  const spikes=10;
  for(let k=0;k<spikes;k++){
    const a=k/spikes*TAU+t*0.6; const rr=fr*(k%2?1.0:1.5);
    g.beginPath(); g.moveTo(tip.x+Math.cos(a)*fr*0.4,tip.y+Math.sin(a)*fr*0.4);
    g.lineTo(tip.x+Math.cos(a)*rr,tip.y+Math.sin(a)*rr); g.stroke();
  }
  g.globalAlpha=1;
}

/* ---- TARGET: the ship's MAST + hull, struck amidships. A tall mast with a yard
   and furled sail, on a dark hull along the waterline. `fracture` opens a jagged
   split down the hull (the vessel-fracture the strike triggers). Returns the
   masthead + deck-impact points. ---- */
function drawShip(pen,g,W,H,fracture){
  const mx=W*params.mastX, topY=H*params.mastTopY, deckY=H*params.deckY;
  const wy=H*params.horizon, hull=toneSolid(inkLevel(5));
  // hull: a long dark galley silhouette along the waterline
  const hw=W*0.30;
  pen.paint(()=>{
    g.moveTo(mx-hw, deckY);
    g.lineTo(mx+hw, deckY);
    g.quadraticCurveTo(mx+hw*0.7, wy+H*0.03, mx+hw*0.18, wy+H*0.035);
    g.lineTo(mx-hw*0.55, wy+H*0.035);
    g.quadraticCurveTo(mx-hw*0.95, wy+H*0.02, mx-hw, deckY);
    g.closePath();
  }, hull, 5);
  // upswept prow horn (left)
  pen.paint(()=>{
    g.moveTo(mx-hw, deckY); g.lineTo(mx-hw*1.06, deckY-H*0.05);
    g.quadraticCurveTo(mx-hw*0.86, deckY-H*0.02, mx-hw*0.82, deckY); g.closePath();
  }, hull, 4);
  // deck seam
  pen.ink(()=>{ g.moveTo(mx-hw,deckY); g.lineTo(mx+hw,deckY); }, 3.5);
  // hull plank lines
  g.strokeStyle=inkLevel(6); g.lineWidth=2;
  for(let k=1;k<=2;k++){ const y=lerp(deckY,wy+H*0.03,k/3);
    g.beginPath(); g.moveTo(mx-hw*0.9,y); g.lineTo(mx+hw*0.8,y); g.stroke(); }
  // MAST: tall pole from deck to masthead (the struck point)
  pen.limb(()=>{ g.moveTo(mx,deckY); g.lineTo(mx,topY); }, toneSolid(inkLevel(6)), W*0.017);
  // yard-arm + furled square sail
  const yy=lerp(topY,deckY,0.34), yw=W*0.13;
  pen.limb(()=>{ g.moveTo(mx-yw,yy); g.lineTo(mx+yw,yy); }, toneSolid(inkLevel(6)), W*0.012);
  pen.paint(()=>{
    g.moveTo(mx-yw*0.85,yy+H*0.006); g.lineTo(mx+yw*0.85,yy+H*0.006);
    g.lineTo(mx+yw*0.62,yy+H*0.10); g.lineTo(mx-yw*0.62,yy+H*0.10); g.closePath();
  }, toneSolid(inkLevel(2)), 3);
  // rigging stays (thin ropes, kept light so the bolt reads as the hero line)
  g.strokeStyle=inkLevel(4); g.lineWidth=1.6; g.lineCap="round";
  g.beginPath(); g.moveTo(mx,topY+H*0.02); g.lineTo(mx-hw*0.7,deckY); g.stroke();
  g.beginPath(); g.moveTo(mx,topY+H*0.02); g.lineTo(mx+hw*0.7,deckY); g.stroke();
  // FRACTURE: jagged split opening down the hull from the mast-foot
  const fr=clamp01(fracture);
  if (fr>0.02){
    g.strokeStyle=inkLevel(0); g.lineWidth=lerp(2,7,fr);
    const segs=6; g.beginPath(); g.moveTo(mx,deckY);
    let px=mx,py=deckY;
    for(let i=1;i<=segs;i++){ const f=i/segs;
      const nx=mx+(jig(i*13)-0.5)*W*0.06*fr; const ny=lerp(deckY,wy+H*0.03,f*fr);
      g.lineTo(nx,ny); px=nx; py=ny; }
    g.stroke();
    // dark contour edges of the crack
    g.strokeStyle=INK; g.lineWidth=lerp(1,3,fr);
    g.beginPath(); g.moveTo(mx-2,deckY);
    for(let i=1;i<=segs;i++){ const f=i/segs;
      g.lineTo(mx-3+(jig(i*13)-0.5)*W*0.06*fr, lerp(deckY,wy+H*0.03,f*fr)); }
    g.stroke();
  }
  return { masthead:{x:mx,y:topY}, deck:{x:mx,y:deckY}, hw, deckY };
}

/* ---- FIELD: FIRE climbing the struck mast + rigging. Flame tongues grow with
   `burn`; they lick upward and flutter on t. Solid dark tongues with pale cores
   so they read as fire in the halftone. ---- */
function drawFire(pen,g,W,H,t,burn,ship){
  const b=clamp01(burn); if (b<=0.03) return;
  const { deck } = ship;
  const baseY=deck.y-H*0.005;                               // flames rise off the deck
  const tongues=Math.max(2, Math.round(2+b*4));             // few licks low, many when burning
  for(let k=0;k<tongues;k++){
    const f=tongues>1?k/(tongues-1):0.5;
    const spread=lerp(W*0.02, W*0.055, b);
    const x=deck.x+lerp(-spread,spread,f);
    const h=lerp(H*0.03,H*0.13,b)*(0.7+0.3*jig(k*9));
    const sway=Math.sin(t*7+k*1.3)*W*0.012*b;
    // dark tongue
    g.fillStyle=inkLevel(clamp(5-Math.round(jig(k)*2),4,6));
    g.beginPath(); g.moveTo(x-W*0.016,baseY);
    g.quadraticCurveTo(x-W*0.008+sway, baseY-h*0.6, x+sway*1.3, baseY-h);
    g.quadraticCurveTo(x+W*0.008+sway, baseY-h*0.6, x+W*0.016, baseY);
    g.closePath(); g.fill();
    // pale inner flame
    g.fillStyle=inkLevel(1);
    g.beginPath(); g.moveTo(x-W*0.006,baseY);
    g.quadraticCurveTo(x+sway*0.7, baseY-h*0.55, x+sway, baseY-h*0.72);
    g.quadraticCurveTo(x+W*0.006+sway*0.6, baseY-h*0.5, x+W*0.006,baseY);
    g.closePath(); g.fill();
  }
  // rising sparks (only once well alight)
  if (b>0.4){ g.fillStyle=INK;
    for(let k=0;k<6;k++){
      const sx=deck.x+(jig(k*17)-0.5)*W*0.09;
      const sy=baseY-H*0.05-((t*40+k*30)%(H*0.12));
      g.beginPath(); g.arc(sx,sy,2.2,0,TAU); g.fill();
    }
  }
}

/* ---- FIELD: SHOCKWAVE ring rolling out over the sea from the impact. Concentric
   rings expand with `shock`; they flatten in perspective on the water. The blast
   that fells the crew. ---- */
function drawShock(pen,g,W,H,t,shock,ship){
  const s=clamp01(shock); if (s<=0.02) return;
  const cx=ship.deck.x, cy=ship.deckY+H*0.02;
  const rings=3;
  g.lineCap="round";
  for(let k=0;k<rings;k++){
    const f=k/(rings-1||1);
    const prog=clamp01(s*1.2 - f*0.4); if (prog<=0) continue;
    const rx=lerp(ship.hw*0.4, W*0.62, prog);
    const ry=rx*0.34;
    g.strokeStyle=inkLevel(clamp(6-Math.round(prog*4),1,6));
    g.lineWidth=lerp(6,1.5,prog);
    g.globalAlpha=clamp01(1-prog*0.7);
    g.beginPath(); g.ellipse(cx,cy,rx,ry,0,0,TAU); g.stroke();
  }
  g.globalAlpha=1;
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=st.t ?? 0;
  const inten=st.intensity ?? params.intensity;
  const charge  = st.charge   ?? clamp(inten*0.85, 0, 1);
  const strike  = st.strike   ?? clamp((inten-0.25)*1.6, 0, 1);
  const burn    = st.burn     ?? clamp((inten-0.5)*1.7, 0, 1);
  const shock   = st.shock    ?? clamp((inten-0.55)*1.8, 0, 1);
  const fracture= st.fracture ?? clamp((inten-0.6)*1.9, 0, 1);
  const layers=st.layers || ["sky","cloud","ship","fire","shock","bolt"];
  const has=l=>layers.includes(l);

  let ship={ masthead:{x:W*params.mastX,y:H*params.mastTopY},
             deck:{x:W*params.mastX,y:H*params.deckY}, hw:W*0.30, deckY:H*params.deckY };

  if (has("sky"))   drawSky(pen,g,W,H,t);
  if (has("cloud")) drawCloud(pen,g,W,H,t,charge);
  if (has("ship"))  ship=drawShip(pen,g,W,H,fracture);
  if (has("fire"))  drawFire(pen,g,W,H,t,burn,ship);
  if (has("shock")) drawShock(pen,g,W,H,t,shock,ship);
  if (has("bolt"))  drawBolt(pen,g,W,H,t,strike);           // bolt/flash on top

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.zeuss-thunderbolt",
  type:"DIVINE_FX",
  name:"Zeus's thunderbolt",
  statusWord:"STRUCK",
  scene:"OD-B12-S07",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["sky","cloud","ship","fire","shock","bolt"],
  // normalized 0..1 source / target / field / consequence anchors
  anchors:{
    "source:cloud":{  x:0.50, y:0.20 },   // the black storm-cloud (Zeus's hand)
    "source:dip":{    x:0.54, y:0.34 },   // underbelly the bolt departs
    "target:masthead":{x:0.50,y:0.36 },   // the struck masthead
    "target:deck":{   x:0.50, y:0.68 },   // deck-foot impact / fire base
    "field:shock":{   x:0.50, y:0.70 },   // shockwave origin on the water
    "fracture:seam":{ x:0.50, y:0.72 },   // the triggered hull-split
    "camera:wide":{   x:0.50, y:0.50 },
  },
  // affected regions
  zones:{
    sky:{    x0:0.00, y0:0.06, x1:1.00, y1:0.36 },   // storm-cloud field
    vessel:{ x0:0.20, y0:0.34, x1:0.80, y1:0.76 },   // the ship footprint
    blast:{  x0:0.00, y0:0.64, x1:1.00, y1:0.92 },   // shockwave corridor
  },
  // DIVINE_FX states: cloud gathers -> strike -> fire -> shockwave(+fracture)
  states:{
    initial:"strike",
    nodes:{
      "cloud-buildup":{ preview:{ t:0.6, intensity:0.30, charge:0.55, strike:0.0,
                          burn:0.0, shock:0.0, fracture:0.0, status:"CHARGING", progress:0.14,
                          layers:["sky","cloud","ship"] } },
      strike:{ preview:{ t:1.4, intensity:0.55, charge:0.9, strike:1.0,
                          burn:0.05, shock:0.1, fracture:0.15, status:"STRUCK", progress:0.5 } },
      fire:{   preview:{ t:2.6, intensity:0.80, charge:0.7, strike:0.25,
                          burn:1.0, shock:0.5, fracture:0.5, status:"BURNING", progress:0.72 } },
      shockwave:{ preview:{ t:3.4, intensity:1.0, charge:0.55, strike:0.0,
                          burn:0.7, shock:1.0, fracture:1.0, status:"FRACTURED", progress:0.95 } },
    },
    edges:[["cloud-buildup","strike"],["strike","fire"],["fire","shockwave"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","charge","strike","burn","shock","fracture"],

  // neutral preview: the moment of the STRIKE — cloud black + charged, the forked
  // bolt landed on the masthead, white flash bursting, fire just catching.
  preview:()=>({ t:1.4, intensity:0.55, charge:0.9, strike:1.0,
                 burn:0.12, shock:0.12, fracture:0.18, status:"STRUCK", progress:0.5,
                 layers:["sky","cloud","ship","fire","shock","bolt"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
