/* creature.hawk-and-dove-omen — the strike-omen that crosses the prince's right.
   CREATURE asset (OD-B15-S05). A hawk in a FAST DIAGONAL STRIKE, crossing FROM
   THE RIGHT and plunging down-left, a plucked DOVE clenched in its talons, loose
   FEATHERS FLYING from the collision. Read as an OMEN: a dashed STRIKE ARC dives
   in from the upper right with an arrowhead at its head so an augur can read the
   line of the plunge; a scatter of falling feathers trails the seize.

   NOT a humanoid rig — fully custom bird geometry from engine primitives, drawn
   in LOCAL space facing DOWN-LEFT (nose toward -x, the plunge direction), then
   banked steeply by the stage transform for the diagonal strike:
     · a lean teardrop body + narrow forked/wedge tail (a hawk, not a heavy eagle)
     · two swept two-segment wings (shoulder -> wrist -> splayed primaries),
       held in a fast half-folded STOOP rather than a stately spread
     · a small hook-beaked head that turns down at the prey
     · grasping legs whose talons cinch the dove
     · the dove held below: near-white body (level 2) so it separates tonally
       from the near-black hawk; limp neck & head, plucked wing, feathers coming
       loose at the grip.

   The hawk fills near-black ink (level 7); the dove near-paper (level 2) with a
   hard contour — the captured-white read. Loose feathers are light with a dark
   quill so they read against sky OR against the birds. Two performances:
     strike — mid-plunge, wings swept, prey secured, arc + feather-fall prominent
     seize  — the collision instant, talons cinched, dove thrashing, feathers burst
   SOLID grays + hard contour ONLY; the engine POST pass supplies the halftone.
   Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const norm = (x,y)=>{ const n=Math.hypot(x,y)||1; return { x:x/n, y:y/n }; };

const params = {
  bodyLen:0.170,     // hawk body length as a fraction of W (leaner/smaller than the eagle)
  horizon:0.88,      // faint ground line under the omen (the prince's court below)
  hawkTone:7,        // raptor ink level (near-black)
  doveTone:2,        // captured dove ink level (near-paper: the "white" read)
  flapSpeed:2.6,     // fast wingbeat rate for the live flap channel
  feathers:9,        // count of loose feathers flung from the collision
};

/* ---- omen sky the strike crosses: light field, a faint horizon over the
   court, drifting cloud steps, faint streaming air swept along the plunge ---- */
function drawSky(pen,g,W,H,t){
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  g.fillStyle = inkLevel(2); g.fillRect(0,H*0.52,W,H*(params.horizon-0.52));
  // cloud steps drifting across the mid sky
  g.fillStyle = inkLevel(2);
  for(let i=0;i<4;i++){
    const cx = ((i*0.31 + t*0.02)%1.1-0.05)*W;
    const cy = H*(0.16+0.12*(i%2));
    g.beginPath(); g.ellipse(cx,cy,W*0.12,H*0.026,0,0,TAU); g.fill();
  }
  // faint streaming air, raked DIAGONALLY down-left to echo the stoop
  g.strokeStyle = INK; g.lineWidth = 1.5; g.globalAlpha = 0.10; g.lineCap="round";
  for(let i=0;i<7;i++){
    const y = H*(0.10+i*0.085);
    g.beginPath(); g.moveTo(W*0.66, y); g.lineTo(W*0.34, y+H*0.05); g.stroke();
    g.beginPath(); g.moveTo(W*0.96, y+H*0.02); g.lineTo(W*0.72, y+H*0.06); g.stroke();
  }
  g.globalAlpha = 1;
  // horizon + court as a low silhouette (context, not baked cast)
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H-hy);
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 3);
  g.fillStyle = inkLevel(4);
  for(let x=W*0.05;x<W*0.95;x+=W*0.05){
    const r = W*0.015*(0.7+0.5*Math.abs(Math.sin(x)));
    g.beginPath(); g.arc(x, hy, r, Math.PI, TAU); g.fill();
  }
}

/* ---- the OMEN-READABLE STRIKE ARC: a dashed line diving in from the upper
   right, bending steeply OVER the hawk and driving AHEAD down-left with an
   arrowhead at its head so the plunge direction (right -> down-left) is legible.
   `reach` 0..1 pulls the head back toward the bird for the seize instant. ---- */
function drawStrikeArc(g,W,H,birdX,birdY,reach){
  const x0=W*0.97, y0=H*0.14;                          // entry, upper right
  const cx=birdX+W*0.12, cy=birdY-H*0.16;              // control above/right (taut bend)
  // head of the path drives AHEAD of the bird (steeply down-left)
  const aheadX = W*0.20, aheadY = H*0.78;
  const x1 = lerp(birdX-W*0.06, aheadX, reach);
  const y1 = lerp(birdY+H*0.06, aheadY, reach);
  g.save();
  g.strokeStyle = INK; g.globalAlpha = 0.6;
  g.lineWidth = Math.max(3, W*0.007); g.lineCap="round";
  g.setLineDash([W*0.022, W*0.016]);
  g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo(cx,cy,x1,y1); g.stroke();
  g.setLineDash([]);
  // arrowhead at the head of the path, pointing along the plunge
  const ang = Math.atan2(y1-cy, x1-cx);
  const ah = W*0.030;
  g.globalAlpha = 0.85; g.fillStyle = INK;
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x1 - Math.cos(ang-0.42)*ah, y1 - Math.sin(ang-0.42)*ah);
  g.lineTo(x1 - Math.cos(ang+0.42)*ah, y1 - Math.sin(ang+0.42)*ah);
  g.closePath(); g.fill();
  g.restore();
}

/* ---- FALLING FEATHERS flung from the collision: light blades with a dark
   quill so they read against sky and against the black hawk. Deterministic
   scatter seeded off index; `burst` 0..1 spreads them wider (the seize). Drawn
   in STAGE space around the grip point (gx,gy). ---- */
function drawFeathers(pen,g,W,H,gx,gy,burst,t){
  const n = params.feathers;
  const ft = toneSolid(inkLevel(2));
  for(let i=0;i<n;i++){
    const r = (i*0.61803)%1;                 // golden-ratio scatter, deterministic
    const spread = lerp(0.10, 0.24, burst);
    const ang = Math.PI*(0.55 + (r-0.5)*1.3);// mostly down-left & outward
    const dist = W*spread*(0.35 + r*0.9);
    const drift = Math.sin(t*1.6 + i)*W*0.008;
    const fx = gx + Math.cos(ang)*dist*1.15 + drift;
    const fy = gy + Math.abs(Math.sin(ang))*dist*0.9 + (r*0.4)*H*0.12;
    const fl = W*(0.028 + r*0.020);          // feather length
    const fa = ang + 0.6 + Math.sin(t*1.2+i)*0.25;   // feather tilt, gently fluttering
    const dx = Math.cos(fa), dy = Math.sin(fa);
    const nx = -dy, ny = dx;                 // perpendicular for the blade width
    const bw = fl*0.34;
    // light blade (leaf shape)
    pen.paint(()=>{
      g.moveTo(fx - dx*fl*0.5, fy - dy*fl*0.5);
      g.quadraticCurveTo(fx + nx*bw, fy + ny*bw, fx + dx*fl*0.5, fy + dy*fl*0.5);
      g.quadraticCurveTo(fx - nx*bw, fy - ny*bw, fx - dx*fl*0.5, fy - dy*fl*0.5);
      g.closePath();
    }, ft, Math.max(1.5, W*0.0025));
    // dark central quill
    pen.ink(()=>{ g.moveTo(fx - dx*fl*0.5, fy - dy*fl*0.5); g.lineTo(fx + dx*fl*0.55, fy + dy*fl*0.55); }, Math.max(1.5,W*0.003));
  }
}

/* ---- the captured DOVE, drawn in LOCAL hawk space around a grip point.
   Light fill + hard contour = the "white dove" read against the black hawk.
   Plucked: a couple of feathers lift free at the shoulder. `thrash` 0..1
   splays the wing & lifts the neck (the struggle). ---- */
function drawDove(pen,g,bl,grip,thrash){
  const dt = toneSolid(inkLevel(params.doveTone));
  const cw = Math.max(2.5, bl*0.05);
  const bx = grip.x + bl*0.10, by = grip.y + bl*0.44;   // dove body centre, below the talons
  const dbw = bl*0.40, dbh = bl*0.26;                    // rounded but slighter than a goose

  // one plucked wing (behind body), flung up as it struggles
  const wingLift = lerp(0.30, 0.90, thrash);
  pen.paint(()=>{
    g.moveTo(bx+dbw*0.1, by-dbh*0.3);
    g.quadraticCurveTo(bx+dbw*0.9, by-dbh*(0.6+wingLift), bx+dbw*1.45, by-dbh*(0.2+wingLift*0.7));
    g.quadraticCurveTo(bx+dbw*0.95, by+dbh*0.1, bx+dbw*0.2, by+dbh*0.2);
    g.closePath();
  }, dt, cw);

  // rounded body
  pen.paint(()=>{ g.ellipse(bx, by, dbw, dbh, 0.12, 0, TAU); }, dt, cw);

  // short dove neck curving forward to a small round head + tiny bill (dangling)
  const nEnd = { x: bx - dbw*0.95, y: by + lerp(dbh*1.5, dbh*0.5, thrash) };
  pen.limb(()=>{
    g.moveTo(bx-dbw*0.45, by+dbh*0.05);
    g.quadraticCurveTo(bx-dbw*1.05, by+dbh*(0.6+0.6*(1-thrash)), nEnd.x, nEnd.y);
  }, dt, bl*0.065);
  pen.paint(()=>{ g.arc(nEnd.x, nEnd.y, bl*0.050, 0, TAU); }, dt, cw*0.9);
  pen.paint(()=>{
    g.moveTo(nEnd.x-bl*0.025, nEnd.y-bl*0.015);
    g.lineTo(nEnd.x-bl*0.085, nEnd.y+bl*0.005);
    g.lineTo(nEnd.x-bl*0.025, nEnd.y+bl*0.03);
    g.closePath();
  }, dt, 1.5);
  // eye dot (dark, on the light head)
  pen.fillPath(()=>{ g.arc(nEnd.x-bl*0.010, nEnd.y-bl*0.006, bl*0.011, 0, TAU); }, inkLevel(7));

  // fanned dove tail behind the body
  pen.paint(()=>{
    g.moveTo(bx+dbw*0.7, by-dbh*0.1);
    g.lineTo(bx+dbw*1.5, by-dbh*0.35);
    g.lineTo(bx+dbw*1.55, by+dbh*0.15);
    g.lineTo(bx+dbw*1.5, by+dbh*0.55);
    g.lineTo(bx+dbw*0.7, by+dbh*0.25);
    g.closePath();
  }, dt, cw);

  // two legs trailing back & down (kicking)
  g.strokeStyle = INK; g.lineWidth = Math.max(2, bl*0.028); g.lineCap="round";
  for(let s=-1;s<=1;s+=2){
    const lx = bx + dbw*(0.55+0.15*s), ly = by + dbh*0.55;
    const kick = lerp(0.2, 0.7, thrash);
    g.beginPath(); g.moveTo(lx, ly);
    g.lineTo(lx + bl*0.09, ly + bl*(0.20 - kick*0.11*s));
    g.stroke();
  }

  // plucked feathers lifting free at the shoulder (the "feathers flying" close read)
  const pft = toneSolid(inkLevel(2));
  for(let k=0;k<2;k++){
    const px = bx - dbw*(0.1+0.35*k), py = by - dbh*(1.2 + 0.5*k) - thrash*bl*0.1;
    const pl = bl*0.10;
    pen.paint(()=>{
      g.moveTo(px, py+pl*0.5);
      g.quadraticCurveTo(px+pl*0.35, py, px, py-pl*0.5);
      g.quadraticCurveTo(px-pl*0.35, py, px, py+pl*0.5);
      g.closePath();
    }, pft, 1.5);
    pen.ink(()=>{ g.moveTo(px, py+pl*0.5); g.lineTo(px, py-pl*0.5); }, 1.5);
  }

  // a couple of feather seams on the body for read
  pen.seam(()=>{ g.moveTo(bx-dbw*0.3, by-dbh*0.1); g.quadraticCurveTo(bx+dbw*0.1, by+dbh*0.2, bx+dbw*0.6, by+dbh*0.05); }, 2);
}

/* ---- ONE hawk in LOCAL space, facing DOWN-LEFT (nose toward -x = the plunge
   direction), holding the dove below its talons. Pose channels:
     spread 0..1  wing extension (low = swept stoop)   flap -1..1  wingtip sweep
     grip   0..1  talon cinch                          head -1..1  head turn
     thrash 0..1  the dove's struggle ---- */
function drawHawk(pen,g,W,P){
  const bl  = W*params.bodyLen;
  const bhw = bl*0.19;                 // body half-height (leaner than the eagle)
  const tone = toneSolid(inkLevel(params.hawkTone));
  const cw = Math.max(2.5, W*0.006);
  const spread = clamp01(P.spread ?? 0.8);
  const flap   = clamp(P.flap ?? 0.2, -1, 1);
  const grip   = clamp01(P.grip ?? 0.7);
  const head   = clamp(P.head ?? -0.4, -1, 1);
  const thrash = clamp01(P.thrash ?? 0.3);

  const spreadF = 0.50 + 0.50*spread;
  const inner   = bl*0.60*spreadF;     // shoulder -> wrist
  const outer   = bl*0.56*spreadF;     // wrist -> primary tip
  const sh      = { x: -bl*0.03, y: -bhw*0.15 };   // wing root at the shoulder

  /* ---- WINGS: two swept two-segment wings. In a stoop they rake back sharply,
     one high-back (right) one low-forward (left) for depth. Drawn behind body. */
  const wing = (dirx, upFrac)=>{
    const lead = norm(dirx, -1.15);                 // sweep up + out, shallower than the eagle
    const wrist = { x: sh.x + lead.x*inner, y: sh.y + lead.y*inner*upFrac };
    const out  = norm(dirx*1.7, -0.7);              // primaries rake further out
    const tip  = { x: wrist.x + out.x*outer, y: wrist.y + out.y*outer*upFrac };
    const flapY = flap*bl*0.18;                     // live wingtip sweep
    tip.y += flapY;
    pen.paint(()=>{
      g.moveTo(sh.x - Math.sign(dirx)*bl*0.02, sh.y - bl*0.05);
      g.quadraticCurveTo((sh.x+wrist.x)/2 + dirx*bl*0.05, (sh.y+wrist.y)/2 - bl*0.05,
                         wrist.x, wrist.y);
      g.quadraticCurveTo(lerp(wrist.x,tip.x,0.5)+dirx*bl*0.03, lerp(wrist.y,tip.y,0.5)-bl*0.02,
                         tip.x, tip.y);                                    // leading -> tip
      g.quadraticCurveTo(tip.x - dirx*outer*0.14, tip.y + bl*0.18,
                         wrist.x + dirx*outer*0.06, wrist.y + bl*0.14);    // tip -> wrist (trailing)
      g.quadraticCurveTo(lerp(wrist.x,sh.x,0.5), lerp(wrist.y,sh.y,0.5)+bl*0.14,
                         sh.x, sh.y + bl*0.09);                            // wrist -> body
      g.closePath();
    }, tone, cw);
    // splayed primary "fingers" off the outer wing (the raked hawk tips)
    g.strokeStyle = INK; g.lineWidth = Math.max(2, W*0.0045); g.lineCap="round";
    for(let k=0;k<4;k++){
      const f0 = 0.50 + k*0.15;
      const fx = lerp(wrist.x, tip.x, f0), fy = lerp(wrist.y, tip.y, f0);
      g.beginPath(); g.moveTo(fx, fy);
      g.lineTo(fx + dirx*outer*0.16, fy + bl*0.11 + k*bl*0.02);
      g.stroke();
    }
    pen.seam(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(lerp(sh.x,wrist.x,0.7), lerp(sh.y,wrist.y,0.7)); }, 2);
  };
  wing( 1.0, 1.0);      // far wing: sweeps up-back (right)
  wing(-1.0, 0.90);     // near wing: sweeps up-forward (left)

  /* ---- LEGS + TALONS reaching DOWN from the belly to clench the prey ---- */
  const grabY = bhw*0.9 + bl*0.28;        // where the talons meet the dove top
  const leg = (side)=>{
    const hip  = { x: side*bhw*0.5, y: bhw*0.4 };
    const foot = { x: side*bhw*0.55*(1-grip*0.4), y: grabY };
    pen.limb(()=>{ g.moveTo(hip.x, hip.y); g.lineTo(foot.x, foot.y); }, tone, bl*0.065);
    // hooked claws cinching around the prey (curl inward with grip)
    g.strokeStyle = INK; g.lineWidth = Math.max(2, W*0.0055); g.lineCap="round";
    for(let c=-1;c<=1;c++){
      const cl = bl*0.13;
      const a = c*0.55 + side*0.2;
      const curl = 0.5 + 0.6*grip;
      g.beginPath();
      g.moveTo(foot.x, foot.y);
      g.quadraticCurveTo(foot.x + Math.sin(a)*cl, foot.y + cl*0.5,
                         foot.x + Math.sin(a)*cl*curl, foot.y + cl*curl);
      g.stroke();
    }
  };
  leg(-1); leg(1);

  // the captured dove hangs below, gripped between the talons
  drawDove(pen, g, bl, { x:0, y:grabY }, thrash);

  /* ---- BODY (lean teardrop, nose DOWN-LEFT) + narrow tail (trailing right) ---- */
  pen.paint(()=>{
    g.moveTo(-bl*0.62, -bhw*0.05);                                   // nose (left)
    g.quadraticCurveTo(-bl*0.26, -bhw*1.05, bl*0.06, -bhw*0.85);     // crown/back
    g.quadraticCurveTo( bl*0.40, -bhw*0.50, bl*0.58, -bhw*0.20);     // toward tail top
    g.lineTo(bl*0.52, 0);                                            // tail root notch
    g.quadraticCurveTo(bl*0.38, bhw*0.50, bl*0.02, bhw*0.90);        // belly
    g.quadraticCurveTo(-bl*0.30, bhw*0.98, -bl*0.62, -bhw*0.05);     // belly -> nose
    g.closePath();
  }, tone, cw);
  // narrow banded tail fanning off the back (hawk tail: longer, slimmer)
  pen.paint(()=>{
    g.moveTo(bl*0.48, -bhw*0.30);
    g.lineTo(bl*1.02, -bhw*0.42);
    g.lineTo(bl*0.98, bhw*0.12);
    g.lineTo(bl*1.00, bhw*0.55);
    g.lineTo(bl*0.48, bhw*0.28);
    g.closePath();
  }, tone, cw);
  pen.seam(()=>{ g.moveTo(bl*0.60, -bhw*0.18); g.lineTo(bl*0.98, -bhw*0.22); }, 2);
  pen.seam(()=>{ g.moveTo(bl*0.60, bhw*0.10); g.lineTo(bl*0.98, bhw*0.28); }, 2);

  /* ---- HEAD + hooked beak, thrust out DOWN-LEFT on a short neck (turns with `head`) ---- */
  const hR  = bl*0.165;
  const hx  = -bl*0.72;
  const hy  = -bhw*0.28 + head*hR*0.4;
  pen.limb(()=>{ g.moveTo(-bl*0.40, -bhw*0.20); g.lineTo(hx+hR*0.5, hy+hR*0.2); }, tone, bl*0.15);
  pen.paint(()=>{ g.arc(hx, hy, hR, 0, TAU); }, tone, cw);
  // short hooked hawk beak pointing left-forward
  pen.paint(()=>{
    g.moveTo(hx - hR*0.55, hy - hR*0.40);
    g.lineTo(hx - hR*1.75, hy + head*hR*0.25 - hR*0.02);
    g.quadraticCurveTo(hx - hR*1.55, hy + hR*0.55, hx - hR*1.20, hy + hR*0.32);  // hook tip
    g.lineTo(hx - hR*0.45, hy + hR*0.50);
    g.quadraticCurveTo(hx - hR*0.18, hy + hR*0.10, hx - hR*0.55, hy - hR*0.40);
    g.closePath();
  }, tone, 2);
  // fierce eye: bright ring + dark pupil (tonal contrast on the black head)
  pen.fillPath(()=>{ g.arc(hx + hR*0.02, hy - hR*0.12, hR*0.32, 0, TAU); }, inkLevel(1));
  pen.fillPath(()=>{ g.arc(hx - hR*0.02, hy - hR*0.12, hR*0.15, 0, TAU); }, inkLevel(7));
}

/* ---- per-state strike pose + placement (fraction of W/H). The hawk crosses
   from the RIGHT and plunges: a steep down-left bank distinguishes it from the
   stately eagle crossing. ---- */
function poseFor(pose, t){
  const beat = Math.sin(t*params.flapSpeed);
  const P = {
    strike:{
      x:0.60, y:0.40, s:1.0, bank:0.42,
      spread:0.80, flap:0.35+beat*0.30, grip:0.8, head:-0.45, thrash:0.35, arc:1.0, burst:0.6,
    },
    seize:{
      x:0.55, y:0.46, s:1.05, bank:0.55,
      spread:0.60, flap:0.80+beat*0.12, grip:1.0, head:0.6, thrash:0.9, arc:0.4, burst:1.0,
    },
  };
  return P[pose] || P.strike;
}

function drawCreature(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const pose = st.pose || "strike";
  const t = st.t || 0;
  const layers = st.layers || ["sky","arc","hawk","feathers"];
  const has = l => layers.includes(l);
  const P = poseFor(pose, t);
  const bob = Math.sin(t*1.4)*H*0.006;
  const bx = P.x*W, by = P.y*H + bob;

  if (has("sky")) drawSky(pen,g,W,H,t);
  if (has("arc")) drawStrikeArc(g,W,H,bx,by,P.arc);
  if (has("hawk")){
    g.save();
    g.translate(bx, by);
    g.rotate(P.bank);
    g.scale(P.s, P.s);
    drawHawk(pen, g, W, P);
    g.restore();
  }
  // feathers flung from the collision — drawn in STAGE space so they scatter
  // across the sky independent of the hawk's bank (the grip point ~ below body)
  if (has("feathers")){
    const gx = bx + Math.sin(P.bank)*W*0.02;
    const gy = by + Math.cos(P.bank)*H*0.08;
    drawFeathers(pen,g,W,H,gx,gy,P.burst,t);
  }
  return { anchors: asset.anchors };
}

export const asset = {
  id:"creature.hawk-and-dove-omen",
  type:"CREATURE",
  name:"Hawk and dove omen",
  statusWord:"OMEN",
  scene:"OD-B15-S05",

  params,
  // back -> front draw order the creature honors; scene state can pass a subset
  layers:["sky","arc","hawk","feathers"],
  // normalized 0..1 attention / body / contact / camera anchors (neutral STRIKE pose)
  anchors:{
    "hawk:body":{ x:0.60, y:0.40 },
    "hawk:head":{ x:0.50, y:0.44 },      // the hooked head, leading the plunge (down-left)
    "hawk:tail":{ x:0.70, y:0.36 },
    "hawk:talons":{ x:0.58, y:0.50 },    // grip point on the prey
    "dove:body":{ x:0.59, y:0.56 },      // the captured dove, held below
    "dove:head":{ x:0.53, y:0.60 },      // its dangling head
    "path:entry":{ x:0.96, y:0.10 },     // strike arc enters upper-right
    "path:head":{ x:0.36, y:0.60 },      // arrowhead of the plunge line
    "omen:target":{ x:0.22, y:0.82 },    // the prince the sign crosses toward (his right)
    "feathers:burst":{ x:0.58, y:0.56 }, // where loose feathers fly
    "camera:strike":{ x:0.54, y:0.44 },
  },
  // collision proxy for the striking pair (normalized)
  collision:{
    hawk:{ shape:"ellipse", cx:0.60, cy:0.40, rx:0.24, ry:0.15 },
    dove:{ shape:"ellipse", cx:0.59, cy:0.56, rx:0.08, ry:0.06 },
  },
  // two performances the scene can drive
  states:{
    initial:"strike",
    nodes:{
      strike:{ preview:{ pose:"strike", status:"STRIKING", progress:0.40 } },
      seize:{  preview:{ pose:"seize",  status:"SEIZE",    progress:0.75 } },
    },
    edges:[["strike","seize"],["seize","strike"]],
  },
  duration:4.0,
  // strike-pose channels the runtime can drive over the scene clock
  channels:["t","pose","spread","flap","grip","head","thrash","bank","burst"],

  // neutral preview: the hawk mid-STRIKE from the right, plucked dove clutched
  // below, dashed omen arc diving in, feathers flying — reads as "hawk and dove omen".
  preview:()=>({ pose:"strike", t:0.5, status:"OMEN", progress:0.40,
                 layers:["sky","arc","hawk","feathers"] }),
  draw(ctx,W,H,state){ return drawCreature(ctx,W,H,state||{}); },
};
export default asset;
