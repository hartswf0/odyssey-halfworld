/* location.phaeacian-feast-hall — the quiet narrative chamber of the Phaeacians,
   where the guest (Odysseus) tells his tale from a place of honour by the fire.
   LOCATION asset (empty navigable set — NO baked characters). Built in SOLID
   grays + hard contour into the offscreen ctx; the engine dotify pass supplies
   the halftone. Declares fg/mid/bg depth, a walkable ground zone, a focal
   guest-speaker seat, an attentive RADIAL arrangement of EMPTY audience seats
   fanned around the speaker, flanking feast tables, and a central hearth — plus
   a focus point, placement anchors and camera anchors.
   Atlas: OD-B09-S01 — quiet chamber, guest as focal speaker, radial audience. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  floorLevel:0.54,     // horizon / floor line as fraction of H
  hearth:true,         // central back-wall hearth (the room's warm anchor)
  speakerSeat:true,    // the focal guest-speaker's seat of honour by the fire
  rings:3,             // concentric arcs of the radial audience
  ringSeats:[5,7,9],   // empty seats per arc (near -> far)
  tables:true,         // flanking feast tables in the foreground
  fanDeg:70,           // half-angle the audience fan sweeps around the speaker
};

const RAD = Math.PI/180;

/* one empty seat glyph: a low stool/chair drawn in near side-view.
   `back` = 'L' | 'R' | 'C' — which side the backrest is on (audience faces
   the speaker, so the backrest sits on the side AWAY from centre). */
function drawSeat(pen, g, x, y, s, back){
  const sw = 26*s, sh = 9*s;
  // legs
  pen.paint(()=>{ g.rect(x-sw*0.42, y-sh*0.2, sw*0.14, sh*1.5); }, toneSolid(inkLevel(6)), 2);
  pen.paint(()=>{ g.rect(x+sw*0.28, y-sh*0.2, sw*0.14, sh*1.5); }, toneSolid(inkLevel(6)), 2);
  // seat block (empty — a place, not a person)
  pen.paint(()=>{ g.rect(x-sw/2, y-sh, sw, sh); }, toneSolid(inkLevel(4)), 3);
  // backrest on the side away from the speaker
  if (back==='L') pen.paint(()=>{ g.rect(x-sw/2, y-sh-18*s, 7*s, 18*s); }, toneSolid(inkLevel(5)), 3);
  else if (back==='R') pen.paint(()=>{ g.rect(x+sw/2-7*s, y-sh-18*s, 7*s, 18*s); }, toneSolid(inkLevel(5)), 3);
  else pen.paint(()=>{ g.rect(x-sw*0.16, y-sh-11*s, sw*0.32, 11*s); }, toneSolid(inkLevel(5)), 2);
}

/* draw a subset of layers so scene state can reveal/occlude depth + focus */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const T = st.t || 0;
  const cx = W*0.5;
  // hush: 0 = lively feast, 1 = the room fallen quiet for the tale
  const hush = st.hush != null ? st.hush : 1;
  // attention: 0 = seats scattered/turned away, 1 = all faced on the speaker
  const attention = st.attention != null ? st.attention : 1;
  const layers = st.layers || ["backwall","hearth","sidewalls","floor",
    "audience","tables","speakerseat","focus","anchors"];
  const has = l => layers.includes(l);

  // focus point — head-height above the speaker's seat, before the fire
  const fx = cx, fy = horizon - H*0.055;

  // ---- BACK WALL (mid tone; a touch darker as the room hushes) ----
  if (has("backwall")){
    const wallTone = Math.round(lerp(3.0, 3.5, clamp(hush,0,1)));
    pen.paint(()=>{ g.rect(W*0.05, H*0.10, W*0.90, horizon-H*0.10); }, toneSolid(inkLevel(wallTone)), 5);
    // frieze / cornice band along the top of the wall (breaks the flat field)
    pen.paint(()=>{ g.rect(W*0.05, H*0.10, W*0.90, H*0.045); }, toneSolid(inkLevel(5)), 4);
    for(let i=0;i<26;i++){ const dx=W*0.06 + (W*0.88)*(i/25);
      pen.ink(()=>{ g.moveTo(dx, H*0.112); g.lineTo(dx, H*0.14); }, 2); }
    // pilasters ribbing the wall (shallow relief, skip the hearth zone)
    for(const px of [0.16,0.30,0.70,0.84]){
      pen.paint(()=>{ g.rect(W*px-W*0.012, H*0.145, W*0.024, horizon-H*0.20); }, toneSolid(inkLevel(4)), 3);
    }
    // a low dado line along the wall
    pen.ink(()=>{ g.moveTo(W*0.05, horizon-H*0.06); g.lineTo(W*0.95, horizon-H*0.06); }, 2);
  }

  // ---- SIDE WALLS framing the chamber depth ----
  if (has("sidewalls")){
    pen.paint(()=>{ g.moveTo(0,H*0.05); g.lineTo(W*0.05,H*0.10); g.lineTo(W*0.05,horizon); g.lineTo(0,horizon+H*0.06); g.closePath(); }, toneSolid(inkLevel(4)), 4);
    pen.paint(()=>{ g.moveTo(W,H*0.05); g.lineTo(W*0.95,H*0.10); g.lineTo(W*0.95,horizon); g.lineTo(W,horizon+H*0.06); g.closePath(); }, toneSolid(inkLevel(4)), 4);
  }

  // ---- HEARTH — the central back-wall fire, the room's warm anchor.
  // Framed by stone (dark jambs + lintel) around a BRIGHT glowing fire, so it
  // reads as a hearth and not a black cave. ----
  if (has("hearth") && params.hearth){
    const hw = W*0.18, hx = cx, jw = W*0.028;
    const baseY = horizon, topY = horizon - H*0.15;
    // bright interior wash behind the fire (the glow lights the recess)
    pen.paint(()=>{ g.rect(hx-hw/2, topY, hw, baseY-topY); }, toneSolid(inkLevel(2)), 3);
    // stone jambs + lintel (dark frame only — thin, so no blob)
    pen.paint(()=>{ g.rect(hx-hw/2-jw, topY, jw, baseY-topY); }, toneSolid(inkLevel(6)), 4);   // left jamb
    pen.paint(()=>{ g.rect(hx+hw/2, topY, jw, baseY-topY); }, toneSolid(inkLevel(6)), 4);       // right jamb
    pen.paint(()=>{ g.rect(hx-hw/2-jw, topY-H*0.028, hw+jw*2, H*0.028); }, toneSolid(inkLevel(6)), 4); // lintel
    // mantel shelf + short tapering hood above the lintel
    pen.paint(()=>{ g.rect(hx-hw/2-jw*1.6, topY-H*0.04, hw+jw*3.2, H*0.014); }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.moveTo(hx-hw*0.42, topY-H*0.04); g.lineTo(hx+hw*0.42, topY-H*0.04);
      g.lineTo(hx+hw*0.18, topY-H*0.10); g.lineTo(hx-hw*0.18, topY-H*0.10); g.closePath(); }, toneSolid(inkLevel(4)), 3);
    // FIRE — bright flame tongues (light tone => few dots => reads as glow)
    const flick = Math.sin(T*3.0)*0.4 + Math.sin(T*5.3)*0.25;
    for(let i=-2;i<=2;i++){
      const fxp = hx + i*hw*0.19;
      const fh = H*0.115*(1 - Math.abs(i)*0.14) * (1 + 0.06*Math.sin(T*4+i));
      pen.paint(()=>{
        g.moveTo(fxp-hw*0.09, baseY-H*0.006);
        g.quadraticCurveTo(fxp-hw*0.05, baseY-fh*0.6, fxp+flick*6, baseY-fh);
        g.quadraticCurveTo(fxp+hw*0.05, baseY-fh*0.6, fxp+hw*0.09, baseY-H*0.006);
        g.closePath();
      }, toneSolid(inkLevel(i===0?1:2)), 2);
    }
    // dark logs at the base of the fire
    for(const ls of [-1,1]) pen.paint(()=>{ g.ellipse(hx+ls*hw*0.16, baseY-H*0.006, hw*0.18, H*0.012, ls*0.3, 0, 7); }, toneSolid(inkLevel(6)), 3);
  }

  // ---- FLOOR (foreground, light; radial lines fan out from the speaker) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.26;
    for(let i=-7;i<=7;i++){ g.beginPath(); g.moveTo(fx, horizon); g.lineTo(cx+i*W*0.135, H); g.stroke(); }
    for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- RADIAL AUDIENCE — concentric arcs of EMPTY seats around the speaker ----
  if (has("audience")){
    const aMax = params.fanDeg*RAD;
    for(let k=0;k<params.rings;k++){
      const R = H*0.14 + k*H*0.115;
      const n = params.ringSeats[k] || 6;
      for(let i=0;i<n;i++){
        const a = n===1 ? 0 : lerp(-aMax, aMax, i/(n-1));
        // attention turns the fan inward (scattered angles when low)
        const aa = a * lerp(1.35, 1.0, clamp(attention,0,1));
        const x = fx + Math.sin(aa)*R;
        const y = fy + Math.cos(aa)*R*0.66;
        if (y < horizon+H*0.01) continue;         // keep seats in the audience floor
        const s = clamp(0.55 + (y-horizon)/(H*0.62), 0.5, 1.25);
        const back = Math.abs(aa) < 0.22 ? 'C' : (x < fx ? 'L' : 'R');
        drawSeat(pen, g, x, y, s, back);
      }
    }
  }

  // ---- FEAST TABLES flanking the chamber (foreground) ----
  if (has("tables") && params.tables){
    for(const sgn of [-1,1]){
      const nearX = cx + sgn*W*0.40, nearY = H*0.985;
      const farX  = cx + sgn*W*0.30, farY = horizon + H*0.14;
      pen.paint(()=>{
        g.moveTo(farX - W*0.055, farY);
        g.lineTo(farX + W*0.055, farY);
        g.lineTo(nearX + W*0.09, nearY);
        g.lineTo(nearX - W*0.10, nearY);
        g.closePath();
      }, toneSolid(inkLevel(3)), 5);
      pen.ink(()=>{ g.moveTo(nearX - W*0.10, nearY); g.lineTo(nearX + W*0.09, nearY); }, 3);
      // cups / dishes set out for the feast
      for(let k=0;k<3;k++){
        const p=(k+1)/4; const dx=lerp(farX, nearX, p), dy=lerp(farY, nearY, p);
        pen.paint(()=>{ g.ellipse(dx, dy, W*0.018*(0.6+0.6*p), W*0.008*(0.6+0.6*p), 0,0,7); }, toneSolid(inkLevel(5)), 2);
      }
    }
  }

  // ---- SPEAKER'S SEAT — focal guest-seat of honour, before the fire ----
  if (has("speakerseat") && params.speakerSeat){
    const sw=W*0.125, sh=H*0.20;
    const sx=cx, sy=horizon + H*0.10;
    // low dais under the seat (an elevated place)
    pen.paint(()=>{ g.rect(sx-sw*1.0, sy+H*0.004, sw*2.0, H*0.04); }, toneSolid(inkLevel(4)), 4);
    pen.paint(()=>{ g.rect(sx-sw*0.78, sy-H*0.028, sw*1.56, H*0.04); }, toneSolid(inkLevel(3)), 4);
    // tall seat back (spotlit — lighter than the hushed room)
    const backTone = Math.round(lerp(4.0, 3.0, clamp(hush,0,1)));
    pen.paint(()=>{ g.rect(sx-sw/2, sy-sh, sw, sh*0.78); }, toneSolid(inkLevel(backTone)), 5);
    // crest atop the back
    pen.paint(()=>{ g.moveTo(sx-sw*0.5, sy-sh); g.lineTo(sx, sy-sh-H*0.03); g.lineTo(sx+sw*0.5, sy-sh); g.closePath(); }, toneSolid(inkLevel(5)), 4);
    // bright inlay up the back
    pen.paint(()=>{ g.rect(sx-sw*0.11, sy-sh+H*0.013, sw*0.22, sh*0.5); }, toneSolid(inkLevel(1)), 3);
    // seat cushion (empty)
    pen.paint(()=>{ g.rect(sx-sw*0.56, sy-sh*0.1, sw*1.12, sh*0.28); }, toneSolid(inkLevel(2)), 5);
    // arms
    pen.paint(()=>{ g.rect(sx-sw*0.56, sy-sh*0.18, sw*0.15, sh*0.44); }, toneSolid(inkLevel(5)), 4);
    pen.paint(()=>{ g.rect(sx+sw*0.41, sy-sh*0.18, sw*0.15, sh*0.44); }, toneSolid(inkLevel(5)), 4);
    // footstool before the seat (the guest's place)
    pen.paint(()=>{ g.rect(sx-sw*0.34, sy+H*0.05, sw*0.68, H*0.03); }, toneSolid(inkLevel(4)), 3);
  }

  // ---- FOCUS POINT — the quiet centre of attention above the seat ----
  if (has("focus")){
    g.save();
    for(let i=2;i>=0;i--){
      const rr = W*0.026 + i*W*0.028 + Math.sin(T*1.4+i)*W*0.004;
      g.strokeStyle=INK; g.lineWidth=Math.max(2, 4.0 - i*1.0);
      g.beginPath(); g.arc(fx, fy, rr, 0, 7); g.stroke();
    }
    g.fillStyle=inkLevel(7);
    g.beginPath(); g.arc(fx, fy, W*0.015, 0, 7); g.fill();
    g.restore();
  }
}

export const asset = {
  id:"location.phaeacian-feast-hall",
  type:"LOCATION",
  name:"Phaeacian Feast Hall",
  statusWord:"ATTENTIVE",
  scene:"OD-B09-S01",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["backwall","hearth","sidewalls","floor","audience","tables","speakerseat","focus","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "seat:speaker":{x:.50,y:.60}, "focus:tale":{x:.50,y:.52},
    "hearth:fire":{x:.50,y:.44}, "footstool:guest":{x:.50,y:.65},
    "arc:near-left":{x:.34,y:.72}, "arc:near-right":{x:.66,y:.72},
    "arc:mid-left":{x:.28,y:.66}, "arc:mid-right":{x:.72,y:.66},
    "arc:far-left":{x:.34,y:.60}, "arc:far-right":{x:.66,y:.60},
    "table:left":{x:.28,y:.86}, "table:right":{x:.72,y:.86},
    "aisle:center":{x:.50,y:.92}, "threshold:back":{x:.50,y:.30},
    "entrance:left":{x:.06,y:.82}, "exit:right":{x:.94,y:.82},
    "camera:wide":{x:.50,y:.50}, "camera:speaker":{x:.50,y:.56}, "camera:focus":{x:.50,y:.50},
  },
  // walkable ground region (for scene placement / pathing) + sub-zones
  zones:{
    walkable:{ x0:.08,y0:.55,x1:.92,y1:.98 },
    "speaker-dais":{ x0:.40,y0:.56,x1:.60,y1:.66 },
    "audience-arc":{ x0:.14,y0:.58,x1:.86,y1:.90 },
    "tables-fg":{ x0:.10,y0:.72,x1:.90,y1:.99 },
  },
  states:{
    initial:"attentive",
    nodes:{
      // OD-B09-S01: quiet chamber, guest as focal speaker, radial audience faced on him
      attentive:{ preview:{ layers:["backwall","hearth","sidewalls","floor","audience","tables","speakerseat","focus"], attention:1, hush:1 } },
      // the feast still lively, seats turned, no single focus yet
      feasting:{ preview:{ layers:["backwall","hearth","sidewalls","floor","audience","tables","speakerseat"], attention:0.2, hush:0.15 } },
      // the chamber emptied — just the set, the seats, the banked fire
      empty:{ preview:{ layers:["backwall","hearth","sidewalls","floor","audience","tables","speakerseat"], attention:0, hush:0.5 } },
    },
    edges:[["feasting","attentive"],["attentive","feasting"],["attentive","empty"]],
  },
  channels:["attention","hush","reveal","camera","light","t"],

  preview:()=>({ layers:["backwall","hearth","sidewalls","floor","audience","tables","speakerseat","focus"], attention:1, hush:1, t:0.6, status:"ATTENTIVE", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
