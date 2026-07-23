/* divine_fx.poseidons-curse-field — a spoken prayer becomes a PERSISTENT dark
   modifier bound to Odysseus's whole journey. DIVINE_FX asset. Scene function
   (OD-B09-S11): the blinded giant Polyphemus kneels on the shore and PRAYS to
   his father; the prayer RISES off his clasped hands as a dark curse-glyph,
   Poseidon's TRIDENT receives it as a divine seal, and from that seal a heavy
   dark TETHER reaches out across the sea to a tiny distant SHIP — Odysseus — and
   BRANDS it. The visible consequence: a small trident-mark burned onto the far
   ship and a persistent dark modifier-halo that stays attached to it.

   Narrative reads left->right: SOURCE (praying giant, lower-left) -> the rising
   prayer-glyph -> SEAL (Poseidon's trident, upper-mid) -> FIELD/tether span ->
   TARGET (tiny branded ship on the sea, lower-right).

   Procedural over state.t + intensity/reach/lock:
     SOURCE   (t low,  low)  — giant prays, glyph barely rising, trident faint,
                               tether unstarted, ship still free (no brand).
     FIELD    (t mid,  mid)  — glyph risen, trident forms, the dark tether
                               reaches out across the sea toward the ship.
     TRANSFORM(t full, full) — tether locks onto the ship, the trident-brand is
                               stamped, a persistent curse-halo grips it: CURSED.
   `reach` = smooth(intensity): how far the tether has crossed toward the target.
   `lock`  : whether the brand + curse-halo have taken (the modifier is attached).

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. Keep the upper
   band light so the card LABEL stays legible. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  horizon:   0.68,    // sea waterline as frac of H
  giantX:    0.17,    // praying giant stance-center x (SOURCE)
  giantGround:0.86,   // the shore the giant kneels on, frac of H (foreground)
  prayerX:   0.315,   // clasped-hands / prayer emanation x
  prayerY:   0.265,   // clasped-hands / prayer emanation y
  tridentX:  0.52,    // Poseidon's trident seal center x (SEAL)
  tridentY:  0.205,   // trident seal center y
  shipX:     0.855,   // tiny distant target ship x (TARGET = Odysseus)
  shipY:     0.66,    // ship waterline y
  ripples:   5,       // light flow-streaks on the dark sea
  intensity: 1.0,     // curse charge (channel-driven)
};

/* ---- FIELD backdrop: light sky (kept pale so the card label + rising glyph
   read) over a mid-dark SEA below the horizon, with slow light ripple-streaks
   drifting on t — the water the curse crosses to reach the far ship. ---- */
function drawSea(pen,g,W,H,t){
  const hy = H*params.horizon;
  // pale sky
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hy);
  // sea body (mid tone) + darker shore seam at the waterline
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H-hy);
  g.fillStyle = inkLevel(4); g.fillRect(0,hy,W,H*0.012);
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 4);
  // light ripple-streaks carved into the water (paper channels), drift with t
  g.strokeStyle = inkLevel(1); g.lineCap="round";
  const n = params.ripples;
  for(let r=0;r<n;r++){
    const f = (r+0.5)/n;
    const y = lerp(hy+H*0.02, H*0.99, f);
    const amp = lerp(2.5, 7, f), step = lerp(70, 48, f);
    const drift = (t*20 + r*19) % step;
    g.lineWidth = lerp(1.6, 3.4, f);
    g.beginPath();
    for(let x=-step; x<W+step; x+=step){
      const cx = x + drift;
      g.moveTo(cx, y); g.quadraticCurveTo(cx+step*0.5, y-amp, cx+step, y);
    }
    g.stroke();
  }
}

/* ---- SOURCE: the blinded giant Polyphemus, kneeling in profile (facing the
   sea) and PRAYING. Built from overlapping solid masses so a hunched back, a
   folded knee and a bowed head read as one dark silhouette — not a pillar. Both
   arms lift forward to clasped hands from which the curse-prayer rises. A single
   BLINDED eye (a pale disc struck through) marks him as the maimed cyclops. ---- */
function drawGiant(pen,g,W,H){
  const cx = W*params.giantX, gy = H*0.795;
  const px = W*params.prayerX, py = H*params.prayerY;
  const body = toneSolid(inkLevel(5));
  const shX = cx+W*0.055, shY = H*0.455;      // forward-leaning shoulder

  // ground contact shadow
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx+W*0.03, gy+4, W*0.20, H*0.015, 0,0,TAU); g.fill();

  // whole crouched body as ONE hunched profile silhouette (facing the sea):
  // back on the left curving up to the shoulder, a folded knee bump in front,
  // seat + shin along the ground. One connected mass so it reads as a body.
  pen.paint(()=>{
    g.moveTo(shX-W*0.10, shY);                                 // back shoulder
    g.quadraticCurveTo(cx-W*0.15, H*0.56, cx-W*0.125, H*0.68); // rounded hunched back
    g.lineTo(cx-W*0.11, gy);                                   // down to the seat
    g.quadraticCurveTo(cx+W*0.03, gy+H*0.012, cx+W*0.15, gy);  // shin along the ground
    g.lineTo(cx+W*0.205, gy);                                  // foot tip (toward sea)
    g.lineTo(cx+W*0.185, gy-H*0.032);                          // foot rise
    g.quadraticCurveTo(cx+W*0.175, H*0.705, cx+W*0.105, H*0.64);// knee bump up to belly
    g.quadraticCurveTo(shX+W*0.11, H*0.55, shX+W*0.085, shY);  // belly/chest -> front shoulder
    g.closePath();
  }, body, 5);
  // knee seam so the fold reads
  pen.ink(()=>{ g.moveTo(cx+W*0.045, H*0.705); g.lineTo(cx+W*0.16, H*0.70); }, 3);
  // hip crease
  pen.ink(()=>{ g.moveTo(cx-W*0.10, H*0.67); g.quadraticCurveTo(cx+W*0.02, H*0.66, cx+W*0.10, H*0.66); }, 3);

  // both arms lifted forward to the clasped hands at (px,py)
  pen.limb(()=>{ g.moveTo(shX-W*0.02, shY+H*0.01); g.lineTo(px-W*0.018, py+H*0.02); }, body, W*0.05);
  pen.limb(()=>{ g.moveTo(shX+W*0.05, shY+H*0.005); g.lineTo(px+W*0.018, py+H*0.02); }, body, W*0.05);
  // clasped hands (the prayer emanation point)
  pen.paint(()=>{ g.ellipse(px, py+H*0.02, W*0.045, W*0.05, 0,0,TAU); }, toneSolid(inkLevel(6)), 4);

  // neck + bowed head, tilted up toward the seal
  const hx = shX+W*0.02, hy2 = H*0.375, hr = W*0.072;
  pen.limb(()=>{ g.moveTo(shX, shY); g.lineTo(hx, hy2+hr*0.7); }, body, W*0.045);
  pen.paint(()=>{ g.ellipse(hx, hy2, hr*0.98, hr, 0,0,TAU); }, body, 5);
  // matted brow ridge
  pen.ink(()=>{ g.moveTo(hx-hr*0.8, hy2-hr*0.24); g.quadraticCurveTo(hx+hr*0.1, hy2-hr*0.55, hx+hr*0.9, hy2-hr*0.18); }, 4);
  // single BLINDED eye: pale disc struck through with a dark slash (facing right)
  pen.paint(()=>{ g.ellipse(hx+hr*0.28, hy2, hr*0.30, hr*0.27, 0,0,TAU); }, toneSolid(inkLevel(1)), 3);
  g.strokeStyle=INK; g.lineWidth=4; g.lineCap="round";
  g.beginPath(); g.moveTo(hx+hr*0.28-hr*0.32, hy2-hr*0.30); g.lineTo(hx+hr*0.28+hr*0.32, hy2+hr*0.26); g.stroke();
  g.beginPath(); g.moveTo(hx+hr*0.28-hr*0.32, hy2+hr*0.26); g.lineTo(hx+hr*0.28+hr*0.32, hy2-hr*0.30); g.stroke();
  // open praying mouth (facing the sea)
  pen.paint(()=>{ g.ellipse(hx+hr*0.55, hy2+hr*0.5, hr*0.20, hr*0.15, 0,0,TAU); }, toneSolid(inkLevel(7)), 3);
}

/* ---- the RISING curse-glyph: the spoken prayer leaving the clasped hands and
   ascending toward the trident-seal as a wavering dark plume threaded with
   stacked chevron glyph-marks. Height + darkness grow with `rise` (t/intensity);
   it wavers on t. This is the prayer becoming a sigil in the air. ---- */
function drawRise(pen,g,W,H,t,rise){
  const px = W*params.prayerX, py = H*(params.prayerY+0.02);
  const tx = W*params.tridentX, ty = H*(params.tridentY+0.10);
  const r = smooth(clamp01(rise));
  // plume: a wavering vertical band from the hands up toward the trident
  const steps = 22;
  g.lineCap="round"; g.lineJoin="round";
  g.strokeStyle = inkLevel(clamp(4+Math.round(r*3),4,7)); g.lineWidth = lerp(5, 10, r);
  g.beginPath();
  for(let i=0;i<=steps;i++){
    const f = i/steps;
    const yy = lerp(py, ty, f*r);
    const wav = Math.sin(f*6 + t*2.2)*W*0.02*(0.5+0.5*f);
    const xx = lerp(px, tx, f*r) + wav;
    if(i===0) g.moveTo(xx,yy); else g.lineTo(xx,yy);
  }
  g.stroke();
  // stacked chevron glyph-marks riding the plume (the "spoken" prayer made mark)
  const marks = 5;
  g.lineCap="round"; g.lineJoin="round";
  for(let k=0;k<marks;k++){
    const f = (k+0.6)/marks;
    if (r < f*0.85) continue;                       // marks reveal as the glyph climbs
    const yy = lerp(py, ty, f);
    const xx = lerp(px, tx, f) + Math.sin(f*6 + t*2.2)*W*0.02*(0.5+0.5*f);
    const cw = lerp(W*0.058, W*0.03, f);            // chevrons narrow as they rise
    g.lineWidth = lerp(6, 3.2, f);
    g.strokeStyle = inkLevel(clamp(6-k,3,7));
    g.beginPath();
    g.moveTo(xx-cw, yy+cw*0.6); g.lineTo(xx, yy-cw*0.5); g.lineTo(xx+cw, yy+cw*0.6);
    g.stroke();
  }
}

/* ---- SEAL: Poseidon's TRIDENT, the divine mark that receives the prayer.
   Three prongs pointing up (to the heavens), a crossbar, and a shaft dropping
   down toward the sea from which the tether departs. Forms up (weight/darkness)
   with intensity. Returns the shaft-foot where the tether begins. ---- */
function drawTrident(pen,g,W,H,t,inten){
  const cx = W*params.tridentX, cy = H*params.tridentY;
  const d = clamp01(inten/1.2);
  const prongTop = cy - H*0.085, cby = cy + H*0.005;
  const shaftBot = cy + H*0.125, pw = W*0.062;
  const lvl = clamp(4+Math.round(d*3),4,7);
  const tone = toneSolid(inkLevel(lvl));
  // faint receiving halo behind the seal
  g.strokeStyle = inkLevel(clamp(1+Math.round(d*2),1,3)); g.lineWidth = 2;
  g.beginPath(); g.arc(cx, cy-H*0.02, W*0.13*(0.9+0.1*Math.sin(t*1.6)), 0, TAU); g.stroke();
  // center prong
  pen.limb(()=>{ g.moveTo(cx, prongTop); g.lineTo(cx, cby); }, tone, W*0.017);
  // side prongs: curve up and out from the crossbar to barbed tips
  for(const s of [-1,1]){
    pen.limb(()=>{
      g.moveTo(cx+s*pw, cby);
      g.quadraticCurveTo(cx+s*pw*1.15, prongTop+H*0.02, cx+s*pw, prongTop);
    }, tone, W*0.016);
    // small outward barb at each tip
    pen.ink(()=>{ g.moveTo(cx+s*pw, prongTop); g.lineTo(cx+s*pw*1.35, prongTop+H*0.012); }, 4);
  }
  // crossbar
  pen.limb(()=>{ g.moveTo(cx-pw*1.25, cby); g.lineTo(cx+pw*1.25, cby); }, tone, W*0.015);
  // shaft down toward the sea
  pen.limb(()=>{ g.moveTo(cx, cby); g.lineTo(cx, shaftBot); }, tone, W*0.018);
  // shaft binding rings
  g.strokeStyle=INK; g.lineWidth=3;
  for(let k=1;k<=2;k++){ const yy=lerp(cby,shaftBot,k/3);
    g.beginPath(); g.moveTo(cx-W*0.02, yy); g.lineTo(cx+W*0.02, yy); g.stroke(); }
  return { x:cx, y:shaftBot };
}

/* sample point on the tether's quadratic arc (SEAL foot -> ship) at param u */
function tetherPt(S, C, P, u){
  const iu = 1-u;
  return { x: iu*iu*S.x + 2*iu*u*C.x + u*u*P.x,
           y: iu*iu*S.y + 2*iu*u*C.y + u*u*P.y };
}

/* ---- FIELD / TETHER: the heavy dark curse-bond reaching from the trident-shaft
   across the sea to the ship. It EXTENDS with `reach` (0 = just leaving the seal,
   1 = arrived at the ship). Drawn as a thick dark polyline with periodic hook
   barbs; when it lands it drives an arrowhead into the ship. ---- */
function drawTether(pen,g,W,H,t,S,reach){
  const P = { x:W*params.shipX, y:H*(params.shipY-0.01) };
  const C = { x:W*0.60, y:H*0.30 };                        // arc control (bows over the sea)
  const u1 = smooth(clamp01(reach));
  const N = 40;
  // thick dark bond
  g.strokeStyle = inkLevel(7); g.lineWidth = 11; g.lineCap="round"; g.lineJoin="round";
  g.beginPath();
  for(let i=0;i<=N;i++){
    const u = (i/N)*u1;
    const p = tetherPt(S,C,P,u);
    const wob = Math.sin(u*10 + t*2)*2.2*(1-u);            // slack shimmer near the source
    if(i===0) g.moveTo(p.x, p.y+wob); else g.lineTo(p.x, p.y+wob);
  }
  g.stroke();
  // core highlight so the bond reads as a twisted cable
  g.strokeStyle = inkLevel(2); g.lineWidth = 2.6;
  g.beginPath();
  for(let i=0;i<=N;i++){ const u=(i/N)*u1; const p=tetherPt(S,C,P,u); if(i===0)g.moveTo(p.x,p.y);else g.lineTo(p.x,p.y);} g.stroke();
  // hook barbs along the bond
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
  const barbs=6;
  for(let k=1;k<=barbs;k++){
    const u=(k/(barbs+1))*u1; if(u<=0) continue;
    const p=tetherPt(S,C,P,u), q=tetherPt(S,C,P,Math.min(u1,u+0.02));
    const dx=q.x-p.x, dy=q.y-p.y, L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L;
    const bl=W*0.016;
    g.beginPath(); g.moveTo(p.x-nx*bl, p.y-ny*bl); g.lineTo(p.x+nx*bl, p.y+ny*bl); g.stroke();
  }
  // arrowhead where the bond meets the ship (once it has essentially arrived)
  if (u1 > 0.9){
    const p=tetherPt(S,C,P,1), q=tetherPt(S,C,P,0.96);
    const dx=p.x-q.x, dy=p.y-q.y, a=Math.atan2(dy,dx), ah=W*0.028;
    g.fillStyle=inkLevel(7);
    g.beginPath();
    g.moveTo(p.x, p.y);
    g.lineTo(p.x-Math.cos(a-0.4)*ah, p.y-Math.sin(a-0.4)*ah);
    g.lineTo(p.x-Math.cos(a+0.4)*ah, p.y-Math.sin(a+0.4)*ah);
    g.closePath(); g.fill();
  }
}

/* ---- TARGET: the tiny distant SHIP (Odysseus). Deliberately small against the
   giant — a lone dark hull, mast and square sail on the far sea. ---- */
function drawShip(pen,g,W,H){
  const cx=W*params.shipX, wy=H*params.shipY, hw=W*0.05;
  // dark stain the curse leaves on the water beneath her
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, wy+H*0.012, hw*2.1, H*0.014, 0,0,TAU); g.fill();
  // hull (shallow curved boat)
  pen.paint(()=>{
    g.moveTo(cx-hw, wy-H*0.008);
    g.lineTo(cx+hw, wy-H*0.008);
    g.quadraticCurveTo(cx+hw*0.5, wy+H*0.02, cx, wy+H*0.022);
    g.quadraticCurveTo(cx-hw*0.5, wy+H*0.02, cx-hw, wy-H*0.008);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
  // mast
  const mastY = wy-H*0.075;
  pen.ink(()=>{ g.moveTo(cx, wy-H*0.006); g.lineTo(cx, mastY); }, 3.5);
  // square sail
  pen.paint(()=>{
    g.moveTo(cx-hw*0.7, mastY+H*0.004);
    g.lineTo(cx+hw*0.7, mastY+H*0.004);
    g.lineTo(cx+hw*0.55, wy-H*0.012);
    g.lineTo(cx-hw*0.55, wy-H*0.012);
    g.closePath();
  }, toneSolid(inkLevel(2)), 3);
  return { cx, wy, hw, mastY };
}

/* ---- CONSEQUENCE / BRAND: the trident-mark stamped onto the ship's sail + a
   persistent curse-halo of concentric dark rings gripping her on the water. Both
   appear/charge with `lock` (the modifier is attached and will not lift). ---- */
function drawBrand(pen,g,W,H,t,ship,lock){
  const L = clamp01(lock); if (L<=0.02) return;
  const { cx, wy, hw, mastY } = ship;
  // persistent curse-halo: concentric dark rings on the water around the ship
  const rings=3;
  g.lineCap="round";
  for(let k=0;k<rings;k++){
    const f=k/(rings-1||1);
    if (L < 0.2+f*0.5) continue;
    const puls=1+0.04*Math.sin(t*1.8-k);
    const rx=lerp(hw*1.6, hw*3.4, f)*puls, ry=rx*0.30;
    g.strokeStyle=inkLevel(clamp(5-Math.round(f*3),2,6));
    g.lineWidth=lerp(3,1.4,f);
    g.beginPath(); g.ellipse(cx, wy+H*0.010, rx, ry, 0,0,TAU); g.stroke();
  }
  // trident BRAND burned onto the sail (a mini trident glyph)
  const bx=cx, by=(mastY+wy-H*0.012)/2, s=hw*0.5*(0.85+0.15*Math.sin(t*2.4));
  g.strokeStyle=INK; g.lineWidth=Math.max(2, s*0.28); g.lineCap="round"; g.lineJoin="round";
  g.beginPath(); g.moveTo(bx, by-s); g.lineTo(bx, by+s); g.stroke();        // shaft
  g.beginPath(); g.moveTo(bx-s*0.8, by-s*0.3); g.lineTo(bx+s*0.8, by-s*0.3); g.stroke(); // crossbar
  for(const sd of [-1,1]){ g.beginPath();
    g.moveTo(bx+sd*s*0.8, by-s*0.3); g.lineTo(bx+sd*s*0.8, by-s*1.0); g.stroke(); }
  g.beginPath(); g.moveTo(bx, by-s*0.3); g.lineTo(bx, by-s*1.0); g.stroke();
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const rise  = st.rise  ?? clamp(inten*0.9, 0, 1.2);
  const reach = st.reach ?? clamp((inten-0.3)*1.15, 0, 1);
  const lock  = st.lock  ?? clamp((inten-0.7)*1.6, 0, 1);
  const layers = st.layers || ["sea","giant","rise","trident","tether","ship","brand"];
  const has = l => layers.includes(l);

  let shaftFoot = { x:W*params.tridentX, y:H*(params.tridentY+0.125) };
  let ship = { cx:W*params.shipX, wy:H*params.shipY, hw:W*0.05, mastY:H*params.shipY-H*0.075 };

  if (has("sea"))     drawSea(pen,g,W,H,t);
  if (has("giant"))   drawGiant(pen,g,W,H);
  if (has("rise"))    drawRise(pen,g,W,H,t,rise);
  if (has("trident")) shaftFoot = drawTrident(pen,g,W,H,t,inten);
  if (has("ship"))    ship = drawShip(pen,g,W,H);
  if (has("tether"))  drawTether(pen,g,W,H,t,shaftFoot,reach);
  if (has("brand"))   drawBrand(pen,g,W,H,t,ship,lock);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.poseidons-curse-field",
  type:"DIVINE_FX",
  name:"Poseidon's curse field",
  statusWord:"CURSED",
  scene:"OD-B09-S11",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["sea","giant","rise","trident","tether","ship","brand"],
  // normalized 0..1 source / seal / field / target / consequence anchors
  anchors:{
    "source:giant":{   x:0.19, y:0.55 },   // praying Polyphemus (the curse's mouth)
    "source:prayer":{  x:0.255,y:0.275 },  // clasped hands, prayer emanation
    "seal:trident":{   x:0.52, y:0.205 },  // Poseidon's trident, the divine mark
    "field:span":{     x:0.62, y:0.34 },   // mid-span of the reaching tether
    "target:ship":{    x:0.855,y:0.66 },   // tiny distant ship = Odysseus
    "brand:mark":{     x:0.855,y:0.61 },   // the stamped trident-brand
    "camera:wide":{    x:0.50, y:0.50 },
  },
  // affected regions
  zones:{
    shore:{ x0:0.02, y0:0.36, x1:0.38, y1:0.94 },   // the giant's kneeling ground
    span:{  x0:0.34, y0:0.16, x1:0.92, y1:0.46 },   // the tether corridor over the sea
    target:{x0:0.78, y0:0.52, x1:0.94, y1:0.74 },   // the branded ship footprint
  },
  // DIVINE_FX field states: prayer spoken -> curse reaches -> modifier attached
  states:{
    initial:"transform",
    nodes:{
      // source: prayer just spoken; glyph barely rising, seal faint, tether unstarted
      source:{    preview:{ t:0.4, intensity:0.30, rise:0.35, reach:0.0, lock:0.0,
                            status:"SPOKEN",   progress:0.12,
                            layers:["sea","giant","rise","ship"] } },
      // field: glyph risen, trident forms, the dark tether reaches across the sea
      field:{     preview:{ t:1.5, intensity:0.80, rise:1.0, reach:0.7, lock:0.0,
                            status:"REACHING", progress:0.52 } },
      // transform: tether locked, trident-brand stamped, curse-halo persistent (neutral)
      transform:{ preview:{ t:2.6, intensity:1.30, rise:1.0, reach:1.0, lock:1.0,
                            status:"CURSED",   progress:0.90 } },
    },
    edges:[["source","field"],["field","transform"],["transform","field"],["field","source"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","rise","reach","lock"],

  // neutral preview: the curse fully taken — prayer risen, trident seal charged,
  // the dark tether locked onto the tiny ship, trident-brand stamped, curse-halo
  // gripping her (reads unmistakably as a persistent journey-modifier attached).
  preview:()=>({ t:2.5, intensity:1.28, rise:1.0, reach:1.0, lock:1.0,
                 status:"CURSED", progress:0.88,
                 layers:["sea","giant","rise","trident","tether","ship","brand"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
